import React from 'react';

/**
 * BERD GYM — FeatureCheck. The poster-style orange check-mark + benefit line.
 * variant "box" = rounded orange square (like the membership posters),
 * variant "circle" = filled orange disc.
 */
export function FeatureCheck({
  children,
  variant = 'box',
  style = {},
}) {
  const mark = (
    <span
      aria-hidden="true"
      style={{
        flex: '0 0 auto',
        width: '26px', height: '26px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--grad-orange-flat)',
        color: 'var(--ink-on-orange)',
        borderRadius: variant === 'circle' ? '50%' : '7px',
        boxShadow: 'var(--glow-sm)',
        marginTop: '2px',
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3.4"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px', ...style }}>
      {mark}
      <span style={{
        fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 600,
        lineHeight: 1.4, color: 'var(--text-primary)',
      }}>{children}</span>
    </div>
  );
}
