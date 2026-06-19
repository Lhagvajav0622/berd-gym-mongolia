import React from 'react';

/**
 * BERD GYM — Button
 * Primary = molten-orange CTA with heat glow ("Гишүүн болох").
 * Heavy condensed uppercase label. Mobile-first 56px tap height by default.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  icon = null,
  iconRight = null,
  as = 'button',
  href,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const heights = { lg: 'var(--control-h)', md: 'var(--control-h-sm)', sm: '38px' };
  const padX = { lg: '28px', md: '22px', sm: '16px' };
  const fontSize = { lg: '18px', md: '16px', sm: '14px' };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    height: heights[size],
    padding: `0 ${padX[size]}`,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontSize: fontSize[size],
    borderRadius: 'var(--radius-pill)',
    border: '0',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur) var(--ease-out), background var(--dur) var(--ease-out)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const variants = {
    primary: {
      background: 'var(--grad-orange-metal)',
      color: 'var(--ink-on-orange)',
      boxShadow: 'var(--glow-cta), var(--inset-glint)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--orange)',
      boxShadow: 'inset 0 0 0 2px var(--orange)',
    },
    dark: {
      background: 'var(--surface-2)',
      color: 'var(--text-primary)',
      boxShadow: 'inset 0 0 0 1px var(--surface-line-2)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      boxShadow: 'none',
    },
  };

  const cls = 'berd-btn berd-btn--' + variant;
  const Tag = as === 'a' ? 'a' : 'button';
  const extra = Tag === 'a' ? { href } : { disabled, type: rest.type || 'button' };

  return (
    <Tag
      className={cls}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
      {...extra}
      {...rest}
    >
      {icon ? <span className="berd-btn__i" style={{ display: 'inline-flex', fontSize: '1.15em' }}>{icon}</span> : null}
      <span>{children}</span>
      {iconRight ? <span className="berd-btn__i" style={{ display: 'inline-flex', fontSize: '1.15em' }}>{iconRight}</span> : null}
      <style>{`
        .berd-btn:not([disabled]):hover { transform: translateY(-1px); }
        .berd-btn--primary:not([disabled]):hover { box-shadow: var(--glow-md), var(--inset-glint); }
        .berd-btn--secondary:not([disabled]):hover { background: rgba(247,148,29,0.10); }
        .berd-btn--dark:not([disabled]):hover { background: var(--surface-3); }
        .berd-btn--ghost:not([disabled]):hover { color: var(--orange); }
        .berd-btn:not([disabled]):active { transform: translateY(0) scale(0.975); }
      `}</style>
    </Tag>
  );
}
