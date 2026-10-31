import { eq } from "drizzle-orm";
import { db, schema } from "@/server/db";

/** Public hall/equipment photo. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const [p] = await db.select().from(schema.galleryPhotos).where(eq(schema.galleryPhotos.id, id));
  if (!p) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(p.data, "base64"), {
    headers: { "Content-Type": p.mime, "Cache-Control": "public, max-age=86400, immutable" },
  });
}
