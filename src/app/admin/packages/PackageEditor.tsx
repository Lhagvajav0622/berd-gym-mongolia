"use client";

import { useState, useTransition } from "react";
import { deletePackage, savePackage, type PackageInput } from "@/app/actions/admin";
import { Button, Card, ErrorText, Field, Input, inputClass, mnt } from "@/components/ui";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[14px]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[#F7941D]" />
      {label}
    </label>
  );
}

export function PackageEditor({ initial, isNew }: { initial: PackageInput; isNew?: boolean }) {
  const [p, setP] = useState(initial);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const set = <K extends keyof PackageInput>(k: K, v: PackageInput[K]) => {
    setSaved(false);
    setP((x) => ({ ...x, [k]: v }));
  };

  if (!open)
    return isNew ? (
      <Button variant="secondary" size="md" onClick={() => setOpen(true)}>
        + Шинэ багц
      </Button>
    ) : (
      <Card className={`flex cursor-pointer items-center justify-between gap-4 p-4 ${p.active ? "" : "opacity-50"}`} onClick={() => setOpen(true)}>
        <div>
          <div className="display text-[22px] leading-none">
            {p.name} {p.featured && <span className="text-[12px] text-orange">★</span>}
          </div>
          <div className="mt-1 text-[13px] text-grey">
            {p.durationDays} хоног {p.active ? "" : "· нуусан"} {p.lockerAllowed ? "" : "· шүүгээгүй"}
          </div>
        </div>
        <div className="display text-[24px]">{mnt(p.priceMnt)}</div>
      </Card>
    );

  return (
    <Card className="space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Нэр">
          <Input value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="1 сар" />
        </Field>
        <Field label="Тайлбар">
          <Input value={p.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Чөлөөт бүртгэл" />
        </Field>
        <Field label="Хоног" hint="30 = 1 сар. Анх QR уншуулсан өдрөөс тоологдоно.">
          <Input type="number" inputMode="numeric" value={p.durationDays} onChange={(e) => set("durationDays", Number(e.target.value))} />
        </Field>
        <Field label="Үнэ (₮)" hint="Нийт төлөх дүн">
          <Input type="number" inputMode="numeric" value={p.priceMnt} onChange={(e) => set("priceMnt", Number(e.target.value))} />
        </Field>
        <Field label="Хуучин үнэ (₮)" hint="Зураастай харагдана. Хоосон бол харагдахгүй.">
          <Input type="number" inputMode="numeric" value={p.oldPriceMnt ?? ""} onChange={(e) => set("oldPriceMnt", e.target.value ? Number(e.target.value) : null)} />
        </Field>
        <Field label="Дараалал">
          <Input type="number" inputMode="numeric" value={p.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
        </Field>
      </div>
      <Field label="Давуу талууд" hint="Мөр бүрт нэг">
        <textarea
          className={`${inputClass} h-28 py-2.5`}
          value={p.features.join("\n")}
          onChange={(e) => set("features", e.target.value.split("\n"))}
        />
      </Field>
      <div className="flex flex-wrap gap-5">
        <Toggle checked={p.active} onChange={(v) => set("active", v)} label="Сайт дээр харуулах" />
        <Toggle checked={p.featured} onChange={(v) => set("featured", v)} label="Санал болгох" />
        <Toggle checked={p.lockerAllowed} onChange={(v) => set("lockerAllowed", v)} label="Шүүгээ нэмж авч болно" />
      </div>
      <ErrorText>{error}</ErrorText>
      <div className="flex flex-wrap gap-3">
        <Button
          size="md"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setError(null);
              const r = await savePackage(p);
              if (!r.ok) return setError(r.error);
              setSaved(true);
              if (isNew) {
                setP(initial);
                setOpen(false);
              }
            })
          }
        >
          {pending ? "…" : saved ? "Хадгалсан ✓" : "Хадгалах"}
        </Button>
        <Button variant="dark" size="md" onClick={() => setOpen(false)}>
          Хаах
        </Button>
        {!isNew && p.id && (
          <Button
            variant="danger"
            size="md"
            className="ml-auto"
            disabled={pending}
            onClick={() => {
              if (!confirm(`"${p.name}" багцыг устгах уу? Авсан гишүүд байвал зөвхөн нуугдана.`)) return;
              start(async () => {
                const r = await deletePackage(p.id!);
                if (!r.ok) setError(r.error);
              });
            }}
          >
            Устгах
          </Button>
        )}
      </div>
    </Card>
  );
}
