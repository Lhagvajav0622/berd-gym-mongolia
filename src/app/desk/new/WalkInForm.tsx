"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerWalkIn } from "@/app/actions/desk";
import { PhotoCapture } from "@/components/PhotoCapture";
import { Button, ErrorText, Field, Input, inputClass, mnt } from "@/components/ui";

type Pkg = { id: string; name: string; price: number; lockerPrice: number | null };

export function WalkInForm({ packages, freeLockers }: { packages: Pkg[]; freeLockers: number }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [pkgId, setPkgId] = useState(packages[0]?.id ?? "");
  const [locker, setLocker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const pkg = packages.find((p) => p.id === pkgId);
  const canLocker = pkg?.lockerPrice != null && freeLockers > 0;
  const total = (pkg?.price ?? 0) + (locker && canLocker ? pkg!.lockerPrice! : 0);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (!photo) return setError("Царайны зураг авна уу.");
        if (!confirm(`${mnt(total)} бэлнээр авсан уу?`)) return;
        start(async () => {
          const r = await registerWalkIn({ phone, name, photo, packageId: pkgId, withLocker: locker && canLocker });
          if (!r.ok) return setError(r.error);
          router.push(`/desk?u=${r.data!.userId}`);
        });
      }}
    >
      <Field label="Утас">
        <Input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9911 2233" />
      </Field>
      <Field label="Овог нэр">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div>
        <span className="eyebrow mb-3 block">Царайны зураг</span>
        <PhotoCapture value={photo} onChange={setPhoto} />
      </div>
      <Field label="Багц">
        <select className={inputClass} value={pkgId} onChange={(e) => setPkgId(e.target.value)}>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {mnt(p.price)}
            </option>
          ))}
        </select>
      </Field>
      <label className={`flex items-center gap-3 rounded-md bg-surface-1 p-3.5 ${canLocker ? "" : "opacity-45"}`}>
        <input type="checkbox" className="size-5 accent-[#F7941D]" disabled={!canLocker} checked={locker && canLocker} onChange={(e) => setLocker(e.target.checked)} />
        <span className="flex-1">
          Шүүгээ түрээслэх
          <span className="block text-[13px] text-grey">{freeLockers > 0 ? `${freeLockers} сул үлдсэн` : "Сул шүүгээ дууссан"}</span>
        </span>
        {pkg?.lockerPrice != null && <span className="display">+{mnt(pkg.lockerPrice)}</span>}
      </label>
      <div className="flex items-end justify-between border-t border-line-2 pt-4">
        <span className="text-fg-2">Авах бэлэн мөнгө</span>
        <span className="display metal-text text-[36px] leading-none">{mnt(total)}</span>
      </div>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" full disabled={pending}>
        {pending ? "…" : "Мөнгө авсан · Бүртгэх"}
      </Button>
    </form>
  );
}
