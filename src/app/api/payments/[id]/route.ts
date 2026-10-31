import { eq } from "drizzle-orm";
import { db, schema } from "@/server/db";
import { markPaid } from "@/server/gym";
import { mockPayAllowed, refreshPayment } from "@/server/payments";
import { getCurrentUser, isStaff } from "@/server/session";

export const dynamic = "force-dynamic";

async function load(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const u = await getCurrentUser();
  if (!u) return null;
  const [pay] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
  if (!pay || (pay.userId !== u.id && !isStaff(u.role))) return null;
  return pay;
}

/** Payment status for the waiting screen. Checks QPay while pending. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pay = await load(id);
  if (!pay) return Response.json({ error: "not found" }, { status: 404 });
  let status = pay.status;
  try {
    status = (await refreshPayment(pay.id)) ?? status;
  } catch (e) {
    console.error("[payments] check failed", e);
  }
  return Response.json({ status }, { headers: { "Cache-Control": "no-store" } });
}

/** Test mode only: pretend the QPay invoice was paid. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mockPayAllowed()) return Response.json({ error: "disabled" }, { status: 403 });
  const pay = await load(id);
  if (!pay || pay.method !== "qpay") return Response.json({ error: "not found" }, { status: 404 });
  await markPaid(pay.id, null);
  return Response.json({ status: "paid" });
}
