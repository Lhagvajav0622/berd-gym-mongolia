import { asc } from "drizzle-orm";
import Link from "next/link";
import { durationLabel } from "@/components/format";
import { ButtonLink, Container, Logo, shortMnt } from "@/components/ui";
import { db, schema } from "@/server/db";
import { listPackages } from "@/server/gym";
import { getCurrentUser } from "@/server/session";
import { getSettings } from "@/server/settings";
import { BRAND } from "@/brand";
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
  const cheapestMonthly = packages.length
    ? Math.min(...packages.map((p) => Math.round(p.priceMnt / Math.max(1, Math.round(p.durationDays / 30)))))
    : 0;
  const gallery = photos.length
    ? photos.map((p) => ({ src: `/api/gallery/${p.id}`, caption: p.caption }))
    : [];

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
        <div className="absolute inset-0 bg-[url('/img/athlete-torso.jpg')] bg-cover bg-[center_14%]" />
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
              <ButtonLink href={gallery.length ? "#gallery" : "#pt"} variant="secondary">
                {gallery.length ? "Заал үзэх" : "Дасгалжуулагч"}
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
          <div className="mt-[clamp(34px,5vw,56px)] flex flex-col gap-[clamp(12px,1.6vw,18px)]">
            {packages.map((p) => (
              <Link
                key={p.id}
                href={`/join/${p.id}`}
                className={`group grid grid-cols-[1fr_auto] items-center gap-x-[clamp(16px,3vw,48px)] gap-y-3 rounded-lg border px-[clamp(18px,2.4vw,34px)] py-[clamp(22px,3vw,36px)] transition hover:bg-surface-2 lg:grid-cols-[1fr_auto_auto] ${p.featured ? "border-orange bg-orange/[.06]" : "border-line-2 bg-surface-1"}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="display text-[clamp(24px,3vw,40px)] leading-none">{p.name}</span>
                    {p.featured && <span className="display bg-orange px-2 py-1 text-[11px] tracking-[.12em] text-on-orange">Санал болгох</span>}
                  </div>
                  <div className="mt-2.5 text-[clamp(13.5px,1.4vw,16px)] leading-normal text-fg-2">
                    {[p.subtitle, ...p.features].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  {p.oldPriceMnt ? <div className="display text-[clamp(13px,1.3vw,16px)] leading-none font-semibold text-muted line-through">{shortMnt(p.oldPriceMnt)}</div> : null}
                  <div className="mt-1 flex items-baseline justify-end gap-1.5">
                    <span className={`display text-[clamp(40px,5.5vw,68px)] leading-[.9] ${p.featured ? "text-orange" : ""}`}>{shortMnt(p.priceMnt)}</span>
                    <span className="text-[clamp(12px,1.2vw,14px)] text-muted">/ {durationLabel(p.durationDays)}</span>
                  </div>
                </div>
                <span className="hidden size-[52px] items-center justify-center justify-self-end rounded-full border border-line-2 text-[22px] transition group-hover:translate-x-1 group-hover:border-orange group-hover:bg-orange group-hover:text-on-orange lg:inline-flex">
                  →
                </span>
              </Link>
            ))}
          </div>
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
            <img src="/img/statue-torso.jpg" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover object-[center_30%]" />
          </figure>
        </Container>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-line bg-ink pt-[clamp(44px,6vw,72px)] pb-32 lg:pb-16">
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

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 items-center gap-3 bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,var(--color-ink)_32%)] px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
        {cheapestMonthly > 0 && (
          <div className="shrink-0">
            <div className="text-[12.5px] text-fg-2">Багцууд</div>
            <div className="display metal-text text-[23px] leading-none">{shortMnt(cheapestMonthly)}-аас</div>
          </div>
        )}
        <ButtonLink href={user ? "/me" : "#price"} full>
          {user ? "Миний QR" : "Гишүүн болох"}
        </ButtonLink>
      </div>
    </div>
  );
}
