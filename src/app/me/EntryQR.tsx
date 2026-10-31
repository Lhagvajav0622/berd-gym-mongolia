"use client";

import { useCallback, useEffect, useState } from "react";

/** Member's entry QR. Re-fetched every minute so screenshots expire. */
export function EntryQR() {
  const [svg, setSvg] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/me/qr", { cache: "no-store" });
      if (!r.ok) throw new Error();
      const j = (await r.json()) as { svg: string; expiresAt: number };
      setSvg(j.svg);
      setExpiresAt(j.expiresAt);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    void load();
    const refresh = setInterval(load, 60_000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(refresh);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const expired = expiresAt > 0 && now > expiresAt;

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-md bg-white p-3">
        {svg && !expired ? (
          <div className="size-60 [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div className="grid size-60 place-items-center text-center text-[14px] text-ink">
            {failed || expired ? "QR шинэчлэх шаардлагатай" : "Ачаалж байна…"}
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-[13px] text-grey">
        Ресепшнд уншуулна уу. QR минут тутам шинэчлэгдэнэ, зураг дарж явуулбал ажиллахгүй.
      </p>
      {(failed || expired) && (
        <button type="button" onClick={() => void load()} className="mt-2 text-[14px] text-orange underline">
          Шинэчлэх
        </button>
      )}
    </div>
  );
}
