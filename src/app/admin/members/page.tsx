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
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-md border border-line">
        {users.map((u) => {
          const mine = ms.filter((m) => m.userId === u.id).map((m) => withState(m, today, rules));
          const cur = pickForEntry(mine);
          return (
            <li key={u.id}>
              <Link href={`/admin/members/${u.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-1">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {u.name}
                    {u.role !== "member" && <span className="ml-2 text-[12px] font-normal text-orange">{ROLE[u.role]}</span>}
                    {!u.profileComplete && <span className="ml-2 text-[12px] font-normal text-warn">зураггүй</span>}
                  </span>
                  <span className="block text-[13px] text-grey">
                    {u.phoneNumber}
                    {cur ? ` · ${cur.packageName}` : ""}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  {cur ? <Badge tone={PHASE_TONE[cur.state.phase]}>{PHASE_LABEL[cur.state.phase]}</Badge> : <span className="text-[13px] text-muted">Багцгүй</span>}
                  {cur && <span className="text-[13px] text-fg-2">{cur.state.daysLeft} хоног</span>}
                </span>
              </Link>
            </li>
          );
        })}
        {users.length === 0 && <li className="px-4 py-3 text-grey">Олдсонгүй.</li>}
      </ul>
    </div>
  );
}
