import "server-only";

/**
 * QPay merchant API v2.
 *
 * QPAY_MODE=live     → https://merchant.qpay.mn/v2 (real money)
 * QPAY_MODE=sandbox  → https://merchant-sandbox.qpay.mn/v2 (QPay test account)
 * QPAY_MODE unset    → mock: a fake QR is shown and a test button marks the
 *                      payment paid. Lets the whole flow be tried before the
 *                      gym's QPay contract is ready.
 *
 * Live/sandbox need QPAY_CLIENT_ID, QPAY_CLIENT_SECRET, QPAY_INVOICE_CODE
 * (from QPay after the gym signs its merchant contract) and PUBLIC_URL so
 * QPay can call /api/qpay/callback.
 *
 * We never trust the callback itself: it only triggers a /payment/check call
 * against QPay, and the payment is marked paid only if QPay says it is.
 */

export type QpayMode = "live" | "sandbox" | "mock";

export function qpayMode(): QpayMode {
  const m = process.env.QPAY_MODE;
  return m === "live" || m === "sandbox" ? m : "mock";
}

function baseUrl() {
  return qpayMode() === "live" ? "https://merchant.qpay.mn/v2" : "https://merchant-sandbox.qpay.mn/v2";
}

let cached: { token: string; expiresAt: number } | null = null;

async function token(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  const id = process.env.QPAY_CLIENT_ID;
  const secret = process.env.QPAY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("QPAY_CLIENT_ID / QPAY_CLIENT_SECRET not set");
  const res = await fetch(`${baseUrl()}/auth/token`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64") },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`QPay auth failed: ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  // expires_in is a unix timestamp (seconds) in QPay's v2 API; fall back to 30 min.
  const exp = j.expires_in > 1e9 ? j.expires_in * 1000 : Date.now() + 30 * 60_000;
  cached = { token: j.access_token, expiresAt: exp };
  return j.access_token;
}

async function call<T>(path: string, init: { method: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: init.method,
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`QPay ${path} failed: ${res.status} ${t.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

export type Invoice = {
  invoiceId: string;
  qrText: string;
  qrImage?: string; // base64 PNG
  urls: { name: string; link: string; logo?: string }[];
};

export async function createInvoice(p: {
  paymentId: string;
  amountMnt: number;
  description: string;
  receiverCode: string;
  callbackUrl: string;
}): Promise<Invoice> {
  if (qpayMode() === "mock") {
    return { invoiceId: `mock-${p.paymentId}`, qrText: `MOCK-QPAY:${p.paymentId}:${p.amountMnt}`, urls: [] };
  }
  const j = await call<{
    invoice_id: string;
    qr_text: string;
    qr_image: string;
    urls?: { name: string; link: string; logo?: string }[];
  }>("/invoice", {
    method: "POST",
    body: {
      invoice_code: process.env.QPAY_INVOICE_CODE,
      sender_invoice_no: p.paymentId,
      invoice_receiver_code: p.receiverCode,
      invoice_description: p.description,
      amount: p.amountMnt,
      callback_url: p.callbackUrl,
    },
  });
  return { invoiceId: j.invoice_id, qrText: j.qr_text, qrImage: j.qr_image, urls: j.urls ?? [] };
}

/** True if QPay has a PAID payment covering the full amount for this invoice. */
export async function isInvoicePaid(invoiceId: string, amountMnt: number): Promise<boolean> {
  if (qpayMode() === "mock") return false;
  const j = await call<{ count: number; paid_amount?: number; rows?: { payment_status: string; payment_amount?: string | number }[] }>(
    "/payment/check",
    {
      method: "POST",
      body: { object_type: "INVOICE", object_id: invoiceId, offset: { page_number: 1, page_limit: 100 } },
    },
  );
  const paid = (j.rows ?? [])
    .filter((r) => r.payment_status === "PAID")
    .reduce((s, r) => s + Number(r.payment_amount ?? 0), 0);
  return Math.max(paid, Number(j.paid_amount ?? 0)) >= amountMnt;
}

export async function cancelInvoice(invoiceId: string): Promise<void> {
  if (qpayMode() === "mock") return;
  await call(`/invoice/${invoiceId}`, { method: "DELETE" }).catch(() => undefined);
}
