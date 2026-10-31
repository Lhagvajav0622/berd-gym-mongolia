"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/actions/admin";
import { Button, Card, ErrorText, Field, Input, inputClass } from "@/components/ui";
import type { Settings } from "@/server/settings";

export function SettingsForm({ initial }: { initial: Settings }) {
  const [s, setS] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSaved(false);
    setS((x) => ({ ...x, [k]: v }));
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-5">
        <h2 className="eyebrow">Гишүүнчлэл</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Хоног зогсоох эрх" hint="Нэг багцад хэдэн удаа зогсоож болох. Зогсоох хугацаа хязгааргүй.">
            <Input type="number" value={s.maxPauses} onChange={(e) => set("maxPauses", Number(e.target.value))} />
          </Field>
          <Field label="Автоматаар эхлүүлэх (хоног)" hint="Төлснөөс хойш энэ хугацаанд ирэхгүй бол хоног өөрөө эхэлнэ. Хоосон = хэзээ ч үгүй.">
            <Input
              type="number"
              value={s.activationDeadlineDays ?? ""}
              onChange={(e) => set("activationDeadlineDays", e.target.value ? Number(e.target.value) : null)}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="eyebrow">Шүүгээ</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Шүүгээний тоо">
            <Input type="number" value={s.lockerCount} onChange={(e) => set("lockerCount", Number(e.target.value))} />
          </Field>
          <Field label="Сарын үнэ (₮)">
            <Input type="number" value={s.lockerMonthlyPriceMnt} onChange={(e) => set("lockerMonthlyPriceMnt", Number(e.target.value))} />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="eyebrow">Төлбөрийн сануулга</h2>
        <textarea className={`${inputClass} h-28 py-2.5`} value={s.refundNotice} onChange={(e) => set("refundNotice", e.target.value)} />
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="eyebrow">Дээд талын урамшууллын зурвас</h2>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" className="size-4 accent-[#F7941D]" checked={s.promoActive} onChange={(e) => set("promoActive", e.target.checked)} />
          Харуулах
        </label>
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <Field label="Шошго">
            <Input value={s.promoTag} onChange={(e) => set("promoTag", e.target.value)} placeholder="Шинэ жил" />
          </Field>
          <Field label="Текст">
            <Input value={s.promoText} onChange={(e) => set("promoText", e.target.value)} placeholder="Бүх багцад 20% хямдрал" />
          </Field>
        </div>
      </Card>

      <ErrorText>{error}</ErrorText>
      <Button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const r = await updateSettings(s);
            if (!r.ok) return setError(r.error);
            setSaved(true);
          })
        }
      >
        {pending ? "…" : saved ? "Хадгалсан ✓" : "Хадгалах"}
      </Button>
    </div>
  );
}
