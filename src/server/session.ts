import "server-only";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import { db, schema } from "./db";

export type Role = "member" | "reception" | "admin";

export type CurrentUser = {
  id: string;
  name: string;
  phone: string;
  role: Role;
  profileComplete: boolean;
};

/** Phones in ADMIN_PHONES (comma separated) become admin on first sign-in. */
function bootstrapAdmins(): string[] {
  return (process.env.ADMIN_PHONES ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) return null;
  const [u] = await db.select().from(schema.user).where(eq(schema.user.id, s.user.id));
  if (!u) return null;
  let role = u.role as Role;
  if (role !== "admin" && u.phoneNumber && bootstrapAdmins().includes(u.phoneNumber)) {
    await db.update(schema.user).set({ role: "admin" }).where(eq(schema.user.id, u.id));
    role = "admin";
  }
  return { id: u.id, name: u.name, phone: u.phoneNumber ?? "", role, profileComplete: u.profileComplete };
});

/** For pages: redirect to login (or home) when the role doesn't match. */
export async function requirePage(roles: Role[] = ["member", "reception", "admin"], next = "/me"): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!roles.includes(u.role)) redirect("/me");
  return u;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** For server actions and API routes. */
export async function requireRole(roles: Role[]): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) throw new HttpError(401, "Нэвтэрнэ үү.");
  if (!roles.includes(u.role)) throw new HttpError(403, "Эрх хүрэхгүй байна.");
  return u;
}

export const isStaff = (r: Role) => r === "reception" || r === "admin";
