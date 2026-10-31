import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { fmtDay, fmtTime, PHASE_TONE } from "@/components/format";
import { Badge, Card, mnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { freeLockerCount, listPackages, userMemberships } from "@/server/gym";
import { PHASE_LABEL } from "@/server/membership";
import { getSettings, rulesFrom } from "@/server/settings";
import { MemberProfile, MembershipActions, SellCash } from "./MemberControls";

export const metadata = { title: "Гишүүн" };

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [u] = await db.select().from(schema.user).where(eq(schema.user.id, id));
  if (!u) notFound();
  const settings = await getSettings();
  const [list, packages, visits, payments, freeLockers, [photo]] = await Promise.all([
    userMemberships(u.id, rulesFrom(settings)),
    listPackages({ activeOnly: true }),
    db.select().from(schema.checkins).where(eq(schema.checkins.userId, u.id)).orderBy(desc(schema.checkins.createdAt)).limit(30),
    db.select().from(schema.payments).where(eq(schema.payments.userId, u.id)).orderBy(desc(schema.payments.createdAt)),
    freeLockerCount(),
    db.select({ at: schema.memberPhotos.updatedAt }).from(schema.memberPhotos).where(eq(schema.memberPhotos.userId, u.id)),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <MemberProfile
        user={{ id: u.id, name: u.name, phone: u.phoneNumber ?? "", role: u.role, createdAt: fmtDay(u.createdAt.toISOString().slice(0, 10)) }}
        photoVersion={photo ? String(+photo.at) : null}
      />

      <div className="space-y-8">
        <section>
          <h2 className="eyebrow mb-3">Багцууд</h2>
          <div className="space-y-3">
            {list.length === 0 && <p className="text-grey">Багц аваагүй.</p>}
            {list.map((m) => {
              const pay = payments.find((p) => p.membershipId === m.id);
              return (
                <Card key={m.id} className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="display text-[20px]">{m.packageName}</span>
                    <Badge tone={PHASE_TONE[m.state.phase]}>{PHASE_LABEL[m.state.phase]}</Badge>
                    {m.lockerNumber != null && <Badge tone="orange">Шүүгээ №{m.lockerNumber}</Badge>}
                    <span className="ml-auto text-[14px] text-fg-2">
                      {pay ? `${pay.method === "qpay" ? "QPay" : "Бэлэн"} · ${mnt(pay.amountMnt)}` : mnt(m.priceMnt + m.lockerPriceMnt)}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[13.5px] text-fg-2 sm:grid-cols-4">
                    <span>Эхэлсэн: {fmtDay(m.state.startOn)}</span>
                    <span>Дуусах: {fmtDay(m.state.endOn)}</span>
                    <span>Үлдсэн: {m.state.daysLeft} хоног</span>
                    <span>
                      Зогсоосон: {m.pauseCount}/{settings.maxPauses}
                      {m.pausedDays ? ` (${m.pausedDays} хоног)` : ""}
                    </span>
                    {m.adjustDays !== 0 && <span>Админ нэмсэн: {m.adjustDays > 0 ? "+" : ""}{m.adjustDays}</span>}
                  </div>
                  {m.note && <p className="mt-2 text-[13px] text-grey">Тэмдэглэл: {m.note}</p>}
                  {m.state.phase !== "cancelled" && <MembershipActions id={m.id} locker={m.lockerNumber} lockerCount={settings.lockerCount} />}
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="eyebrow mb-3">Бэлэн мөнгөөр багц зарах</h2>
          <SellCash userId={u.id} packages={packages.map((p) => ({ id: p.id, name: p.name, price: p.priceMnt, lockerAllowed: p.lockerAllowed }))} freeLockers={freeLockers} />
        </section>

        <section>
          <h2 className="eyebrow mb-3">Ирц ({visits.length})</h2>
          <div className="flex flex-wrap gap-1.5">
            {visits.map((v) => (
              <span key={v.id} className="rounded-xs bg-surface-1 px-2 py-1 text-[12.5px] text-fg-2">
                {fmtTime(v.createdAt)}
              </span>
            ))}
            {visits.length === 0 && <span className="text-grey">Ирээгүй.</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
