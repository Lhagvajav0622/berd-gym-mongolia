import { asc } from "drizzle-orm";
import { ButtonLink, Container, Logo, shortMnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { listPackages } from "@/server/gym";
import { getCurrentUser } from "@/server/session";
import { getSettings } from "@/server/settings";
import { BRAND, DEFAULT_GALLERY } from "@/brand";
import { PackagePicker } from "./PackagePicker";
import { PromoBanner } from "./PromoBanner";

export const dynamic = "force-dynamic";

const PHONE = BRAND.phone;
const PHONE2 = BRAND.phone2;

const FEATURES = [
  "Мэргэжлийн багш дасгалжуулагч",
  "Хоолны зөвлөгөө, дэглэм",
  "Дасгалын зөв техник заавар",
  "Cardio · Fitness · Хүчний бэлтгэл",
  "06:00–22:00, өдөр бүр нээлттэй",
  "Турах · Жин нэмэх · Булчин нэмэх",
];

const NAV = [
  { label: "Давуу тал", href: "#why" },
  { label: "Багц", href: "#price" },
  { label: "Заал", href: "#gallery" },
  { label: "Холбоо барих", href: "#contact" },
];

function SectionLabel({ index, kicker, children }: { index: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-9 gap-y-2 border-t border-line-2 pt-[18px]">
      <span className="display text-[clamp(15px,1.4vw,18px)] tracking-[.04em] text-orange">{index}</span>
      <div>
        <div className="mb-2 font-display text-[clamp(11px,1.1vw,13px)] font-medium tracking-[.16em] text-muted uppercase">{kicker}</div>
        <h2 className="display text-[clamp(34px,5vw,64px)] leading-[.92] tracking-[-.01em]">{children}</h2>
      </div>
    </div>
  );
}

export default async function Home() {
  const [packages, settings, user, photos] = await Promise.all([
    listPackages({ activeOnly: true }),
    getSettings(),
    getCurrentUser(),
    db
      .select({ id: schema.galleryPhotos.id, caption: schema.galleryPhotos.caption })
      .from(schema.galleryPhotos)
      .orderBy(asc(schema.galleryPhotos.sortOrder), asc(schema.galleryPhotos.createdAt)),
  ]);
  const gallery = photos.length
    ? photos.map((p) => ({ src: `/api/gallery/${p.id}`, caption: p.caption }))
    : DEFAULT_GALLERY;

  return (
    <div className="overflow-x-hidden">
      {settings.promoActive && <PromoBanner tag={settings.promoTag} text={settings.promoText} />}

      <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur">
        <Container className="flex items-center justify-between gap-6 py-3 lg:py-3.5">
          <Logo className="h-8 lg:h-9" />
          <nav className="mr-2 ml-auto hidden items-center gap-7 lg:flex">
            {NAV.filter((n) => n.href !== "#gallery" || gallery.length).map((n) => (
              <a key={n.href} href={n.href} className="display text-[15.5px] font-semibold tracking-[.05em] text-fg-2 transition hover:text-fg">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="display hidden text-[17px] text-orange sm:inline">
              {PHONE}
            </a>
            <ButtonLink href={user ? "/me" : "/login"} size="md" variant={user ? "dark" : "primary"}>
              {user ? "Миний QR" : "Нэвтрэх"}
            </ButtonLink>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[clamp(640px,92vh,900px)] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/gym-1.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0" style={{ background: "var(--grad-hero-scrim)" }} />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(8,8,8,.94)_0%,rgba(8,8,8,.5)_46%,transparent_78%)] lg:block" />
        <Container className="relative pt-10 pb-[clamp(38px,6vw,80px)]">
          <div className="max-w-[760px]">
            <div className="flex items-center gap-3 font-display text-[clamp(11px,1.1vw,13px)] font-semibold tracking-[.2em] text-fg-2 uppercase">
              <span className="h-0.5 w-7 bg-orange" />
              {BRAND.city}
            </div>
            <h1 className="display mt-[18px] text-[clamp(56px,8vw,128px)] leading-[.86] tracking-[-.015em]">
              Хүч чинь
              <br />
              дотроос эхэлнэ
            </h1>
            <p className="mt-[22px] max-w-[480px] text-[clamp(16.5px,1.6vw,20px)] leading-relaxed text-fg-2">
              Мэргэжлийн дасгалжуулагч, хоолны дэглэм, зөв техник. Онлайн бүртгүүлээд QR кодоороо ороорой.
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-3.5">
              <ButtonLink href="#price" className="flex-1 lg:flex-none">
                Гишүүн болох
              </ButtonLink>
              <ButtonLink href={gallery.length ? "#gallery" : "#why"} variant="secondary">
                {gallery.length ? "Заал үзэх" : "Дэлгэрэнгүй"}
              </ButtonLink>
            </div>
          </div>
        </Container>
        <div className="relative border-t border-line-2 bg-ink-deep/50">
          <Container className="flex flex-wrap gap-x-10 gap-y-2 py-3.5 font-display text-[clamp(12px,1.2vw,14px)] font-medium tracking-[.06em] text-fg-2 uppercase">
            <span>06:00–22:00 · өдөр бүр</span>
            <span>{BRAND.branch}</span>
            <span>QPay · онлайн бүртгэл</span>
          </Container>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-[clamp(56px,8vw,112px)]">
        <Container>
          <SectionLabel index="01" kicker={`Яагаад ${BRAND.short}`}>
            Бидний давуу тал
          </SectionLabel>
          <div className="mt-[clamp(28px,4vw,48px)]">
            {FEATURES.map((f, i) => (
              <div key={f} className={`grid grid-cols-[48px_1fr] items-center gap-[clamp(14px,2vw,28px)] py-[clamp(16px,2.2vw,26px)] lg:grid-cols-[72px_1fr] ${i ? "border-t border-line" : ""}`}>
                <span className="display text-[clamp(20px,2.4vw,30px)] text-surface-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(20px,2.6vw,34px)] leading-[1.05] font-semibold uppercase">{f}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section id="price" className="scroll-mt-16 bg-ink-deep py-[clamp(56px,8vw,112px)]">
        <Container>
          <SectionLabel index="02" kicker="Гишүүнчлэл">
            Багцаа сонго
          </SectionLabel>
          <p className="mt-4 max-w-[560px] text-[clamp(16px,1.5vw,18.5px)] leading-relaxed text-fg-2">
            Хоног тань төлсөн өдрөөс биш, <b className="text-fg">анх QR уншуулж орсон өдрөөс</b> тоологдоно. Шаардлагатай үед хоногоо зогсоож болно.
          </p>
          <PackagePicker
            packages={packages.map((p) => ({
              id: p.id,
              name: p.name,
              subtitle: p.subtitle,
              features: p.features,
              durationDays: p.durationDays,
              priceMnt: p.priceMnt,
              oldPriceMnt: p.oldPriceMnt,
              featured: p.featured,
            }))}
          />
          <p className="mt-6 text-[14px] text-grey">
            + Шүүгээ түрээс: сард {shortMnt(settings.lockerMonthlyPriceMnt)}, багц авахдаа нэмж сонгоно.
          </p>
        </Container>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
      <section id="gallery" className="scroll-mt-16 py-[clamp(56px,8vw,112px)]">
        <Container>
          <SectionLabel index="03" kicker="Заал, тоноглол">
            Ирэхээсээ өмнө үз
          </SectionLabel>
          <div className="mt-[clamp(28px,4vw,48px)] grid grid-cols-2 gap-2.5 lg:auto-rows-[260px] lg:grid-cols-3 lg:gap-4">
            {gallery.map((g, i) => (
              <figure key={g.src} className={`relative overflow-hidden rounded-sm border border-line-2 bg-surface-1 ${i === 0 ? "col-span-2 lg:row-span-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.caption ?? BRAND.name} loading="lazy" className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full" />
                {g.caption && (
                  <figcaption className="display absolute bottom-2.5 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] tracking-[.08em]">{g.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </Container>
      </section>
      )}

      {/* PT */}
      <section id="pt" className="bg-ink-deep py-[clamp(56px,8vw,112px)]">
        <Container className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-2">
          <div>
            <SectionLabel index={gallery.length ? "04" : "03"} kicker="Хувийн дасгалжуулалт">
              Үр дүн
              <br />
              харагдана
            </SectionLabel>
            <p className="mt-5 max-w-[440px] text-[clamp(16.5px,1.6vw,20px)] leading-relaxed text-fg-2">
              Зөв хооллолт, дасгалын зөв техник, хувийн дасгалжуулагчтай. Эхлэлээс тайз хүртэл.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ButtonLink href="#price">Элсэлт авах</ButtonLink>
              <a href={`tel:${PHONE2}`} className="display text-[18px] text-orange">
                {PHONE2}
              </a>
            </div>
          </div>
          <figure className="overflow-hidden rounded-sm border border-line-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/gym-2.jpg" alt="Sparta Fitness заал" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </figure>
        </Container>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-line bg-ink pt-[clamp(44px,6vw,72px)] pb-28 lg:pb-16">
        <Container>
          <div className="flex flex-col justify-between gap-[clamp(28px,4vw,64px)] lg:flex-row">
            <div className="max-w-[360px]">
              <Logo className="h-[38px]" />
              <p className="mt-[18px] leading-relaxed text-fg-2">{BRAND.tagline}. {BRAND.city}, {BRAND.branch}т тань хүлээж байна.</p>
            </div>
            <div className="grid gap-4 lg:min-w-[460px] lg:grid-cols-2">
              {[
                { l: "Утас", v: `${PHONE} · ${PHONE2}`, h: `tel:${PHONE}` },
                { l: "Салбар", v: BRAND.branch },
                { l: "Цагийн хуваарь", v: BRAND.hours },
                ...(BRAND.facebook ? [{ l: "Facebook", v: BRAND.facebook, h: `https://facebook.com/${BRAND.facebook}` }] : []),
              ].map((r) => {
                const inner = (
                  <>
                    <div className="eyebrow">{r.l}</div>
                    <div className="text-[16.5px] font-semibold">{r.v}</div>
                  </>
                );
                return r.h ? (
                  <a key={r.l} href={r.h} target="_blank" rel="noreferrer" className="block border-l-2 border-orange pl-3.5">
                    {inner}
                  </a>
                ) : (
                  <div key={r.l} className="border-l-2 border-orange pl-3.5">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 border-t border-line pt-[18px] text-[13.5px] text-grey">© {new Date().getFullYear()} {BRAND.name}. Бүх эрх хуулиар хамгаалагдсан.</div>
        </Container>
      </footer>

    </div>
  );
}
