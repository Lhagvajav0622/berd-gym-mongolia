import { listPackages } from "@/server/gym";
import { PackageEditor } from "./PackageEditor";

export const metadata = { title: "Багц" };

export default async function PackagesPage() {
  const packages = await listPackages();
  return (
    <div>
      <h1 className="display text-[32px]">Багцууд</h1>
      <p className="mt-1 text-[14px] text-grey">Үнэ, хоногийг солиход өмнө нь авсан гишүүдийн багц өөрчлөгдөхгүй. Нуусан багц сайт дээр харагдахгүй.</p>
      <div className="mt-6 space-y-4">
        {packages.map((p) => (
          <PackageEditor
            key={p.id}
            initial={{
              id: p.id,
              name: p.name,
              subtitle: p.subtitle ?? "",
              durationDays: p.durationDays,
              priceMnt: p.priceMnt,
              oldPriceMnt: p.oldPriceMnt,
              features: p.features,
              featured: p.featured,
              lockerAllowed: p.lockerAllowed,
              active: p.active,
              sortOrder: p.sortOrder,
            }}
          />
        ))}
        <PackageEditor
          initial={{ name: "", subtitle: "", durationDays: 30, priceMnt: 0, oldPriceMnt: null, features: [], featured: false, lockerAllowed: true, active: true, sortOrder: packages.length }}
          isNew
        />
      </div>
    </div>
  );
}
