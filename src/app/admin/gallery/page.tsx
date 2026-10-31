import { asc } from "drizzle-orm";
import { db, schema } from "@/server/db";
import { GalleryAdmin } from "./GalleryAdmin";

export const metadata = { title: "Зураг" };

export default async function GalleryPage() {
  const photos = await db
    .select({ id: schema.galleryPhotos.id, caption: schema.galleryPhotos.caption, sortOrder: schema.galleryPhotos.sortOrder })
    .from(schema.galleryPhotos)
    .orderBy(asc(schema.galleryPhotos.sortOrder), asc(schema.galleryPhotos.createdAt));
  return (
    <div>
      <h1 className="display text-[32px]">Заал, тоноглолын зураг</h1>
      <p className="mt-1 text-[14px] text-grey">Сайтын &quot;Заал&quot; хэсэг болон төлбөрийн сануулга дээр харагдана. Эхний 6 зураг сануулгад гарна.</p>
      <div className="mt-6">
        <GalleryAdmin photos={photos} />
      </div>
    </div>
  );
}
