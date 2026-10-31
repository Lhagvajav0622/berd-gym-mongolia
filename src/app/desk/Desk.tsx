"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { confirmCash } from "@/app/actions/admin";
import { admit, previewMember, scanEntry, searchMembers } from "@/app/actions/desk";
import { fmtDay, fmtTime, PHASE_TONE } from "@/components/format";
import { Badge, Button, ErrorText, Input, mnt } from "@/components/ui";
import type { EntryPreview } from "@/server/gym";

const PHASE_LABEL: Record<string, string> = {
  active: "Идэвхтэй",
  paused: "Зогсоосон",
  not_started: "Эхлээгүй",
  pending_payment: "Төлбөр хүлээгдэж байна",
  expired: "Дууссан",
  cancelled: "Цуцлагдсан",
};

function Scanner({ onResult, paused }: { onResult: (text: string) => void; paused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<{ start: () => Promise<void>; stop: () => void; destroy: () => void } | null>(null);
  const cb = useRef(onResult);
  cb.current = onResult;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const { default: QrScanner } = await import("qr-scanner");
      if (disposed || !videoRef.current) return;
      const s = new QrScanner(videoRef.current, (r) => cb.current(r.data), {
        preferredCamera: "environment",
        highlightScanRegion: true,
        maxScansPerSecond: 8,
        returnDetailedScanResult: true,
      });
      scannerRef.current = s;
      try {
        await s.start();
      } catch {
        setError("Камер нээгдсэнгүй. Хөтчид камерын зөвшөөрөл өгнө үү (https шаардлагатай).");
      }
    })();
    return () => {
      disposed = true;
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const s = scannerRef.current;
    if (!s) return;
    if (paused) s.stop();
    else void s.start().catch(() => undefined);
  }, [paused]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-line-2 bg-black">
      <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
      {error && <p className="absolute inset-x-0 bottom-0 bg-bad/90 p-3 text-[14px]">{error}</p>}
    </div>
  );
}

function beep(ok: boolean) {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    o.frequency.value = ok ? 880 : 220;
    o.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch {}
  navigator.vibrate?.(ok ? 60 : [80, 60, 80]);
}

export function Desk() {
  const router = useRouter();
  const [preview, setPreview] = useState<EntryPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; phone: string | null }[]>([]);
  const busy = useRef(false);

  const onScan = useCallback((text: string) => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    setDone(null);
    start(async () => {
      const r = await scanEntry(text);
      if (r.ok) {
        setPreview(r.data!);
        beep(r.data!.canEnter);
      } else {
        setError(r.error);
        beep(false);
        setTimeout(() => (busy.current = false), 2500);
      }
    });
  }, []);

  function reset() {
    setPreview(null);
    busy.current = false;
  }

  const m = preview?.membership;

  return (
    <div className="space-y-4">
      <h1 className="display text-[32px] leading-none">Ресепшн</h1>

      {!preview && <Scanner onResult={onScan} paused={!!preview} />}
      {done && <p className="rounded-md bg-ok/15 px-4 py-3 font-semibold text-ok">{done}</p>}
      <ErrorText>{error}</ErrorText>

      {preview && (
        <div className="overflow-hidden rounded-lg border-2 border-line-2 bg-surface-1 animate-[pop_.2s_ease-out]" style={{ borderColor: preview.canEnter ? "var(--color-ok)" : "var(--color-bad)" }}>
          {preview.user.hasPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/photo/${preview.user.id}`} alt={preview.user.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="grid aspect-[2/1] place-items-center bg-bad/10 text-bad">Царайны зураг байхгүй</div>
          )}
          <div className="space-y-3 p-5">
            <div>
              <div className="display text-[28px] leading-none">{preview.user.name}</div>
              <div className="mt-1 text-grey">{preview.user.phone}</div>
            </div>
            <p className="text-[13px] text-fg-2">Зураг дээрх хүн мөн эсэхийг нүдээр шалгана уу.</p>
            {m && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{m.packageName}</span>
                <Badge tone={PHASE_TONE[m.state.phase]}>{PHASE_LABEL[m.state.phase]}</Badge>
                {m.lockerNumber != null && <Badge tone="orange">Шүүгээ №{m.lockerNumber}</Badge>}
              </div>
            )}
            {m?.state.endOn && m.state.phase === "active" && <div className="text-[14px] text-fg-2">Дуусах: {fmtDay(m.state.endOn)}</div>}
            {preview.pendingCash.map((c) => (
              <div key={c.id} className="rounded-md border border-warn/50 bg-warn/10 p-3.5">
                <div className="text-[14px] text-warn">Бэлэн төлбөр · код {c.code}</div>
                <div className="mt-0.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="display text-[26px] leading-none">{mnt(c.amountMnt)}</div>
                    <div className="text-[13px] text-fg-2">{c.packageName}</div>
                  </div>
                  <Button
                    size="md"
                    disabled={pending}
                    onClick={() => {
                      if (!confirm(`${mnt(c.amountMnt)} бэлнээр авсан уу?`)) return;
                      start(async () => {
                        const r = await confirmCash(c.id);
                        if (!r.ok) return setError(r.error);
                        const p = await previewMember(preview.user.id);
                        if (p.ok) setPreview(p.data!);
                      });
                    }}
                  >
                    Мөнгө авсан
                  </Button>
                </div>
              </div>
            ))}
            <p className={`text-[16px] font-semibold ${preview.canEnter ? "text-ok" : "text-bad"}`}>{preview.message}</p>
            {preview.enteredToday > 0 && (
              <p className="rounded-md bg-warn/10 px-3 py-2 text-[14px] text-warn">
                Өнөөдөр {preview.enteredToday} удаа орсон байна (сүүлд {fmtTime(preview.lastEntry).split(" ").pop()}).
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="dark" size="md" onClick={reset} disabled={pending}>
                Татгалзах
              </Button>
              <Button
                size="md"
                disabled={!preview.canEnter || pending}
                onClick={() =>
                  start(async () => {
                    const r = await admit(preview.user.id);
                    if (!r.ok) return setError(r.error);
                    setDone(`${preview.user.name} орлоо${r.data?.firstEntry ? " · хоног өнөөдрөөс эхэллээ" : ""}.`);
                    reset();
                    router.refresh();
                  })
                }
              >
                {pending ? "…" : "Оруулах"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!preview && (
        <details className="rounded-md bg-surface-1 p-4">
          <summary className="cursor-pointer text-[14px] text-fg-2">QR-гүй бол: утас, нэр эсвэл захиалгын кодоор хайх</summary>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              start(async () => {
                const r = await searchMembers(q);
                if (r.ok) setResults(r.data ?? []);
                else setError(r.error);
              });
            }}
          >
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Утас, нэр эсвэл код" />
            <Button type="submit" size="md" variant="dark">
              Хайх
            </Button>
          </form>
          <ul className="mt-2 divide-y divide-line">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className="flex w-full justify-between py-2.5 text-left"
                  onClick={() =>
                    start(async () => {
                      busy.current = true;
                      const p = await previewMember(r.id);
                      if (p.ok) setPreview(p.data!);
                      else setError(p.error);
                    })
                  }
                >
                  <span>{r.name}</span>
                  <span className="text-grey">{r.phone}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
