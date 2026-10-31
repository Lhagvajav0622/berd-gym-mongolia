"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/server/db";
import { cancelPayment, createOrder, pauseMembership, resumeMembership } from "@/server/gym";
import { cancelInvoice } from "@/server/qpay";
import { parseImageDataUrl } from "@/server/images";
import { RuleError } from "@/server/membership";
import { requireRole } from "@/server/session";
import { run } from "./result";

const ALL = ["member", "reception", "admin"] as const;

/** First-time profile: name + face photo. A member can't swap the photo later; staff can. */
export async function saveProfile(input: { name: string; photo: string }) {
  return run(async () => {
    const u = await requireRole([...ALL]);
    const name = input.name.trim().replace(/\s+/g, " ");
    if (name.length < 2 || name.length > 80) throw new RuleError("Нэрээ бүтэн оруулна уу.");
    const [existing] = await db
      .select({ id: schema.memberPhotos.userId })
      .from(schema.memberPhotos)
      .where(eq(schema.memberPhotos.userId, u.id));
    if (existing && u.profileComplete)
      throw new RuleError("Зургаа солих бол ресепшнд хандана уу.");
    const img = parseImageDataUrl(input.photo, 250_000);
    await db
      .insert(schema.memberPhotos)
      .values({ userId: u.id, ...img })
      .onConflictDoUpdate({ target: schema.memberPhotos.userId, set: { ...img, updatedAt: new Date() } });
    await db.update(schema.user).set({ name, profileComplete: true, updatedAt: new Date() }).where(eq(schema.user.id, u.id));
    revalidatePath("/me");
  });
}

export async function placeOrder(input: { packageId: string; withLocker: boolean; method: "qpay" | "cash"; acceptedNotice: boolean }) {
  return run(async () => {
    const u = await requireRole([...ALL]);
    if (!u.profileComplete) throw new RuleError("Эхлээд нэр, царайны зургаа оруулна уу.");
    if (!input.acceptedNotice) throw new RuleError("Сануулгатай танилцсанаа баталгаажуулна уу.");
    if (input.method !== "qpay" && input.method !== "cash") throw new RuleError("Төлбөрийн хэлбэр буруу.");
    const { payment } = await createOrder({ userId: u.id, packageId: input.packageId, withLocker: !!input.withLocker, method: input.method });
    return { paymentId: payment.id };
  });
}

export async function pause(membershipId: string) {
  return run(async () => {
    const u = await requireRole([...ALL]);
    await pauseMembership(u.id, membershipId);
    revalidatePath("/me");
  });
}

export async function resume(membershipId: string) {
  return run(async () => {
    const u = await requireRole([...ALL]);
    await resumeMembership(u.id, membershipId);
    revalidatePath("/me");
  });
}

export async function cancelMyPayment(paymentId: string) {
  return run(async () => {
    const u = await requireRole([...ALL]);
    const [pay] = await db.select().from(schema.payments).where(eq(schema.payments.id, paymentId));
    if (!pay || pay.userId !== u.id) throw new RuleError("Төлбөр олдсонгүй.");
    const cancelled = await cancelPayment(pay.id);
    if (cancelled?.qpayInvoiceId) await cancelInvoice(cancelled.qpayInvoiceId);
    revalidatePath("/me");
  });
}
