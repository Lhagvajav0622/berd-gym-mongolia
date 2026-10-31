"use server";

import { eq, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/server/db";
import { confirmEntry, entryPreview, type EntryPreview } from "@/server/gym";
import { RuleError } from "@/server/membership";
import { readEntryToken } from "@/server/qr-token";
import { requireRole } from "@/server/session";
import { run } from "./result";
import { BRAND } from "@/brand";

const STAFF = ["reception", "admin"] as const;

/** Scanned QR → who it is and whether they may enter. Does not record anything. */
export async function scanEntry(token: string) {
  return run<EntryPreview>(async () => {
    await requireRole([...STAFF]);
    const t = readEntryToken(token);
    if (!t.ok)
      throw new RuleError(
        t.reason === "expired"
          ? "QR-ийн хугацаа дууссан. Гишүүн апп-аа шинэчилж дахин уншуулна уу (дэлгэцийн зураг байж магадгүй)."
          : `Энэ ${BRAND.name}-ийн QR биш байна.`,
      );
    const p = await entryPreview(t.userId);
    if (!p) throw new RuleError("Гишүүн олдсонгүй.");
    return p;
  });
}

export async function previewMember(userId: string) {
  return run<EntryPreview>(async () => {
    await requireRole([...STAFF]);
    const p = await entryPreview(userId);
    if (!p) throw new RuleError("Гишүүн олдсонгүй.");
    return p;
  });
}

/** Reception confirmed the face matches: record the entry (starts days on first visit). */
export async function admit(userId: string) {
  return run(async () => {
    const staff = await requireRole([...STAFF]);
    const r = await confirmEntry(userId, staff.id);
    revalidatePath("/desk");
    return { firstEntry: r.firstEntry };
  });
}

export async function searchMembers(q: string) {
  return run(async () => {
    await requireRole([...STAFF]);
    const term = q.trim().replace(/[%_]/g, "");
    if (term.length < 3) return [];
    // Cash order code shown on the member's phone (first 8 characters of the payment id).
    if (/^[0-9a-f]{8}$/i.test(term)) {
      const byCode = await db
        .select({ id: schema.user.id, name: schema.user.name, phone: schema.user.phoneNumber })
        .from(schema.payments)
        .innerJoin(schema.user, eq(schema.user.id, schema.payments.userId))
        .where(sql`${schema.payments.id}::text like ${term.toLowerCase() + "%"}`)
        .limit(5);
      if (byCode.length) return byCode;
    }
    return db
      .select({ id: schema.user.id, name: schema.user.name, phone: schema.user.phoneNumber })
      .from(schema.user)
      .where(or(ilike(schema.user.phoneNumber, `%${term.replace(/\s/g, "")}%`), ilike(schema.user.name, `%${term}%`)))
      .limit(10);
  });
}
