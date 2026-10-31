import { eq } from "drizzle-orm";
import { db, schema } from "@/server/db";
import { getCurrentUser, isStaff } from "@/server/session";

/** Member face photo. Only the member and staff can see it. */
export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const u = await getCurrentUser();
  if (!u || (u.id !== userId && !isStaff(u.role))) return new Response("Forbidden", { status: 403 });
  const [p] = await db.select().from(schema.memberPhotos).where(eq(schema.memberPhotos.userId, userId));
  if (!p) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(p.data, "base64"), {
    headers: { "Content-Type": p.mime, "Cache-Control": "private, max-age=300" },
  });
}
