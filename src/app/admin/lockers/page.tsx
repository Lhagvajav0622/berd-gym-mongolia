import Link from "next/link";
import { lockerOverview } from "@/server/gym";

export const metadata = { title: "Шүүгээ" };

export default async function LockersPage() {
  const lockers = await lockerOverview();
  const used = lockers.filter((l) => l.membership).length;
  return (
    <div>
      <h1 className="display text-[32px]">Шүүгээ</h1>
      <p className="mt-1 text-[14px] text-grey">
        {used}/{lockers.length} эзэнтэй. Багц дуусахад шүүгээ автоматаар сулрана. Тоо, үнийг Тохиргоо хэсгээс өөрчилнө.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {lockers.map((l) => (
          <div key={l.number} className={`rounded-md border p-3 ${l.membership ? "border-orange/50 bg-orange/[.06]" : "border-line-2 bg-surface-1"}`}>
            <div className="display text-[26px] leading-none">№{l.number}</div>
            {l.membership && l.user ? (
              <Link href={`/admin/members/${l.user.id}`} className="mt-2 block text-[13.5px] hover:text-orange">
                {l.user.name}
                <span className="block text-grey">
                  {l.membership.status === "pending_payment" ? "Төлбөр хүлээгдэж байна" : l.membership.packageName}
                </span>
              </Link>
            ) : (
              <div className="mt-2 text-[13.5px] text-ok">Сул</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
