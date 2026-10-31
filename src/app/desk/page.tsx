import { desc, eq } from "drizzle-orm";
import { AppShell } from "@/components/AppShell";
import { fmtTime } from "@/components/format";
import { db, schema } from "@/server/db";
import { todayUB } from "@/server/membership";
import { requirePage } from "@/server/session";
import { Desk } from "./Desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ресепшн" };

export default async function DeskPage() {
  const u = await requirePage(["reception", "admin"], "/desk");
  const today = todayUB();
  const entries = await db
    .select({ id: schema.checkins.id, at: schema.checkins.createdAt, name: schema.user.name, phone: schema.user.phoneNumber })
    .from(schema.checkins)
    .innerJoin(schema.user, eq(schema.user.id, schema.checkins.userId))
    .where(eq(schema.checkins.day, today))
    .orderBy(desc(schema.checkins.createdAt));

  return (
    <AppShell user={u}>
      <Desk />
      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="eyebrow">Өнөөдөр орсон</h2>
          <span className="display text-[28px] text-orange">{entries.length}</span>
        </div>
        <ul className="divide-y divide-line rounded-md bg-surface-1">
          {entries.slice(0, 30).map((e) => (
            <li key={e.id} className="flex justify-between px-4 py-2.5 text-[14px]">
              <span>{e.name}</span>
              <span className="text-grey">{fmtTime(e.at).split(" ").pop()}</span>
            </li>
          ))}
          {entries.length === 0 && <li className="px-4 py-3 text-[14px] text-grey">Одоогоор хүн ороогүй.</li>}
        </ul>
      </section>
    </AppShell>
  );
}
