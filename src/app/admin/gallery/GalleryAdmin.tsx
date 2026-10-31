"use client";

import { useRef, useState, useTransition } from "react";
import { addGalleryPhoto, updateGalleryPhoto } from "@/app/actions/admin";
import { resizeImage } from "@/components/PhotoCapture";
import { Button, Card, ErrorText, Input } from "@/components/ui";

type Photo = { id: string; caption: string | null; sortOrder: number };

function Item({ p }: { p: Photo }) {
  const [caption, setCaption] = useState(p.caption ?? "");
  const [order, setOrder] = useState(String(p.sortOrder));
  const [pending, start] = useTransition();
  const dirty = caption !== (p.caption ?? "") || order !== String(p.sortOrder);
  return (
    <Card className="overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/gallery/${p.id}`} alt="" className="aspect-[4/3] w-full object-cover" />
      <div className="space-y-2 p-3">
        <Input className="h-9" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Тайлбар (Жишээ: Хүчний заал)" />
        <div className="flex gap-2">
          <Input className="h-9 w-20" type="number" value={order} onChange={(e) => setOrder(e.target.value)} title="Дараалал" />
          <Button size="sm" variant="dark" disabled={!dirty || pending} onClick={() => start(async () => void (await updateGalleryPhoto({ id: p.id, caption, sortOrder: Number(order) })))}>
            Хадгалах
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="ml-auto"
            disabled={pending}
            onClick={() => confirm("Зургийг устгах уу?") && start(async () => void (await updateGalleryPhoto({ id: p.id, remove: true })))}
          >
            ✕
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function GalleryAdmin({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          setError(null);
          for (let i = 0; i < files.length; i++) {
            setProgress(`${i + 1}/${files.length} байршуулж байна…`);
            try {
              const photo = await resizeImage(files[i], 1400, false, 0.8);
              const r = await addGalleryPhoto({ photo, caption: "" });
              if (!r.ok) setError(r.error);
            } catch (err) {
              setError((err as Error).message);
            }
          }
          setProgress(null);
        }}
      />
      <Button size="md" variant="secondary" disabled={!!progress} onClick={() => ref.current?.click()}>
        {progress ?? "+ Зураг нэмэх"}
      </Button>
      <ErrorText>{error}</ErrorText>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <Item key={p.id} p={p} />
        ))}
      </div>
      {photos.length === 0 && <p className="text-grey">Зураг алга. Зураг нэмэх хүртэл сайтын «Заал» хэсэг нуугдана.</p>}
    </div>
  );
}
