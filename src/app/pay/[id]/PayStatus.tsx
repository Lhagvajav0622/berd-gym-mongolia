"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cancelMyPayment } from "@/app/actions/member";
import { Button, ButtonLink, Card, ErrorText } from "@/components/ui";

type Status = "pending" | "paid" | "cancelled";

export function PayStatus(p: {
  paymentId: string;
  method: "qpay" | "cash";
  initialStatus: Status;
  qrSrc: string | null;
  bankLinks: { name: string; link: string; logo?: string }[];
  mock: boolean;
  mockPay: boolean;
  invoiceError: string | null;
  reference: string;
  amount: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(p.initialStatus);
  const [error, setError] = useState<string | null>(p.invoiceError);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (status !== "pending") return;
    const every = p.method === "qpay" ? 4000 : 10000;
    const t = setInterval(async () => {
      const r = await fetch(`/api/payments/${p.paymentId}`, { cache: "no-store" }).catch(() => null);
      if (!r?.ok) return;
      const j = (await r.json()) as { status: Status };
      setStatus(j.status);
    }, every);
    return () => clearInterval(t);
  }, [status, p.method, p.paymentId]);

  if (status === "paid")
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-metal text-on-orange">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="display mt-4 text-[28px]">Төлбөр төлөгдлөө</h2>
        <p className="mt-2 text-fg-2">Ресепшнд QR кодоо уншуулж орсон өдрөөс хоног тань тоологдож эхэлнэ.</p>
        <ButtonLink href="/me" className="mt-6" full>
          Миний QR
        </ButtonLink>
      </Card>
    );

  if (status === "cancelled")
    return (
      <Card className="p-6 text-center">
        <h2 className="display text-[24px]">Цуцлагдсан</h2>
        <ButtonLink href="/#price" variant="secondary" className="mt-5" full>
          Багц сонгох
        </ButtonLink>
      </Card>
    );

  const cancel = (
    <Button
      variant="ghost"
      size="sm"
      full
      disabled={pending}
      onClick={() => {
        if (!confirm("Захиалгаа цуцлах уу?")) return;
        start(async () => {
          const r = await cancelMyPayment(p.paymentId);
          if (!r.ok) return setError(r.error);
          setStatus("cancelled");
          router.refresh();
        });
      }}
    >
      Захиалга цуцлах
    </Button>
  );

  if (p.method === "cash")
    return (
      <Card className="space-y-4 p-5">
        <p className="leading-relaxed">
          Ресепшн дээр <b>{p.amount}</b> бэлнээр төлнө үү. Админ баталгаажуулмагц энэ хуудас автоматаар шинэчлэгдэнэ.
        </p>
        <div className="rounded-md bg-surface-2 p-4 text-center">
          <div className="eyebrow">Захиалгын код</div>
          <div className="display mt-1 text-[32px] tracking-[.12em] text-orange">{p.reference}</div>
        </div>
        <ErrorText>{error}</ErrorText>
        {cancel}
      </Card>
    );

  return (
    <Card className="p-5 text-center">
      {p.mock && (
        <p className="mb-4 rounded-md bg-warn/10 px-3 py-2 text-[13px] text-warn">
          Туршилтын горим: QPay хараахан холбогдоогүй, энэ QR-аар мөнгө төлөгдөхгүй.
        </p>
      )}
      <ErrorText>{error}</ErrorText>
      {p.qrSrc && (
        <>
          <p className="mb-4 text-[14px] text-grey">Банкны аппаар уншуулна уу</p>
          <div className="inline-block rounded-md bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.qrSrc} alt="QPay QR" className="size-60" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-[14px] text-fg-2">
            <span className="size-2 animate-pulse rounded-full bg-orange" />
            Төлбөр хүлээж байна…
          </div>
        </>
      )}
      {p.bankLinks.length > 0 && (
        <div className="mt-6 text-left">
          <div className="eyebrow mb-2">Утаснаасаа банкны апп нээх</div>
          <div className="grid grid-cols-3 gap-2">
            {p.bankLinks.map((b) => (
              <a key={b.name} href={b.link} className="flex flex-col items-center gap-1.5 rounded-md bg-surface-2 p-2.5 text-center text-[11.5px] leading-tight">
                {b.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo} alt="" className="size-10 rounded-sm" />
                )}
                {b.name}
              </a>
            ))}
          </div>
        </div>
      )}
      {p.mockPay && (
        <Button
          variant="secondary"
          size="md"
          full
          className="mt-6"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await fetch(`/api/payments/${p.paymentId}`, { method: "POST" });
              if (r.ok) setStatus("paid");
            })
          }
        >
          Тест: төлсөн болгох
        </Button>
      )}
      <div className="mt-3">{cancel}</div>
    </Card>
  );
}
