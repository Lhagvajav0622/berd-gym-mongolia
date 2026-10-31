const { useState, useEffect } = React;
const DS = window.BERDGYMDesignSystem_75db46;
const { Button, Badge, PriceBlock, FeatureCheck, MembershipCard, PromoBanner, SectionHeading, Input, QRCheckout } = DS;

const PHONE = '86661231';
const PHONE2 = '88069560';

/* ——— responsive helpers ——— */
function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = (e) => setMatch(e.matches);
    setMatch(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return match;
}
const DESKTOP = '(min-width: 980px)';

const MAXW = 1200;
function Container({ children, style }) {
  return (
    <div style={{ width: '100%', maxWidth: MAXW, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}
const SECTION_PAD = 'clamp(56px, 8vw, 112px)';

const PLANS = [
  {
    id: 'month1', title: '1 сар', subtitle: 'Чөлөөт бүртгэл',
    amount: '300K', amountFull: '300,000₮', unit: '/ сар',
    features: ['Бүх тренажер, төхөөрөмж', '06:00–22:00 нээлттэй', 'Хувцас солих өрөө, шүршүүр'],
  },
  {
    id: 'coach', title: 'Багштай анги', subtitle: 'Мэргэжлийн дасгалжуулагчтай',
    amount: '250K', oldAmount: '300K', amountFull: '250,000₮', unit: '/ сар',
    featured: true, badge: 'Хамгийн эрэлттэй',
    features: ['7 хоногт 4–5 удаа бэлтгэл', 'Хоолны дэглэм • Cardio • Fitness', 'Хувийн төлөвлөгөө', 'Турах • Жин нэмэх • Булчин'],
  },
  {
    id: 'season', title: '3 сарын багц', subtitle: 'Урт хугацааны хямдрал',
    amount: '160K', oldAmount: '200K', amountFull: '160,000₮', unit: '/ сар',
    features: ['3 сар тасралтгүй', 'Бүх тренажер, цаг', 'Найзтайгаа: 2 хүн хамт хямдрал'],
  },
];

const FEATURES = [
  'Мэргэжлийн багш дасгалжуулагч',
  'Хоолны зөвлөгөө, дэглэм',
  'Дасгалын зөв техник заавар',
  'Cardio • Fitness • Хүчний бэлтгэл',
  '06:00–22:00, өдөр бүр нээлттэй',
  'Турах • Жин нэмэх • Булчин нэмэх',
];

const NAV = [
  { label: 'Давуу тал', href: '#why' },
  { label: 'Багц', href: '#price' },
  { label: 'Хувийн дасгал', href: '#pt' },
  { label: 'Холбоо барих', href: '#contact' },
];

const FB = (p) => (
  <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
  </svg>
);
const Phone = (p) => (
  <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const Pin = (p) => (
  <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const Clock = (p) => (
  <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
  </svg>
);

/* —— Header —— */
function Header({ onJoin }) {
  const isDesktop = useMedia(DESKTOP);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(14,14,14,0.82)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--surface-line)',
    }}>
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: isDesktop ? '14px clamp(20px, 5vw, 48px)' : '12px 18px' }}>
        <img src="../../assets/logo-berdgym-dark.png" alt="BERD GYM MONGOLIA" style={{ height: isDesktop ? 36 : 32, flex: '0 0 auto' }} />

        {isDesktop ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 30, marginLeft: 'auto', marginRight: 8 }}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '.05em', fontSize: 15.5, color: 'var(--text-secondary)',
              }}>{n.label}</a>
            ))}
          </nav>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '0 0 auto' }}>
          <a href={'tel:' + PHONE} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--orange)' }}>
            <Phone s={16} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '.02em' }}>{PHONE}</span>
          </a>
          {isDesktop ? <Button onClick={onJoin}>Гишүүн болох</Button> : null}
        </div>
      </Container>
    </header>
  );
}

