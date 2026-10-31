import { desc, ilike, inArray, or } from "drizzle-orm";
import Link from "next/link";
import { PHASE_TONE } from "@/components/format";
import { Badge, ButtonLink, Input } from "@/components/ui";
import { db, schema } from "@/server/db";
import { pickForEntry, withState } from "@/server/gym";
import { PHASE_LABEL, todayUB } from "@/server/membership";
import { getSettings, rulesFrom } from "@/server/settings";

export const metadata = { title: "Гишүүд" };

const ROLE = { member: "", reception: "Ресепшн", admin: "Админ" } as const;

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().replace(/[%_]/g, "");
  const users = await db
    .select()
    .from(schema.user)
    .where(term ? or(ilike(schema.user.phoneNumber, `%${term.replace(/\s/g, "")}%`), ilike(schema.user.name, `%${term}%`)) : undefined)
    .orderBy(desc(schema.user.createdAt))
    .limit(100);
  const ids = users.map((u) => u.id);
  const ms = ids.length ? await db.select().from(schema.memberships).where(inArray(schema.memberships.userId, ids)) : [];
  const rules = rulesFrom(await getSettings());
  const today = todayUB();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="display text-[32px]">Гишүүд</h1>
        <ButtonLink href="/admin/members/new" size="sm" variant="secondary" className="ml-auto">
          + Ресепшн дээр бүртгэх
        </ButtonLink>
      </div>
      <form className="mt-4 flex gap-2">
        <Input name="q" defaultValue={q} placeholder="Утас эсвэл нэрээр хайх" />
      </form>
      <div className="mt-4 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="bg-surface-1 text-grey">
            <tr>
              <th className="px-3 py-2 font-medium">Нэр</th>
              <th className="px-3 py-2 font-medium">Утас</th>
              <th className="px-3 py-2 font-medium">Багц</th>
              <th className="px-3 py-2 font-medium">Төлөв</th>
              <th className="px-3 py-2 text-right font-medium">Үлдсэн</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => {
              const mine = ms.filter((m) => m.userId === u.id).map((m) => withState(m, today, rules));
              const cur = pickForEntry(mine);
              return (
                <tr key={u.id} className="hover:bg-surface-1">
                  <td className="px-3 py-2">
                    <Link href={`/admin/members/${u.id}`} className="font-semibold hover:text-orange">
                      {u.name}
                    </Link>
                    {u.role !== "member" && <span className="ml-2 text-[12px] text-orange">{ROLE[u.role]}</span>}
                    {!u.profileComplete && <span className="ml-2 text-[12px] text-warn">зураггүй</span>}
                  </td>
                  <td className="px-3 py-2 text-fg-2">{u.phoneNumber}</td>
                  <td className="px-3 py-2">{cur?.packageName ?? "—"}</td>
                  <td className="px-3 py-2">{cur ? <Badge tone={PHASE_TONE[cur.state.phase]}>{PHASE_LABEL[cur.state.phase]}</Badge> : <span className="text-muted">Багцгүй</span>}</td>
                  <td className="px-3 py-2 text-right">{cur ? `${cur.state.daysLeft} хоног` : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
