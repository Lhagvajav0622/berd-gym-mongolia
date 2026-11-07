import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { DEFAULT_GALLERY } from "@/brand";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { durationLabel } from "@/components/format";
import { mnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { freeLockerCount } from "@/server/gym";
import { lockerMonths } from "@/server/membership";
import { getCurrentUser } from "@/server/session";
import { getSettings } from "@/server/settings";
import { JoinForm } from "./JoinForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Багц авах" };

export default async function JoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const u = await getCurrentUser();
  if (!u) redirect(`/login?next=/join/${id}`);
  if (!u.profileComplete) redirect(`/onboarding?next=/join/${id}`);
  const [pkg] = await db.select().from(schema.packages).where(eq(schema.packages.id, id));
  if (!pkg || !pkg.active) notFound();
  const [settings, freeLockers, photos] = await Promise.all([
    getSettings(),
    freeLockerCount(),
    db
      .select({ id: schema.galleryPhotos.id })
      .from(schema.galleryPhotos)
      .orderBy(asc(schema.galleryPhotos.sortOrder))
      .limit(6),
  ]);
  const months = lockerMonths(pkg.durationDays);

  return (
    <AppShell user={u}>
      <Link href="/#price" className="mb-4 inline-flex items-center gap-1.5 text-[14px] text-fg-2 hover:text-fg">
        ← Багц солих
      </Link>
      <div className="eyebrow">Багц</div>
      <h1 className="display mt-1 text-[44px] leading-[0.95]">{pkg.name}</h1>
      {pkg.subtitle && <p className="mt-2 text-fg-2">{pkg.subtitle}</p>}
      {pkg.oldPriceMnt && pkg.oldPriceMnt > pkg.priceMnt ? (
        <div className="mt-4 flex items-center gap-2">
          <span className="display text-[20px] leading-none text-fg-2 line-through decoration-bad decoration-2">{mnt(pkg.oldPriceMnt)}</span>
          <span className="display rounded-xs bg-bad px-2 py-1 text-[12px] leading-none text-white">
            {mnt(pkg.oldPriceMnt - pkg.priceMnt)} хэмнэнэ
          </span>
        </div>
      ) : null}
      <div className="mt-2 flex items-baseline gap-2">
        <span className="display metal-text text-[44px] leading-none">{mnt(pkg.priceMnt)}</span>
        <span className="text-muted">/ {durationLabel(pkg.durationDays)}</span>
      </div>
      {pkg.features.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-fg-2">
          {pkg.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-orange">✓</span>
              {f}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <JoinForm
          packageId={pkg.id}
          price={pkg.priceMnt}
          lockerAllowed={pkg.lockerAllowed}
          lockerPrice={months * settings.lockerMonthlyPriceMnt}
          lockerLabel={`${months} сар × ${mnt(settings.lockerMonthlyPriceMnt)}`}
          freeLockers={freeLockers}
          notice={settings.refundNotice}
          photos={photos.length ? photos.map((p) => `/api/gallery/${p.id}`) : DEFAULT_GALLERY.map((g) => g.src)}
        />
      </div>
    </AppShell>
  );
}
