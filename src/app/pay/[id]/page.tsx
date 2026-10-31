import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { AppShell } from "@/components/AppShell";
import { mnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { ensureInvoice, mockPayAllowed } from "@/server/payments";
import { qpayMode } from "@/server/qpay";
import { isStaff, requirePage } from "@/server/session";
import { PayStatus } from "./PayStatus";
import { BRAND } from "@/brand";

export const dynamic = "force-dynamic";
export const metadata = { title: "Төлбөр" };

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const u = await requirePage(undefined, `/pay/${id}`);
  let [pay] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
  if (!pay || (pay.userId !== u.id && !isStaff(u.role))) notFound();
  const [m] = await db.select().from(schema.memberships).where(eq(schema.memberships.id, pay.membershipId));

  let invoiceError: string | null = null;
  if (pay.method === "qpay" && pay.status === "pending") {
    try {
      pay = await ensureInvoice(pay, `${BRAND.short} ${m.packageName}`);
    } catch (e) {
      console.error("[qpay] invoice failed", e);
      invoiceError = "QPay нэхэмжлэх үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.";
    }
  }

  let qrSrc: string | null = null;
  if (pay.qpayData?.qrImage) qrSrc = `data:image/png;base64,${pay.qpayData.qrImage}`;
  else if (pay.qpayData?.qrText) qrSrc = await QRCode.toDataURL(pay.qpayData.qrText, { margin: 1, width: 480 });

  return (
    <AppShell user={u}>
      <div className="eyebrow">{pay.method === "qpay" ? "QPay төлбөр" : "Бэлэн төлбөр"}</div>
      <h1 className="display mt-1 text-[36px] leading-none">{m.packageName}</h1>
      <div className="mt-2 text-fg-2">
        {m.lockerNumber != null ? `Шүүгээ №${m.lockerNumber} · ` : ""}Нийт <b className="text-fg">{mnt(pay.amountMnt)}</b>
      </div>
      <div className="mt-6">
        <PayStatus
          paymentId={pay.id}
          method={pay.method}
          initialStatus={pay.status}
          qrSrc={qrSrc}
          bankLinks={pay.qpayData?.urls ?? []}
          mock={qpayMode() === "mock"}
          mockPay={mockPayAllowed()}
          invoiceError={invoiceError}
          reference={pay.id.slice(0, 8).toUpperCase()}
          amount={mnt(pay.amountMnt)}
        />
      </div>
    </AppShell>
  );
}
