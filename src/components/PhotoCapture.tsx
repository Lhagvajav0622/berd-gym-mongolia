"use client";

import { useRef, useState } from "react";
import { Button } from "./ui";

/** Shrinks a photo in the browser before upload: center crop, JPEG. */
export async function resizeImage(file: File, size: number, square: boolean, quality = 0.82): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Зургийг уншиж чадсангүй."));
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (square) {
      const s = Math.min(sw, sh);
      sx = (sw - s) / 2;
      sy = (sh - s) / 2;
      sw = sh = s;
      canvas.width = canvas.height = Math.min(size, s);
    } else {
      const scale = Math.min(1, size / Math.max(sw, sh));
      canvas.width = Math.round(sw * scale);
      canvas.height = Math.round(sh * scale);
    }
    canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoCapture({ value, onChange }: { value: string | null; onChange: (dataUrl: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-4">
      <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed border-line-2 bg-surface-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Таны зураг" className="size-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" className="size-10 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        )}
      </div>
      <div className="space-y-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try {
              setError(null);
              onChange(await resizeImage(f, 480, true));
            } catch (err) {
              setError((err as Error).message);
            }
          }}
        />
        <Button variant={value ? "dark" : "secondary"} size="md" onClick={() => ref.current?.click()}>
          {value ? "Дахин авах" : "Зураг авах"}
        </Button>
        <p className="text-[13px] text-grey">Нүүр тод харагдах, малгай, нүдний шилгүй.</p>
        {error && <p className="text-[13px] text-bad">{error}</p>}
      </div>
    </div>
  );
}
