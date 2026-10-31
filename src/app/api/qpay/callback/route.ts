import { timingSafeEqual } from "node:crypto";
import { refreshPayment } from "@/server/payments";
import { callbackSig } from "@/server/qr-token";

export const dynamic = "force-dynamic";

/**
 * QPay calls this after a payment. The call itself proves nothing; we only use
 * it as a signal to ask QPay (/payment/check) and mark the payment paid if so.
 */
async function handle(req: Request) {
  const url = new URL(req.url);
  const pid = url.searchParams.get("pid") ?? "";
  const sig = url.searchParams.get("sig") ?? "";
  const expected = /^[0-9a-f-]{36}$/.test(pid) ? callbackSig(pid) : "";
  if (!expected || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return new Response("bad request", { status: 400 });
  try {
    await refreshPayment(pid);
  } catch (e) {
    console.error("[qpay callback] check failed", e);
  }
  return new Response("SUCCESS", { status: 200 });
}

export const GET = handle;
export const POST = handle;
