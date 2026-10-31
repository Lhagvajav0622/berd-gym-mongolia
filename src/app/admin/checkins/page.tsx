import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";
import { fmtTime } from "@/components/format";
import { Input } from "@/components/ui";
import { db, schema } from "@/server/db";
import { todayUB } from "@/server/membership";

export const metadata = { title: "Ирц" };

export default async function CheckinsPage({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  const { day: d } = await searchParams;
  const day = d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : todayUB();
  const staff = alias(schema.user, "staff");
  const rows = await db
    .select({ id: schema.checkins.id, at: schema.checkins.createdAt, userId: schema.user.id, name: schema.user.name, phone: schema.user.phoneNumber, pkg: schema.memberships.packageName, staff: staff.name })
    .from(schema.checkins)
    .innerJoin(schema.user, eq(schema.user.id, schema.checkins.userId))
    .leftJoin(schema.memberships, eq(schema.memberships.id, schema.checkins.membershipId))
    .leftJoin(staff, eq(staff.id, schema.checkins.staffId))
    .where(eq(schema.checkins.day, day))
    .orderBy(desc(schema.checkins.createdAt));

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <h1 className="display text-[32px]">Ирц</h1>
        <form className="ml-auto flex items-center gap-2">
          <Input type="date" name="day" defaultValue={day} className="h-10 w-auto" />
          <button className="h-10 rounded-full bg-surface-2 px-4 text-[14px]">Харах</button>
        </form>
      </div>
      <p className="mt-1 text-grey">
        {day}: <b className="text-orange">{rows.length}</b> орсон
      </p>
      <div className="mt-4 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[560px] text-left text-[14px]">
          <thead className="bg-surface-1 text-grey">
            <tr>
              <th className="px-3 py-2 font-medium">Цаг</th>
              <th className="px-3 py-2 font-medium">Гишүүн</th>
              <th className="px-3 py-2 font-medium">Багц</th>
              <th className="px-3 py-2 font-medium">Оруулсан</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 text-fg-2">{fmtTime(r.at).split(" ").pop()}</td>
                <td className="px-3 py-2">
                  <Link href={`/admin/members/${r.userId}`} className="hover:text-orange">
                    {r.name}
                  </Link>{" "}
                  <span className="text-grey">{r.phone}</span>
                </td>
                <td className="px-3 py-2">{r.pkg ?? "—"}</td>
                <td className="px-3 py-2 text-fg-2">{r.staff ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
