import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "./db";
import { markPaid } from "./gym";
import { createInvoice, isInvoicePaid, qpayMode } from "./qpay";
import { callbackSig } from "./qr-token";

export type Payment = typeof schema.payments.$inferSelect;

export function publicUrl() {
  return (process.env.PUBLIC_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Creates the QPay invoice once per payment and stores its QR. */
export async function ensureInvoice(pay: Payment, description: string): Promise<Payment> {
  if (pay.method !== "qpay" || pay.status !== "pending" || pay.qpayInvoiceId) return pay;
  const inv = await createInvoice({
    paymentId: pay.id,
    amountMnt: pay.amountMnt,
    description,
    receiverCode: pay.userId,
    callbackUrl: `${publicUrl()}/api/qpay/callback?pid=${pay.id}&sig=${callbackSig(pay.id)}`,
  });
  const [updated] = await db
    .update(schema.payments)
    .set({ qpayInvoiceId: inv.invoiceId, qpayData: { qrImage: inv.qrImage, qrText: inv.qrText, urls: inv.urls } })
    .where(and(eq(schema.payments.id, pay.id), isNull(schema.payments.qpayInvoiceId)))
    .returning();
  if (updated) return updated;
  // Another request created it first; use theirs.
  const [again] = await db.select().from(schema.payments).where(eq(schema.payments.id, pay.id));
  return again;
}

/** Asks QPay whether a pending payment is paid and records it. Returns current status. */
export async function refreshPayment(paymentId: string): Promise<Payment["status"] | null> {
  const [pay] = await db.select().from(schema.payments).where(eq(schema.payments.id, paymentId));
  if (!pay) return null;
  if (pay.status !== "pending" || pay.method !== "qpay" || !pay.qpayInvoiceId || qpayMode() === "mock") return pay.status;
  if (await isInvoicePaid(pay.qpayInvoiceId, pay.amountMnt)) {
    await markPaid(pay.id, null);
    return "paid";
  }
  return "pending";
}

/** Mock payments are only allowed outside production unless explicitly enabled. */
export function mockPayAllowed() {
  return qpayMode() === "mock" && (process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_PAY === "1");
}
