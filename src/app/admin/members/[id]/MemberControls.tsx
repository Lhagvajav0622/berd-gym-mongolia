"use client";

import { useState, useTransition } from "react";
import { adjustMembership, sellCash, updateMember } from "@/app/actions/admin";
import { resizeImage } from "@/components/PhotoCapture";
import { Button, Card, ErrorText, Input, inputClass, mnt } from "@/components/ui";

type Role = "member" | "reception" | "admin";

export function MemberProfile({ user, photoVersion }: { user: { id: string; name: string; phone: string; role: Role; createdAt: string }; photoVersion: string | null }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<Role>(user.role);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [v, setV] = useState(photoVersion);

  const save = (patch: Parameters<typeof updateMember>[0]) =>
    start(async () => {
      setError(null);
      const r = await updateMember(patch);
      if (!r.ok) return setError(r.error);
      setMsg("Хадгаллаа");
      setTimeout(() => setMsg(null), 2000);
    });

  return (
    <Card className="h-fit space-y-4 p-4">
      {v ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/photo/${user.id}?v=${v}`} alt={user.name} className="aspect-square w-full rounded-md object-cover" />
      ) : (
        <div className="grid aspect-square place-items-center rounded-md bg-surface-2 text-warn">Зураг байхгүй</div>
      )}
      <label className={`${inputClass} flex cursor-pointer items-center justify-center text-[14px]`}>
        Зураг солих
        <input
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            const photo = await resizeImage(f, 480, true);
            save({ userId: user.id, photo });
            setV(String(Date.now()));
          }}
        />
      </label>
      <div className="text-fg-2">
        {user.phone} · бүртгүүлсэн {user.createdAt}
      </div>
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Button size="md" variant="dark" disabled={pending || name === user.name} onClick={() => save({ userId: user.id, name })}>
          Нэр
        </Button>
      </div>
      <div className="flex gap-2">
        <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="member">Гишүүн</option>
          <option value="reception">Ресепшн</option>
          <option value="admin">Админ</option>
        </select>
        <Button size="md" variant="dark" disabled={pending || role === user.role} onClick={() => save({ userId: user.id, role })}>
          Эрх
        </Button>
      </div>
      {msg && <p className="text-[13px] text-ok">{msg}</p>}
      <ErrorText>{error}</ErrorText>
    </Card>
  );
}

export function MembershipActions({ id, locker, lockerCount }: { id: string; locker: number | null; lockerCount: number }) {
  const [days, setDays] = useState("");
  const [lockerInput, setLockerInput] = useState(locker?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const act = (input: Omit<Parameters<typeof adjustMembership>[0], "membershipId">) =>
    start(async () => {
      setError(null);
      const r = await adjustMembership({ membershipId: id, ...input });
      if (!r.ok) setError(r.error);
      else setDays("");
    });

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
      <Input className="h-9 w-24" type="number" placeholder="±хоног" value={days} onChange={(e) => setDays(e.target.value)} />
      <Button size="sm" variant="dark" disabled={pending || !days} onClick={() => act({ addDays: Number(days) })}>
        Хоног нэмэх/хасах
      </Button>
      <Input className="h-9 w-20" type="number" min={1} max={lockerCount} placeholder="№" value={lockerInput} onChange={(e) => setLockerInput(e.target.value)} />
      <Button
        size="sm"
        variant="dark"
        disabled={pending || lockerInput === (locker?.toString() ?? "")}
        onClick={() => act({ lockerNumber: lockerInput ? Number(lockerInput) : null })}
      >
        Шүүгээ солих
      </Button>
      <Button
        size="sm"
        variant="danger"
        className="ml-auto"
        disabled={pending}
        onClick={() => confirm("Энэ багцыг цуцлах уу? Буцаах боломжгүй.") && act({ cancel: true })}
      >
        Цуцлах
      </Button>
      {error && <p className="w-full text-[13px] text-bad">{error}</p>}
    </div>
  );
}

export function SellCash({ userId, packages, freeLockers }: { userId: string; packages: { id: string; name: string; price: number; lockerAllowed: boolean }[]; freeLockers: number }) {
  const [pkg, setPkg] = useState(packages[0]?.id ?? "");
  const [locker, setLocker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  const sel = packages.find((p) => p.id === pkg);
  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <select className={`${inputClass} w-auto min-w-48 flex-1`} value={pkg} onChange={(e) => setPkg(e.target.value)}>
        {packages.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {mnt(p.price)}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" className="size-4 accent-[#F7941D]" checked={locker} disabled={!sel?.lockerAllowed || freeLockers <= 0} onChange={(e) => setLocker(e.target.checked)} />
        Шүүгээ ({freeLockers} сул)
      </label>
      <Button
        size="md"
        disabled={pending || !pkg}
        onClick={() => {
          if (!confirm("Бэлэн мөнгө хүлээн авч, багцыг идэвхжүүлэх үү?")) return;
          start(async () => {
            setError(null);
            const r = await sellCash({ userId, packageId: pkg, withLocker: locker });
            if (!r.ok) return setError(r.error);
            setOk(true);
            setLocker(false);
          });
        }}
      >
        Мөнгө авч идэвхжүүлэх
      </Button>
      {ok && <span className="text-[13px] text-ok">Нэмэгдлээ ✓</span>}
      {error && <p className="w-full text-[13px] text-bad">{error}</p>}
    </Card>
  );
}
