import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { fmtTime } from "@/components/format";
import { Badge, Card, mnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { PaymentActions } from "./PaymentActions";

export const metadata = { title: "Төлбөр" };

const STATUS = { pending: { t: "Хүлээгдэж буй", tone: "warn" }, paid: { t: "Төлсөн", tone: "ok" }, cancelled: { t: "Цуцалсан", tone: "grey" } } as const;

export default async function PaymentsPage() {
  const rows = await db
    .select({
      p: schema.payments,
      name: schema.user.name,
      phone: schema.user.phoneNumber,
      pkg: schema.memberships.packageName,
      locker: schema.memberships.lockerNumber,
    })
    .from(schema.payments)
    .innerJoin(schema.user, eq(schema.user.id, schema.payments.userId))
    .innerJoin(schema.memberships, eq(schema.memberships.id, schema.payments.membershipId))
    .orderBy(desc(schema.payments.createdAt))
    .limit(150);
  const cash = rows.filter((r) => r.p.status === "pending" && r.p.method === "cash");
  const rest = rows.filter((r) => !(r.p.status === "pending" && r.p.method === "cash"));

  return (
    <div className="space-y-8">
      <section>
        <h1 className="display text-[32px]">Бэлэн төлбөр хүлээгдэж буй</h1>
        <p className="mt-1 text-[14px] text-grey">Гишүүн ресепшн дээр мөнгөө төлсний дараа баталгаажуулна. Захиалгын код гишүүний утсан дээр харагдана.</p>
        <div className="mt-4 space-y-3">
          {cash.length === 0 && <p className="text-grey">Хүлээгдэж буй бэлэн төлбөр алга.</p>}
          {cash.map(({ p, name, phone, pkg, locker }) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-48 flex-1">
                <Link href={`/admin/members/${p.userId}`} className="font-semibold hover:text-orange">
                  {name} · {phone}
                </Link>
                <div className="text-[14px] text-fg-2">
                  {pkg}
                  {locker != null ? ` + шүүгээ №${locker}` : ""} · код <b className="text-orange">{p.id.slice(0, 8).toUpperCase()}</b> · {fmtTime(p.createdAt)}
                </div>
              </div>
              <div className="display text-[26px]">{mnt(p.amountMnt)}</div>
              <PaymentActions id={p.id} />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="eyebrow mb-3">Сүүлийн төлбөрүүд</h2>
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="bg-surface-1 text-grey">
              <tr>
                <th className="px-3 py-2 font-medium">Огноо</th>
                <th className="px-3 py-2 font-medium">Гишүүн</th>
                <th className="px-3 py-2 font-medium">Багц</th>
                <th className="px-3 py-2 font-medium">Хэлбэр</th>
                <th className="px-3 py-2 text-right font-medium">Дүн</th>
                <th className="px-3 py-2 font-medium">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rest.map(({ p, name, pkg }) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 text-fg-2">{fmtTime(p.paidAt ?? p.createdAt)}</td>
                  <td className="px-3 py-2">
                    <Link href={`/admin/members/${p.userId}`} className="hover:text-orange">{name}</Link>
                  </td>
                  <td className="px-3 py-2">{pkg}</td>
                  <td className="px-3 py-2">{p.method === "qpay" ? "QPay" : "Бэлэн"}</td>
                  <td className="px-3 py-2 text-right">{mnt(p.amountMnt)}</td>
                  <td className="px-3 py-2">
                    <Badge tone={STATUS[p.status].tone}>{STATUS[p.status].t}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
