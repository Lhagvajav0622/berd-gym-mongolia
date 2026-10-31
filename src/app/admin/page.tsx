import { and, count, eq, gte, sum } from "drizzle-orm";
import Link from "next/link";
import { Card, mnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { freeLockerCount, withState } from "@/server/gym";
import { addDays, todayUB } from "@/server/membership";
import { getSettings, rulesFrom } from "@/server/settings";

export const metadata = { title: "Самбар" };

function Stat({ label, value, href, tone }: { label: string; value: string | number; href?: string; tone?: "orange" | "warn" }) {
  const inner = (
    <Card className="h-full p-4">
      <div className="eyebrow">{label}</div>
      <div className={`display mt-2 text-[36px] leading-none ${tone === "orange" ? "text-orange" : tone === "warn" ? "text-warn" : ""}`}>{value}</div>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminHome() {
  const today = todayUB();
  const from = addDays(today, -13);
  const monthStart = new Date(`${today.slice(0, 8)}01T00:00:00+08:00`);
  const rules = rulesFrom(await getSettings());

  const [daily, [newMembers], [revenue], [pendingCash], memberships, freeLockers] = await Promise.all([
    db
      .select({ day: schema.checkins.day, n: count() })
      .from(schema.checkins)
      .where(gte(schema.checkins.day, from))
      .groupBy(schema.checkins.day),
    db.select({ n: count() }).from(schema.user).where(gte(schema.user.createdAt, monthStart)),
    db
      .select({ total: sum(schema.payments.amountMnt) })
      .from(schema.payments)
      .where(and(eq(schema.payments.status, "paid"), gte(schema.payments.paidAt, monthStart))),
    db
      .select({ n: count() })
      .from(schema.payments)
      .where(and(eq(schema.payments.status, "pending"), eq(schema.payments.method, "cash"))),
    db.select().from(schema.memberships).where(eq(schema.memberships.status, "paid")),
    freeLockerCount(),
  ]);
  const states = memberships.map((m) => withState(m, today, rules).state.phase);
  const activeUsers = new Set(memberships.filter((_, i) => states[i] === "active" || states[i] === "paused").map((m) => m.userId)).size;
  const notStarted = states.filter((s) => s === "not_started").length;
  const byDay = new Map(daily.map((d) => [d.day, d.n]));
  const days = Array.from({ length: 14 }, (_, i) => addDays(from, i));
  const max = Math.max(1, ...days.map((d) => byDay.get(d) ?? 0));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Өнөөдөр орсон" value={byDay.get(today) ?? 0} tone="orange" href="/admin/checkins" />
        <Stat label="Идэвхтэй гишүүн" value={activeUsers} href="/admin/members" />
        <Stat label="Эхлээгүй багц" value={notStarted} />
        <Stat label="Сул шүүгээ" value={freeLockers} href="/admin/lockers" />
        <Stat label="Энэ сарын шинэ бүртгэл" value={newMembers?.n ?? 0} />
        <Stat label="Энэ сарын орлого" value={mnt(Number(revenue?.total ?? 0))} />
        <Stat label="Бэлэн төлбөр хүлээгдэж буй" value={pendingCash?.n ?? 0} tone={pendingCash?.n ? "warn" : undefined} href="/admin/payments" />
      </div>

      <section>
        <h2 className="eyebrow mb-3">Сүүлийн 14 хоногийн ирц</h2>
        <Card className="p-4">
          <div className="flex h-44 items-end gap-1.5">
            {days.map((d) => {
              const n = byDay.get(d) ?? 0;
              return (
                <div key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[11px] text-fg-2">{n || ""}</span>
                  <div className={`w-full rounded-t-xs ${d === today ? "bg-orange" : "bg-surface-3"}`} style={{ height: `${(n / max) * 100}%`, minHeight: n ? 3 : 0 }} />
                  <span className="text-[10px] text-muted">{d.slice(8)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
