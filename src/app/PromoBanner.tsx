"use client";

import { useState } from "react";

export function PromoBanner({ tag, text }: { tag: string; text: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative bg-orange text-on-orange">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-5 gap-y-1 px-10 py-2.5">
        {tag && <span className="display rounded-xs bg-black/20 px-2 py-0.5 text-[12px] tracking-[.12em]">{tag}</span>}
        <span className="text-[14px] font-semibold">{text}</span>
        <a href="#price" className="display rounded-full bg-black/20 px-4 py-1 text-[13px] tracking-[.08em]">
          Авах
        </a>
      </div>
      <button type="button" aria-label="Хаах" onClick={() => setOpen(false)} className="absolute top-1/2 right-4 -translate-y-1/2 text-lg hover:opacity-70">
        ✕
      </button>
    </div>
  );
}
