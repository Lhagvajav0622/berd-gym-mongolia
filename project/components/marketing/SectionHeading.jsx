import React from 'react';

/**
 * BERD GYM — SectionHeading. Orange eyebrow + heavy condensed display title,
 * with an optional orange accent word and slanted "poster italic".
 */
export function SectionHeading({
  eyebrow = null,
  children,            // title; wrap accent in <span data-accent>
  accent = null,       // alternative: orange accent appended after title
  slant = false,
  align = 'left',
  size = 'display-2',  // 'display-1' | 'display-2' | 'display-3'
  style = {},
}) {
  const sizeVar = {
    'display-1': 'var(--fs-display-1)',
    'display-2': 'var(--fs-display-2)',
    'display-3': 'var(--fs-display-3)',
  }[size];
  return (
    <div style={{ textAlign: align, ...style }}>
      {eyebrow ? (
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.18em',
          color: 'var(--orange)', fontSize: '13px', marginBottom: '12px',
        }}>{eyebrow}</div>
      ) : null}
      <h2 style={{
        margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700,
        textTransform: 'uppercase', lineHeight: 'var(--lh-display)',
        letterSpacing: 'var(--ls-display)', fontSize: sizeVar,
        color: 'var(--text-primary)',
        transform: slant ? 'var(--skew-italic)' : 'none',
        transformOrigin: align === 'center' ? 'center' : 'left',
      }}>
        {children}
        {accent ? <span style={{ color: 'var(--orange)' }}> {accent}</span> : null}
      </h2>
    </div>
  );
}
