import React from 'react';

/**
 * BERD GYM — PromoBanner. Top campaign strip for seasonal discounts
 * (Наадам / Шинэ жил / Зун). Tone "orange" = solid molten bar,
 * "dark" = near-black bar with orange accents. Dismissable.
 */
export function PromoBanner({
  label = 'Наадам',     // campaign tag
  message,              // main line, e.g. "Бүх багцад 20% хямдрал"
  cta = null,           // optional link text
  href = '#',
  onCta,
  tone = 'orange',
  onClose = null,
  style = {},
}) {
  const isOrange = tone === 'orange';
  return (
    <div
      role="region"
      aria-label="Урамшуулал"
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px',
        background: isOrange ? 'var(--grad-orange-flat)' : 'var(--surface-1)',
        borderBottom: isOrange ? 'none' : '1px solid var(--surface-line-2)',
        boxShadow: isOrange ? 'var(--glow-sm)' : 'none',
        ...style,
      }}
    >
      <span style={{
        flex: '0 0 auto',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px',
        padding: '4px 9px', borderRadius: 'var(--radius-pill)',
        background: isOrange ? 'rgba(20,10,0,0.85)' : 'var(--grad-orange-flat)',
        color: isOrange ? 'var(--orange-bright)' : 'var(--ink-on-orange)',
      }}>{label}</span>

      <span style={{
        flex: 1, minWidth: 0,
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px',
        lineHeight: 1.25,
        color: isOrange ? 'var(--ink-on-orange)' : 'var(--text-primary)',
      }}>
        {message}
        {cta ? (
          <a
            href={href}
            onClick={onCta}
            style={{
              marginLeft: '10px', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '13px',
              color: isOrange ? 'var(--ink-on-orange)' : 'var(--orange)',
              textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >{cta} →</a>
        ) : null}
      </span>

      {onClose ? (
        <button
          aria-label="Хаах"
          onClick={onClose}
          style={{
            flex: '0 0 auto', width: '28px', height: '28px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: isOrange ? 'var(--ink-on-orange)' : 'var(--grey)',
            fontSize: '18px', lineHeight: 1, opacity: 0.8,
          }}
        >✕</button>
      ) : null}
    </div>
  );
}
