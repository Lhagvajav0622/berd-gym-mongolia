"use server";

import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/server/db";
import { cancelPayment, createOrder, lockerOverview, markPaid } from "@/server/gym";
import { parseImageDataUrl } from "@/server/images";
import { RuleError } from "@/server/membership";
import { normalizePhone } from "@/server/phone";
import { cancelInvoice } from "@/server/qpay";
import { requireRole } from "@/server/session";
import { saveSettings, SETTING_DEFAULTS, type Settings } from "@/server/settings";
import { run } from "./result";

const ADMIN = ["admin"] as const;
const STAFF = ["reception", "admin"] as const;

function int(v: unknown, min: number, max: number, label: string): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw new RuleError(`${label}: ${min}–${max} хооронд бүхэл тоо оруулна уу.`);
  return n;
}

/* ── Packages ───────────────────────────────────────────────────────── */

export type PackageInput = {
  id?: string;
  name: string;
  subtitle: string;
  durationDays: number;
  priceMnt: number;
  oldPriceMnt: number | null;
  features: string[];
  featured: boolean;
  lockerAllowed: boolean;
  active: boolean;
  sortOrder: number;
};

export async function savePackage(p: PackageInput) {
  return run(async () => {
    await requireRole([...ADMIN]);
    const name = p.name.trim();
    if (!name) throw new RuleError("Багцын нэр оруулна уу.");
    const values = {
      name,
      subtitle: p.subtitle.trim() || null,
      durationDays: int(p.durationDays, 1, 3650, "Хоног"),
      priceMnt: int(p.priceMnt, 0, 100_000_000, "Үнэ"),
      oldPriceMnt: p.oldPriceMnt ? int(p.oldPriceMnt, 0, 100_000_000, "Хуучин үнэ") : null,
      features: p.features.map((f) => f.trim()).filter(Boolean).slice(0, 12),
      featured: !!p.featured,
      lockerAllowed: !!p.lockerAllowed,
      active: !!p.active,
      sortOrder: int(p.sortOrder || 0, -1000, 1000, "Дараалал"),
    };
    if (p.id) await db.update(schema.packages).set(values).where(eq(schema.packages.id, p.id));
    else await db.insert(schema.packages).values(values);
    revalidatePath("/admin/packages");
    revalidatePath("/");
  });
}

export async function deletePackage(id: string) {
  return run(async () => {
    await requireRole([...ADMIN]);
    const [used] = await db.select({ id: schema.memberships.id }).from(schema.memberships).where(eq(schema.memberships.packageId, id)).limit(1);
    // Bought packages stay for history; just hide them.
    if (used) await db.update(schema.packages).set({ active: false }).where(eq(schema.packages.id, id));
    else await db.delete(schema.packages).where(eq(schema.packages.id, id));
    revalidatePath("/admin/packages");
    revalidatePath("/");
  });
}

/* ── Payments ───────────────────────────────────────────────────────── */

export async function confirmCash(paymentId: string) {
  return run(async () => {
    const u = await requireRole([...ADMIN]);
    const ok = await markPaid(paymentId, u.id);
    if (!ok) throw new RuleError("Энэ төлбөр аль хэдийн баталгаажсан эсвэл цуцлагдсан.");
    revalidatePath("/admin", "layout");
  });
}

export async function cancelPaymentAdmin(paymentId: string) {
  return run(async () => {
    await requireRole([...ADMIN]);
    const p = await cancelPayment(paymentId);
    if (p?.qpayInvoiceId) await cancelInvoice(p.qpayInvoiceId);
    revalidatePath("/admin", "layout");
  });
}

/** Walk-in: admin sells a package at the desk for cash, paid immediately. */
export async function sellCash(input: { userId: string; packageId: string; withLocker: boolean }) {
  return run(async () => {
    const u = await requireRole([...ADMIN]);
    const { payment } = await createOrder({ userId: input.userId, packageId: input.packageId, withLocker: input.withLocker, method: "cash" });
    await markPaid(payment.id, u.id);
    revalidatePath("/admin", "layout");
  });
}

/* ── Members ────────────────────────────────────────────────────────── */

/** Register a member at the desk (staff takes the photo). They log in later with OTP. */
export async function createMember(input: { phone: string; name: string; photo: string | null }) {
  return run(async () => {
    await requireRole([...STAFF]);
    const phone = normalizePhone(input.phone);
    if (!phone) throw new RuleError("8 оронтой утасны дугаар оруулна уу.");
    const name = input.name.trim();
    if (name.length < 2) throw new RuleError("Нэр оруулна уу.");
    const [exists] = await db.select({ id: schema.user.id }).from(schema.user).where(eq(schema.user.phoneNumber, phone));
    if (exists) throw new RuleError("Энэ дугаар бүртгэлтэй байна.");
    const id = randomUUID();
    const img = input.photo ? parseImageDataUrl(input.photo, 250_000) : null;
    await db.transaction(async (tx) => {
      await tx.insert(schema.user).values({
        id,
        name,
        email: `${phone}@phone.sparta.local`,
        phoneNumber: phone,
        phoneNumberVerified: false,
        profileComplete: !!img,
      });
      if (img) await tx.insert(schema.memberPhotos).values({ userId: id, ...img });
    });
    revalidatePath("/admin/members");
    return { id };
  });
}