/* —— Hero —— */
function Hero({ onJoin }) {
  const isDesktop = useMedia(DESKTOP);
  return (
    <section style={{ position: 'relative', minHeight: 'clamp(640px, 92vh, 900px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: "url('../../assets/imagery/athlete-torso.jpg') center 14%/cover" }} />
      <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero-scrim)' }} />
      {isDesktop ? <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,8,8,.94) 0%, rgba(8,8,8,.5) 46%, transparent 78%)' }} /> : null}

      <Container style={{ position: 'relative', paddingTop: 40, paddingBottom: 'clamp(38px, 6vw, 80px)' }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.2em', color: 'var(--text-secondary)', fontSize: 'clamp(11px, 1.1vw, 13px)' }}>
            <span style={{ width: 28, height: 2, background: 'var(--orange)' }} />
            Улаанбаатар · 2003 оноос
          </div>
          <h1 style={{ margin: '18px 0 0', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', lineHeight: .86, letterSpacing: '-.015em', fontSize: 'clamp(56px, 8vw, 128px)', color: '#fff' }}>
            Хүч чинь<br />дотроос эхэлнэ
          </h1>
          <p style={{ margin: '22px 0 0', maxWidth: 480, fontFamily: 'var(--font-body)', fontSize: 'clamp(16.5px, 1.6vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Мэргэжлийн дасгалжуулагч, хоолны дэглэм, зөв техник. Эхний 30 хүнд хямдрал хүчинтэй.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 30, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: isDesktop ? '0 0 auto' : 1 }}>
              <Button onClick={onJoin} fullWidth={!isDesktop}>Гишүүн болох</Button>
            </div>
            <Button variant="secondary" as="a" href="#price">Үнэ үзэх</Button>
          </div>
        </div>
      </Container>

      {/* quiet hairline detail strip — replaces the stat-box row */}
      <div style={{ position: 'relative', borderTop: '1px solid var(--surface-line-2)', background: 'rgba(8,8,8,.5)' }}>
        <Container style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(16px, 4vw, 40px)', padding: '14px clamp(20px, 5vw, 48px)' }}>
          <DetailItem>06:00–22:00 · өдөр бүр</DetailItem>
          <DetailItem>3, 4 хороолол · 2 салбар</DetailItem>
          <DetailItem>QPay · онлайн бүртгэл</DetailItem>
        </Container>
      </div>
    </section>
  );
}
function DetailItem({ children }) {
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: 'clamp(12px, 1.2vw, 14px)', color: 'var(--text-secondary)' }}>{children}</span>
  );
}

/* —— Editorial section label: oversized index + title + hairline —— */
function SectionLabel({ index, kicker, children }) {
  return (
    <div style={{ borderTop: '1px solid var(--surface-line-2)', paddingTop: 18, display: 'flex', alignItems: 'baseline', gap: 'clamp(16px, 3vw, 36px)', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(15px, 1.4vw, 18px)', color: 'var(--orange)', letterSpacing: '.04em' }}>{index}</span>
      <div>
        {kicker ? <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.16em', fontSize: 'clamp(11px, 1.1vw, 13px)', color: 'var(--text-muted)', marginBottom: 8 }}>{kicker}</div> : null}
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', lineHeight: .92, letterSpacing: '-.01em', fontSize: 'clamp(34px, 5vw, 64px)', color: '#fff' }}>{children}</h2>
      </div>
    </div>
  );
}

/* —— Features (editorial numbered list) —— */
function Features() {
  const isDesktop = useMedia(DESKTOP);
  return (
    <section id="why" style={{ padding: SECTION_PAD + ' 0' }}>
      <Container>
        <SectionLabel index="01" kicker="Яагаад БЭРД">Бидний давуу тал</SectionLabel>
        <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '72px 1fr' : '48px 1fr',
              alignItems: 'center', gap: 'clamp(14px, 2vw, 28px)',
              padding: 'clamp(16px, 2.2vw, 26px) 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--surface-line)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(20px, 2.4vw, 30px)', color: 'var(--surface-3)', letterSpacing: '.02em' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.01em', lineHeight: 1.05, fontSize: 'clamp(20px, 2.6vw, 34px)', color: '#fff' }}>{f}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* —— Pricing (price board / list) —— */
function Pricing({ onSelect }) {
  const isDesktop = useMedia(DESKTOP);
  return (
    <section id="price" style={{ padding: SECTION_PAD + ' 0', background: 'var(--berd-black-deep)' }}>
      <Container>
        <SectionLabel index="02" kicker="Гишүүнчлэл">Багцаа сонго</SectionLabel>
        <p style={{ margin: '16px 0 0', fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.5vw, 18.5px)', color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.55 }}>
          Онлайн бүртгүүлээд ирсэн өдрөөсөө эхлүүлэх боломжтой.
        </p>
        <div style={{ marginTop: 'clamp(34px, 5vw, 56px)', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.6vw, 18px)' }}>
          {PLANS.map((p) => <PriceRow key={p.id} plan={p} isDesktop={isDesktop} onSelect={() => onSelect(p)} />)}
        </div>
      </Container>
    </section>
  );
}
function PriceRow({ plan, isDesktop, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr auto auto' : '1fr auto',
        alignItems: 'center', columnGap: 'clamp(16px, 3vw, 48px)', rowGap: 12,
        padding: 'clamp(22px, 3vw, 36px) clamp(18px, 2.4vw, 34px)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid ' + (plan.featured ? 'var(--orange)' : 'var(--surface-line-2)'),
        background: hover ? 'var(--surface-2)' : (plan.featured ? 'rgba(247,148,29,0.06)' : 'var(--surface-1)'),
        transition: 'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
      }}>
      {/* left: name + what's included */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-.005em', fontSize: 'clamp(24px, 3vw, 40px)', color: '#fff', lineHeight: 1 }}>{plan.title}</span>
          {plan.featured ? (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 11, color: 'var(--ink-on-orange)', background: 'var(--orange)', padding: '4px 9px' }}>Санал болгох</span>
          ) : null}
        </div>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-body)', fontSize: 'clamp(13.5px, 1.4vw, 16px)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {plan.features.join(' · ')}
        </div>
      </div>

      {/* price */}
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        {plan.oldAmount ? (
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(13px, 1.3vw, 16px)', color: 'var(--text-muted)', textDecoration: 'line-through', lineHeight: 1 }}>{plan.oldAmount}</div>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 6, marginTop: plan.oldAmount ? 4 : 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(40px, 5.5vw, 68px)', color: plan.featured ? 'var(--orange)' : '#fff', lineHeight: .9, letterSpacing: '-.01em' }}>{plan.amount}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(12px, 1.2vw, 14px)', color: 'var(--text-muted)' }}>{plan.unit}</span>
        </div>
      </div>

      {/* arrow (desktop) */}
      {isDesktop ? (
        <span aria-hidden="true" style={{
          justifySelf: 'end', width: 52, height: 52, borderRadius: 'var(--radius-pill)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid ' + (hover ? 'var(--orange)' : 'var(--surface-line-2)'),
          background: hover ? 'var(--orange)' : 'transparent',
          color: hover ? 'var(--ink-on-orange)' : '#fff', fontSize: 22,
          transition: 'all var(--dur) var(--ease-out)',
          transform: hover ? 'translateX(4px)' : 'none',
        }}>→</span>
      ) : null}
    </div>
  );
}

/* —— Personal training —— */
function PTHighlight({ onSelect }) {
  const isDesktop = useMedia(DESKTOP);
  return (
    <section id="pt" style={{ padding: SECTION_PAD + ' 0', position: 'relative' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center' }}>
          <div>
            <SectionLabel index="03" kicker="Хувийн дасгалжуулалт">Үр дүн<br />харагдана</SectionLabel>
            <p style={{ margin: '20px 0 0', fontFamily: 'var(--font-body)', fontSize: 'clamp(16.5px, 1.6vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 440 }}>
              Зөв хооллолт, дасгалын зөв техник, хувийн дасгалжуулагчтай. Эхлэлээс тайз хүртэл.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              <Button onClick={() => onSelect(PLANS[1])}>Элсэлт авах</Button>
              <a href={'tel:' + PHONE2} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--orange)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                <Phone s={17} />{PHONE2}
              </a>
            </div>
          </div>
          <figure style={{ margin: 0, overflow: 'hidden', border: '1px solid var(--surface-line-2)', position: 'relative' }}>
            <img src="../../assets/imagery/transform-strip.jpg" alt="Гишүүдийн үр дүн" style={{ width: '100%', display: 'block' }} />
            <figcaption style={{ position: 'absolute', left: 12, bottom: 10, display: 'flex', gap: 8 }}>
              <Badge size="sm" variant="solid">Эхлэл</Badge>
              <Badge size="sm" variant="dark">→ 3 сар</Badge>
              <Badge size="sm" variant="outline">Тэмцээн</Badge>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

/* —— Footer —— */
function Footer() {
  const isDesktop = useMedia(DESKTOP);
  return (
    <footer id="contact" style={{ padding: `clamp(44px, 6vw, 72px) 0 ${isDesktop ? '64px' : '120px'}`, borderTop: '1px solid var(--surface-line)', background: 'var(--berd-black-deep)' }}>
      <Container>
        <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: 'clamp(28px, 4vw, 64px)', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: 360 }}>
            <img src="../../assets/logo-berdgym-dark.png" alt="BERD GYM MONGOLIA" style={{ height: 38 }} />
            <p style={{ margin: '18px 0 0', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Хүч чинь дотроос эхэлнэ. Улаанбаатар хотын 3, 4 хорооллын салбарт тань хүлээж байна.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 16, flex: isDesktop ? '0 0 auto' : '1', minWidth: isDesktop ? 460 : 'auto' }}>
            <FootRow icon={<Phone s={18} />} label="Утас" value={PHONE + ' · ' + PHONE2} href={'tel:' + PHONE} />
            <FootRow icon={<Pin s={18} />} label="Салбар" value="3, 4 хороолол салбар" />
            <FootRow icon={<Clock s={18} />} label="Цагийн хуваарь" value="06:00–22:00, өдөр бүр" />
            <FootRow icon={<FB s={18} />} label="Facebook" value="BerdGymMongolia" href="https://facebook.com/BerdGymMongolia" />
          </div>
        </div>
        <div style={{ marginTop: 32, paddingTop: 18, borderTop: '1px solid var(--surface-line)', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--grey)' }}>
          © 2026 BERD GYM MONGOLIA. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </Container>
    </footer>
  );
}
function FootRow({ icon, label, value, href }) {
  const inner = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ flex: '0 0 auto', width: 44, height: 44, background: 'var(--surface-1)', border: '1px solid var(--surface-line-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)' }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16.5, color: '#fff' }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : inner;
}

/* —— Sticky bottom CTA (mobile only) —— */
function StickyCTA({ onJoin }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, zIndex: 40,
      padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
      background: 'linear-gradient(180deg, rgba(14,14,14,0) 0%, var(--berd-black) 32%)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--text-secondary)' }}>Багцууд</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 23, lineHeight: 1 }} className="berd-metal-text">160K-аас</div>
      </div>
      <Button fullWidth onClick={onJoin}>Гишүүн болох</Button>
    </div>
  );
}

/* —— Checkout sheet —— */
function Checkout({ plan, onClose }) {
  const isDesktop = useMedia(DESKTOP);
  const [step, setStep] = useState('details'); // details | qr
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const panelStyle = isDesktop
    ? {
        position: 'relative', width: '100%', maxWidth: 460,
        maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--berd-black)', borderRadius: 24,
        border: '1px solid var(--surface-line-2)',
        padding: '14px 24px 28px', boxShadow: '0 40px 120px rgba(0,0,0,.7)',
        animation: 'sheetPop .3s var(--ease-out)',
      }
    : {
        position: 'relative', width: '100%', maxWidth: 480,
        maxHeight: '94vh', overflowY: 'auto',
        background: 'var(--berd-black)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        border: '1px solid var(--surface-line-2)', borderBottom: 'none',
        padding: '14px 20px 28px', animation: 'sheetUp .32s var(--ease-out)',
      };

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: isDesktop ? 'center' : 'flex-end', padding: isDesktop ? 20 : 0, boxSizing: 'border-box' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(2px)' }} />
      <div style={panelStyle}>
        {!isDesktop ? <div style={{ width: 44, height: 5, borderRadius: 999, background: 'var(--surface-3)', margin: '0 auto 14px' }} /> : null}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, marginTop: isDesktop ? 6 : 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 20, color: '#fff' }}>
            {step === 'details' ? 'Бүртгэл' : 'QPay төлбөр'}
          </span>
          <button onClick={onClose} aria-label="Хаах" style={{ width: 34, height: 34, borderRadius: 999, border: '1px solid var(--surface-line-2)', background: 'var(--surface-1)', color: 'var(--grey)', fontSize: 17, cursor: 'pointer' }}>✕</button>
        </div>

        {step === 'details' ? (
          <div>
            {/* plan summary */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-1)', border: '1px solid var(--surface-line-2)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', fontSize: 18, color: '#fff' }}>{plan.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--grey)' }}>{plan.subtitle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="berd-metal-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, lineHeight: 1 }}>{plan.amount}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>{plan.unit}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
              <Input label="Нэр" placeholder="Таны нэр" />
              <Input label="Утас" type="tel" prefix="+976" placeholder="8800 0000" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--surface-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--grey)' }}>Нийт төлбөр</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: '#fff' }}>{plan.amountFull}</span>
            </div>

            <div style={{ marginTop: 18 }}>
              <Button fullWidth icon="●" onClick={() => setStep('qr')}>QPay-ээр төлөх</Button>
            </div>
            <p style={{ margin: '12px 0 0', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>
              Төлбөр төлснөөр гишүүнчлэл идэвхжинэ.
            </p>
          </div>
        ) : (
          <div>
            <QRCheckout
              plan={plan.title}
              amount={plan.amountFull}
              status={paid ? 'paid' : 'waiting'}
              expiresLabel="04:58"
              onBack={() => setStep('details')}
            />
            <div style={{ marginTop: 16 }}>
              {!paid ? (
                <Button variant="secondary" fullWidth onClick={() => setPaid(true)}>Төлбөр шалгах</Button>
              ) : (
                <Button fullWidth onClick={onClose}>Дуусгах</Button>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetPop { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

/* —— App —— */
function App() {
  const isDesktop = useMedia(DESKTOP);
  const [promo, setPromo] = useState(true);
  const [checkout, setCheckout] = useState(null);
  const openFeatured = () => setCheckout(PLANS[1]);

  return (
    <div>
      {promo ? (
        <PromoBanner
          label="Наадам"
          message="Бүх багцад 20% хямдрал — 7 хоног"
          cta="Авах"
          onCta={(e) => { e.preventDefault(); openFeatured(); }}
          onClose={() => setPromo(false)}
        />
      ) : null}
      <Header onJoin={openFeatured} />
      <Hero onJoin={openFeatured} />
      <Features />
      <Pricing onSelect={setCheckout} />
      <PTHighlight onSelect={setCheckout} />
      <Footer />
      {!isDesktop ? <StickyCTA onJoin={openFeatured} /> : null}
      {checkout ? <Checkout plan={checkout} onClose={() => setCheckout(null)} /> : null}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
