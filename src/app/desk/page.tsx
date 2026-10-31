import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { PaymentActions } from "@/app/admin/payments/PaymentActions";
import { AppShell } from "@/components/AppShell";
import { fmtTime } from "@/components/format";
import { btnClass, mnt } from "@/components/ui";
import { freeLockerCount, listPackages } from "@/server/gym";
import { db, schema } from "@/server/db";
import { todayUB } from "@/server/membership";
import { requirePage } from "@/server/session";
import { Desk } from "./Desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ресепшн" };

export default async function DeskPage({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  const u = await requirePage(["reception", "admin"], "/desk");
  const { u: openUser } = await searchParams;
  const today = todayUB();
  const entries = await db
    .select({ id: schema.checkins.id, at: schema.checkins.createdAt, name: schema.user.name, phone: schema.user.phoneNumber })
    .from(schema.checkins)
    .innerJoin(schema.user, eq(schema.user.id, schema.checkins.userId))
    .where(eq(schema.checkins.day, today))
    .orderBy(desc(schema.checkins.createdAt));
  const [cash, packages, freeLockers] = await Promise.all([
    db
      .select({ p: schema.payments, name: schema.user.name, phone: schema.user.phoneNumber, pkg: schema.memberships.packageName, locker: schema.memberships.lockerNumber })
      .from(schema.payments)
      .innerJoin(schema.user, eq(schema.user.id, schema.payments.userId))
      .innerJoin(schema.memberships, eq(schema.memberships.id, schema.payments.membershipId))
      .where(and(eq(schema.payments.status, "pending"), eq(schema.payments.method, "cash")))
      .orderBy(desc(schema.payments.createdAt)),
    listPackages({ activeOnly: true }),
    freeLockerCount(),
  ]);

  return (
    <AppShell user={u}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="display text-[32px] leading-none">Ресепшн</h1>
        <Link href="/desk/new" className={btnClass("secondary", "sm")}>
          + Шинэ гишүүн
        </Link>
      </div>
      <Desk
        initialUserId={openUser && /^[0-9a-f-]{36}$/.test(openUser) ? openUser : null}
        packages={packages.map((p) => ({ id: p.id, name: p.name, price: p.priceMnt, lockerAllowed: p.lockerAllowed }))}
        freeLockers={freeLockers}
      />

      {cash.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="eyebrow">Бэлэн төлбөр хүлээгдэж буй</h2>
            <span className="display text-[28px] text-warn">{cash.length}</span>
          </div>
          <ul className="space-y-2.5">
            {cash.map(({ p, name, phone, pkg, locker }) => (
              <li key={p.id} className="rounded-md border border-warn/30 bg-surface-1 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{name}</div>
                    <div className="text-[13px] text-grey">
                      {phone} · {pkg}
                      {locker != null ? ` + шүүгээ №${locker}` : ""}
                    </div>
                    <div className="text-[13px] text-grey">
                      код <b className="text-orange">{p.id.slice(0, 8).toUpperCase()}</b> · {fmtTime(p.createdAt)}
                    </div>
                  </div>
                  <div className="display shrink-0 text-[22px]">{mnt(p.amountMnt)}</div>
                </div>
                <div className="mt-3">
                  <PaymentActions id={p.id} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
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
