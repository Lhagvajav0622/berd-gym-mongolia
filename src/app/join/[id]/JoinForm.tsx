"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions/member";
import { Button, ErrorText, mnt } from "@/components/ui";

type Props = {
  packageId: string;
  price: number;
  lockerAllowed: boolean;
  lockerPrice: number;
  lockerLabel: string;
  freeLockers: number;
  notice: string;
  photos: string[];
};

function Option({ checked, onClick, disabled, title, sub, right }: { checked: boolean; onClick: () => void; disabled?: boolean; title: string; sub?: string; right?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md border p-4 text-left transition disabled:opacity-45 ${checked ? "border-orange bg-orange/[.07]" : "border-line-2 bg-surface-1 hover:bg-surface-2"}`}
    >
      <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-orange" : "border-line-2"}`}>
        {checked && <span className="size-2.5 rounded-full bg-orange" />}
      </span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        {sub && <span className="block text-[13px] text-grey">{sub}</span>}
      </span>
      {right && <span className="display text-[18px]">{right}</span>}
    </button>
  );
}

export function JoinForm(p: Props) {
  const router = useRouter();
  const [locker, setLocker] = useState(false);
  const [method, setMethod] = useState<"qpay" | "cash">("qpay");
  const [showNotice, setShowNotice] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const total = p.price + (locker ? p.lockerPrice : 0);
  const lockerDisabled = !p.lockerAllowed || p.freeLockers <= 0;

  function submit() {
    setError(null);
    start(async () => {
      const r = await placeOrder({ packageId: p.packageId, withLocker: locker, method, acceptedNotice: accepted });
      if (!r.ok) {
        setShowNotice(false);
        return setError(r.error);
      }
      router.push(`/pay/${r.data!.paymentId}`);
    });
  }

  return (
    <div className="space-y-7">
      <section>
        <h2 className="eyebrow mb-3">Нэмэлт</h2>
        <Option
          checked={locker}
          disabled={lockerDisabled}
          onClick={() => setLocker((v) => !v)}
          title="Шүүгээ түрээслэх"
          sub={
            !p.lockerAllowed
              ? "Энэ багцад боломжгүй"
              : p.freeLockers <= 0
                ? "Сул шүүгээ дууссан"
                : `${p.lockerLabel} · ${p.freeLockers} сул үлдсэн`
          }
          right={`+${mnt(p.lockerPrice)}`}
        />
      </section>

      <section>
        <h2 className="eyebrow mb-3">Төлбөрийн хэлбэр</h2>
        <div className="space-y-2.5">
          <Option checked={method === "qpay"} onClick={() => setMethod("qpay")} title="QPay" sub="Банкны аппаар QR уншуулж төлнө. Шууд идэвхжинэ." />
          <Option checked={method === "cash"} onClick={() => setMethod("cash")} title="Бэлнээр" sub="Ресепшн дээр төлнө. Админ баталгаажуулсны дараа идэвхжинэ." />
        </div>
      </section>

      <div className="flex items-end justify-between border-t border-line-2 pt-5">
        <span className="text-fg-2">Нийт төлөх</span>
        <span className="display metal-text text-[40px] leading-none">{mnt(total)}</span>
      </div>
      <ErrorText>{error}</ErrorText>
      <Button full onClick={() => setShowNotice(true)}>
        Төлөх
      </Button>

      {showNotice && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={() => !pending && setShowNotice(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-xl border border-line-2 bg-surface-1 p-5 animate-[sheet-up_.3s_ease-out] sm:animate-[pop_.2s_ease-out] sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-warn">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              </svg>
              <h2 className="display text-[22px]">Анхааруулга</h2>
            </div>
            <p className="mt-3 leading-relaxed">{p.notice}</p>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {p.photos.slice(0, 6).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="aspect-square w-full rounded-xs object-cover" />
              ))}
            </div>
            <a href="/#gallery" target="_blank" className="mt-2 inline-block text-[14px] text-orange underline">
              Заал, тоноглолын бүх зургийг үзэх
            </a>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-md bg-surface-2 p-3.5">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 size-5 accent-[#F7941D]" />
              <span className="text-[15px]">Би заал, тоноглолтой танилцсан. Төлбөр буцаагдахгүйг ойлгосон.</span>
            </label>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="dark" size="md" disabled={pending} onClick={() => setShowNotice(false)}>
                Буцах
              </Button>
              <Button size="md" disabled={!accepted || pending} onClick={submit}>
                {pending ? "…" : `Төлөх ${mnt(total)}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
