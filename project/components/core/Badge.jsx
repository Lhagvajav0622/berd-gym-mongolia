import React from 'react';

/**
 * BERD GYM — Badge / pill tag.
 * Solid orange = "most popular" / promo flag; outline & ghost for meta.
 */
export function Badge({
  children,
  variant = 'solid',
  size = 'md',
  icon = null,
  style = {},
  ...rest
}) {
  const sizes = {
    md: { fontSize: '13px', padding: '7px 14px', height: '30px' },
    sm: { fontSize: '11px', padding: '5px 10px', height: '24px' },
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    whiteSpace: 'nowrap',
    ...sizes[size],
  };
  const variants = {
    solid: {
      background: 'var(--grad-orange-flat)',
      color: 'var(--ink-on-orange)',
      boxShadow: 'var(--glow-sm)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--orange)',
      boxShadow: 'inset 0 0 0 1.5px var(--orange)',
    },
    dark: {
      background: 'var(--surface-2)',
      color: 'var(--text-secondary)',
      boxShadow: 'inset 0 0 0 1px var(--surface-line-2)',
    },
  };
  return (
    <span style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {icon ? <span style={{ display: 'inline-flex', fontSize: '1.05em' }}>{icon}</span> : null}
      {children}
    </span>
  );
}
