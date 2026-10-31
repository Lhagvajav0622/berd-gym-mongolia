import React from 'react';
import { PriceBlock } from './PriceBlock.jsx';
import { FeatureCheck } from './FeatureCheck.jsx';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';

/**
 * BERD GYM — MembershipCard. A pricing tier with the oversized price as the
 * centrepiece. `featured` lifts it with an orange border + glow + badge.
 */
export function MembershipCard({
  title,                 // "1 сар" / "Багштай анги"
  subtitle = null,       // small line under title
  amount,                // "250K"
  oldAmount = null,      // "300K"
  unit = '/ сар',
  features = [],
  featured = false,
  badge = null,          // e.g. "Хамгийн эрэлттэй"
  ctaLabel = 'Гишүүн болох',
  onSelect,
  note = null,           // fine print under CTA
  style = {},
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: featured
          ? 'linear-gradient(180deg, #241a0e 0%, var(--surface-1) 55%)'
          : 'var(--grad-surface)',
        border: featured ? '1.5px solid var(--orange)' : '1px solid var(--surface-line-2)',
        borderRadius: 'var(--radius-lg)',
        padding: '26px 22px 22px',
        boxShadow: featured ? 'var(--glow-md), var(--shadow-card)' : 'var(--shadow-card)',
        ...style,
      }}
    >
      {badge ? (
        <div style={{ position: 'absolute', top: '-14px', left: '22px' }}>
          <Badge variant="solid">{badge}</Badge>
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          fontSize: '26px', color: 'var(--text-primary)',
        }}>{title}</h3>
      </div>
      {subtitle ? (
        <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--grey)' }}>{subtitle}</p>
      ) : null}

      <div style={{ margin: '14px 0 18px' }}>
        <PriceBlock amount={amount} oldAmount={oldAmount} unit={unit} size="lg" />
      </div>

      {features.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '22px' }}>
          {features.map((f, i) => <FeatureCheck key={i}>{f}</FeatureCheck>)}
        </div>
      ) : null}

      <div style={{ marginTop: 'auto' }}>
        <Button
          variant={featured ? 'primary' : 'secondary'}
          fullWidth
          onClick={onSelect}
        >{ctaLabel}</Button>
        {note ? (
          <p style={{ margin: '12px 0 0', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>{note}</p>
        ) : null}
      </div>
    </div>
  );
}
