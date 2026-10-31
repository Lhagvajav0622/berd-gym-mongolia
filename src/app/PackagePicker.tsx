"use client";

import { useEffect, useState } from "react";
import { durationLabel } from "@/components/format";
import { ButtonLink, shortMnt } from "@/components/ui";

export type PickerPackage = {
  id: string;
  name: string;
  subtitle: string | null;
  features: string[];
  durationDays: number;
  priceMnt: number;
  oldPriceMnt: number | null;
  featured: boolean;
};

function perMonth(p: PickerPackage) {
  const months = Math.round(p.durationDays / 30);
  return months > 1 ? Math.round(p.priceMnt / months) : null;
}

/** Tap a package to select it, then continue. On phones the continue bar sticks to the bottom. */
export function PackagePicker({ packages }: { packages: PickerPackage[] }) {
  const [selected, setSelected] = useState(() => (packages.find((p) => p.featured) ?? packages[0])?.id);
  const sel = packages.find((p) => p.id === selected);
  // Show the phone bottom bar once the visitor has scrolled to the packages.
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const el = document.getElementById("price");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) setReached(true);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div role="radiogroup" aria-label="Багц" className="mt-[clamp(34px,5vw,56px)] flex flex-col gap-[clamp(12px,1.6vw,18px)]">
        {packages.map((p) => {
          const on = p.id === selected;
          const pm = perMonth(p);
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(p.id)}
              className={`grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 rounded-lg border-2 px-[clamp(18px,2.4vw,34px)] py-[clamp(18px,3vw,34px)] text-left transition lg:grid-cols-[auto_1fr_auto] lg:gap-x-10 ${
                on ? "border-orange bg-orange/[.07]" : "border-line-2 bg-surface-1 hover:bg-surface-2"
              }`}
            >
              <span
                className={`hidden size-7 place-items-center rounded-full border-2 lg:row-span-2 lg:grid ${on ? "border-orange bg-orange text-on-orange" : "border-line-2"}`}
                aria-hidden
              >
                {on && "✓"}
              </span>
              <span className="col-start-1 flex min-w-0 flex-wrap items-center gap-2 self-end lg:col-start-2 lg:row-start-1">
                <span className="display text-[clamp(24px,3vw,40px)] leading-none">{p.name}</span>
                {p.featured && <span className="display bg-orange px-2 py-1 text-[10.5px] tracking-[.12em] text-on-orange">Санал болгох</span>}
              </span>
              <span className="col-start-2 row-start-1 text-right whitespace-nowrap lg:col-start-3 lg:row-span-2">
                {p.oldPriceMnt ? <span className="display block text-[clamp(13px,1.3vw,16px)] leading-none font-semibold text-muted line-through">{shortMnt(p.oldPriceMnt)}</span> : null}
                <span className="mt-1 flex items-baseline justify-end gap-1.5">
                  <span className={`display text-[clamp(36px,5.5vw,68px)] leading-[.9] ${on ? "text-orange" : ""}`}>{shortMnt(p.priceMnt)}</span>
                  <span className="text-[clamp(12px,1.2vw,14px)] text-muted">/ {durationLabel(p.durationDays)}</span>
                </span>
                {pm && <span className="mt-1 block text-[12.5px] text-fg-2">сард {shortMnt(pm)}</span>}
              </span>
              <span className="col-span-2 text-[clamp(13.5px,1.4vw,16px)] leading-normal text-fg-2 lg:col-span-1 lg:col-start-2 lg:row-start-2">
                {[p.subtitle, ...p.features].filter(Boolean).join(" · ")}
              </span>
            </button>
          );
        })}
      </div>

      {sel && (
        <div className="mt-6 hidden justify-end lg:flex">
          <ButtonLink href={`/join/${sel.id}`}>{sel.name} — Үргэлжлүүлэх →</ButtonLink>
        </div>
      )}

      {sel && reached && (
        <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 animate-[sheet-up_.25s_ease-out] items-center gap-3 border-t border-line bg-ink/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <div className="min-w-0 max-w-[45%] shrink">
            <div className="truncate text-[12.5px] text-fg-2">{sel.name}</div>
            <div className="display metal-text text-[23px] leading-none">{shortMnt(sel.priceMnt)}</div>
          </div>
          <ButtonLink href={`/join/${sel.id}`} className="ml-auto flex-1 px-5">
            Үргэлжлүүлэх
          </ButtonLink>
        </div>
      )}
    </>
  );
}
