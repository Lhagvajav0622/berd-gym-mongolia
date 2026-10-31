import { and, desc, eq, gt } from "drizzle-orm";
import { db, schema } from "@/server/db";
import { normalizePhone } from "@/server/phone";
import { testSmsMode } from "@/server/sms";

export const dynamic = "force-dynamic";

/**
 * Test mode only: returns the latest OTP for a phone so it can be shown on
 * the login page. Turns itself off as soon as SMS_PROVIDER is set.
 */
export async function GET(req: Request) {
  if (!testSmsMode()) return Response.json({ error: "disabled" }, { status: 404 });
  const phone = normalizePhone(new URL(req.url).searchParams.get("phone") ?? "");
  if (!phone) return Response.json({ error: "bad phone" }, { status: 400 });
  const [row] = await db
    .select({ value: schema.verification.value })
    .from(schema.verification)
    .where(and(eq(schema.verification.identifier, phone), gt(schema.verification.expiresAt, new Date())))
    .orderBy(desc(schema.verification.createdAt))
    .limit(1);
  const code = row?.value.split(":")[0];
  return Response.json({ code: code && /^\d{6}$/.test(code) ? code : null }, { headers: { "Cache-Control": "no-store" } });
}
