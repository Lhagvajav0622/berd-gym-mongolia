import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { fmtDay, fmtTime, PHASE_TONE } from "@/components/format";
import { Badge, ButtonLink, Card, mnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { pickForEntry, userMemberships } from "@/server/gym";
import { PHASE_LABEL } from "@/server/membership";
import { formatPhone } from "@/server/phone";
import { requirePage } from "@/server/session";
import { getSettings, rulesFrom } from "@/server/settings";
import { EntryQR } from "./EntryQR";
import { PauseButton } from "./PauseButton";

export const metadata = { title: "Миний гишүүнчлэл" };
export const dynamic = "force-dynamic";

export default async function MePage() {
  const u = await requirePage();
  if (!u.profileComplete) redirect("/onboarding");
  const settings = await getSettings();
  const list = await userMemberships(u.id, rulesFrom(settings));
  const current = pickForEntry(list);
  const pending = await db
    .select()
    .from(schema.payments)
    .where(and(eq(schema.payments.userId, u.id), eq(schema.payments.status, "pending")))
    .orderBy(desc(schema.payments.createdAt));
  const visits = await db
    .select()
    .from(schema.checkins)
    .where(eq(schema.checkins.userId, u.id))
    .orderBy(desc(schema.checkins.createdAt))
    .limit(10);
  const others = list.filter((m) => m.id !== current?.id && m.state.phase !== "pending_payment");

  return (
    <AppShell user={u}>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/photo/${u.id}`} alt="" className="size-12 rounded-full object-cover" />
        <div>
          <div className="display text-[22px] leading-none">{u.name}</div>
          <div className="text-[14px] text-grey">{formatPhone(u.phone)}</div>
        </div>
      </div>

      {u.role !== "member" && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <ButtonLink href="/desk" size="md">
            Ресепшн
          </ButtonLink>
          {u.role === "admin" && (
            <ButtonLink href="/admin" size="md" variant="dark">
              Админ
            </ButtonLink>
          )}
        </div>
      )}

      {pending.map((p) => (
        <Link key={p.id} href={`/pay/${p.id}`} className="mt-5 block rounded-lg border border-warn/40 bg-warn/10 p-4">
          <div className="font-semibold text-warn">Төлбөр хүлээгдэж байна · {mnt(p.amountMnt)}</div>
          <div className="text-[14px] text-fg-2">
            {p.method === "cash" ? "Ресепшн дээр бэлнээр төлнө үү." : "QPay-ээр төлөх бол энд дарна уу."}
          </div>
        </Link>
      ))}

      {current ? (
        <Card className="mt-5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="eyebrow">Багц</div>
              <div className="display mt-1 text-[28px] leading-none">{current.packageName}</div>
            </div>
            <Badge tone={PHASE_TONE[current.state.phase]}>{PHASE_LABEL[current.state.phase]}</Badge>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="display metal-text text-[72px] leading-[0.85]">{current.state.daysLeft}</span>
            <span className="pb-1 text-fg-2">хоног үлдсэн</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[14px]">
            <div>
              <div className="text-grey">Эхэлсэн</div>
              <div>{current.state.startOn ? fmtDay(current.state.startOn) : "Анх орох өдрөөс"}</div>
            </div>
            <div>
              <div className="text-grey">Дуусах</div>
              <div>{current.state.phase === "paused" ? "Зогссон" : fmtDay(current.state.endOn)}</div>
            </div>
            {current.lockerNumber != null && (
              <div>
                <div className="text-grey">Шүүгээ</div>
                <div className="display text-[20px] text-orange">№{current.lockerNumber}</div>
              </div>
            )}
          </div>
          {(current.state.phase === "active" || current.state.phase === "paused") && (
            <div className="mt-5">
              <PauseButton
                membershipId={current.id}
                paused={current.state.phase === "paused"}
                pausesLeft={current.state.pausesLeft}
                maxPauses={settings.maxPauses}
              />
            </div>
          )}
          {current.state.phase === "not_started" && (
            <p className="mt-4 text-[14px] text-fg-2">Хоног тань анх QR уншуулж орох өдрөөс тоологдож эхэлнэ.</p>
          )}
        </Card>
      ) : (
        <Card className="mt-5 p-5">
          <div className="display text-[26px]">Идэвхтэй багц алга</div>
          <p className="mt-2 text-fg-2">Багцаа сонгоод QPay эсвэл бэлнээр төлөөрэй.</p>
          <ButtonLink href="/#price" className="mt-4" full>
            Багц сонгох
          </ButtonLink>
        </Card>
      )}

      {(current || pending.length > 0) && (
        <Card className="mt-5 p-5">
          <div className="eyebrow mb-4 text-center">Орох QR</div>
          <EntryQR />
        </Card>
      )}

      {current && (
        <ButtonLink href="/#price" variant="secondary" size="md" className="mt-5" full>
          Багц сунгах / шинээр авах
        </ButtonLink>
      )}

      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="eyebrow mb-3">Бусад багц</h2>
          <div className="space-y-2">
            {others.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md bg-surface-1 px-4 py-3">
                <div>
                  <div className="font-semibold">{m.packageName}</div>
                  <div className="text-[13px] text-grey">
                    {m.state.startOn ? `${fmtDay(m.state.startOn)} – ${fmtDay(m.state.endOn)}` : `${m.durationDays} хоног`}
                  </div>
                </div>
                <Badge tone={PHASE_TONE[m.state.phase]}>{PHASE_LABEL[m.state.phase]}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {visits.length > 0 && (
        <section className="mt-8">
          <h2 className="eyebrow mb-3">Сүүлийн ирц</h2>
          <ul className="divide-y divide-line rounded-md bg-surface-1">
            {visits.map((v) => (
              <li key={v.id} className="px-4 py-2.5 text-[14px] text-fg-2">
                {fmtTime(v.createdAt)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