export async function updateMember(input: { userId: string; name?: string; role?: "member" | "reception" | "admin"; photo?: string }) {
  return run(async () => {
    const staff = await requireRole([...STAFF]);
    if (input.role && staff.role !== "admin") throw new RuleError("Эрх солих нь зөвхөн админд.");
    if (input.role && input.userId === staff.id && input.role !== "admin") throw new RuleError("Өөрийн админ эрхийг хасах боломжгүй.");
    const patch: Partial<typeof schema.user.$inferInsert> = { updatedAt: new Date() };
    if (input.name?.trim()) patch.name = input.name.trim();
    if (input.role) patch.role = input.role;
    if (input.photo) {
      const img = parseImageDataUrl(input.photo, 250_000);
      await db
        .insert(schema.memberPhotos)
        .values({ userId: input.userId, ...img })
        .onConflictDoUpdate({ target: schema.memberPhotos.userId, set: { ...img, updatedAt: new Date() } });
      patch.profileComplete = true;
    }
    await db.update(schema.user).set(patch).where(eq(schema.user.id, input.userId));
    revalidatePath(`/admin/members/${input.userId}`);
  });
}

export async function adjustMembership(input: { membershipId: string; addDays?: number; lockerNumber?: number | null; cancel?: boolean; note?: string }) {
  return run(async () => {
    await requireRole([...ADMIN]);
    const [m] = await db.select().from(schema.memberships).where(eq(schema.memberships.id, input.membershipId));
    if (!m) throw new RuleError("Багц олдсонгүй.");
    const patch: Partial<typeof schema.memberships.$inferInsert> = {};
    if (input.addDays) patch.adjustDays = m.adjustDays + int(input.addDays, -3650, 3650, "Хоног");
    if (input.lockerNumber !== undefined) {
      if (input.lockerNumber !== null) {
        const n = input.lockerNumber;
        const lockers = await lockerOverview();
        const slot = lockers.find((l) => l.number === n);
        if (!slot) throw new RuleError("Ийм дугаартай шүүгээ алга.");
        if (slot.membership && slot.membership.id !== m.id) throw new RuleError(`Шүүгээ №${n} эзэнтэй байна.`);
      }
      patch.lockerNumber = input.lockerNumber;
    }
    if (input.cancel) {
      patch.status = "cancelled";
      patch.lockerNumber = null;
    }
    if (input.note !== undefined) patch.note = input.note.trim() || null;
    if (Object.keys(patch).length) await db.update(schema.memberships).set(patch).where(eq(schema.memberships.id, m.id));
    if (input.cancel)
      await db
        .update(schema.payments)
        .set({ status: "cancelled" })
        .where(and(eq(schema.payments.membershipId, m.id), inArray(schema.payments.status, ["pending"])));
    revalidatePath(`/admin/members/${m.userId}`);
    revalidatePath("/admin/lockers");
  });
}

/* ── Gallery ────────────────────────────────────────────────────────── */

export async function addGalleryPhoto(input: { photo: string; caption: string }) {
  return run(async () => {
    await requireRole([...ADMIN]);
    const img = parseImageDataUrl(input.photo, 600_000);
    await db.insert(schema.galleryPhotos).values({ ...img, caption: input.caption.trim() || null });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
  });
}

export async function updateGalleryPhoto(input: { id: string; caption?: string; sortOrder?: number; remove?: boolean }) {
  return run(async () => {
    await requireRole([...ADMIN]);
    if (input.remove) await db.delete(schema.galleryPhotos).where(eq(schema.galleryPhotos.id, input.id));
    else
      await db
        .update(schema.galleryPhotos)
        .set({
          ...(input.caption !== undefined ? { caption: input.caption.trim() || null } : {}),
          ...(input.sortOrder !== undefined ? { sortOrder: int(input.sortOrder, -1000, 1000, "Дараалал") } : {}),
        })
        .where(eq(schema.galleryPhotos.id, input.id));
    revalidatePath("/admin/gallery");
    revalidatePath("/");
  });
}

/* ── Settings ───────────────────────────────────────────────────────── */

export async function updateSettings(input: Partial<Settings>) {
  return run(async () => {
    await requireRole([...ADMIN]);
    const v: Partial<Settings> = {};
    if (input.maxPauses !== undefined) v.maxPauses = int(input.maxPauses, 0, 50, "Зогсоох эрх");
    if (input.lockerCount !== undefined) v.lockerCount = int(input.lockerCount, 0, 500, "Шүүгээний тоо");
    if (input.lockerMonthlyPriceMnt !== undefined) v.lockerMonthlyPriceMnt = int(input.lockerMonthlyPriceMnt, 0, 10_000_000, "Шүүгээний үнэ");
    if (input.activationDeadlineDays !== undefined)
      v.activationDeadlineDays = input.activationDeadlineDays == null ? null : int(input.activationDeadlineDays, 1, 3650, "Идэвхжүүлэх хугацаа");
    if (input.refundNotice !== undefined) v.refundNotice = input.refundNotice.trim() || SETTING_DEFAULTS.refundNotice;
    if (input.promoActive !== undefined) v.promoActive = !!input.promoActive;
    if (input.promoTag !== undefined) v.promoTag = input.promoTag.trim().slice(0, 30);
    if (input.promoText !== undefined) v.promoText = input.promoText.trim().slice(0, 120);
    await saveSettings(v);
    revalidatePath("/", "layout");
  });
}
