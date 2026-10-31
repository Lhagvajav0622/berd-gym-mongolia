import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { freeLockerCount, listPackages } from "@/server/gym";
import { lockerMonths } from "@/server/membership";
import { requirePage } from "@/server/session";
import { getSettings } from "@/server/settings";
import { WalkInForm } from "./WalkInForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Шинэ гишүүн" };

export default async function NewWalkInPage() {
  const u = await requirePage(["reception", "admin"], "/desk/new");
  const [packages, freeLockers, settings] = await Promise.all([listPackages({ activeOnly: true }), freeLockerCount(), getSettings()]);
  return (
    <AppShell user={u}>
      <Link href="/desk" className="mb-4 inline-flex text-[14px] text-fg-2 hover:text-fg">
        ← Ресепшн
      </Link>
      <h1 className="display text-[34px] leading-none">Шинэ гишүүн</h1>
      <p className="mt-2 text-[14px] text-fg-2">
        Бэлнээр төлж буй хүнийг бүртгэнэ. Гишүүн дараа нь энэ дугаараараа нэвтэрч QR-аа харна.
      </p>
      <div className="mt-6">
        <WalkInForm
          packages={packages.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.priceMnt,
            lockerPrice: p.lockerAllowed ? lockerMonths(p.durationDays) * settings.lockerMonthlyPriceMnt : null,
          }))}
          freeLockers={freeLockers}
        />
      </div>
    </AppShell>
  );
}
