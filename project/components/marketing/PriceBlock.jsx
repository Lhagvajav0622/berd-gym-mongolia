import React from 'react';

/**
 * BERD GYM — PriceBlock. THE signature element.
 * Oversized molten-orange price set like a poster headline.
 * Optional struck-through old price (discount) and term unit.
 */
export function PriceBlock({
  amount,            // e.g. "250K" or "250,000₮"
  unit = '/ сар',    // term
  oldAmount = null,  // struck old price, e.g. "300K"
  size = 'lg',       // 'mega' | 'lg' | 'md'
  align = 'left',
  style = {},
}) {
  const sizes = {
    mega: 'var(--fs-price-mega)',
    lg: 'var(--fs-price-lg)',
    md: 'clamp(2.75rem, 11vw, 4rem)',
  };
  return (
    <div style={{ textAlign: align, ...style }}>
      {oldAmount ? (
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          textTransform: 'uppercase', lineHeight: 1,
          fontSize: '0.32em', // relative not used; set below
        }}>
          <span style={{
            fontSize: size === 'mega' ? '2.25rem' : '1.75rem',
            color: 'var(--text-muted)',
            textDecoration: 'line-through',
            textDecorationColor: 'var(--danger)',
            textDecorationThickness: '3px',
          }}>{oldAmount}</span>
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.18em', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        <span
          className="berd-metal-text"
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            textTransform: 'uppercase', lineHeight: 'var(--lh-price)',
            letterSpacing: '-0.02em',
            fontSize: sizes[size],
            filter: 'drop-shadow(0 6px 18px rgba(247,148,29,0.35))',
          }}
        >{amount}</span>
        {unit ? (
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            color: 'var(--grey)', fontSize: '0.9rem',
            paddingBottom: '0.7em', whiteSpace: 'nowrap',
          }}>{unit}</span>
        ) : null}
      </div>
    </div>
  );
}
