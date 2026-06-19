import React from 'react';

/**
 * BERD GYM — Input. Dark surface field for the checkout / signup flow.
 * Orange focus ring. Pass label + optional prefix (e.g. phone code).
 */
export function Input({
  label,
  hint,
  prefix = null,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  onChange,
  invalid = false,
  style = {},
  id,
  ...rest
}) {
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <label htmlFor={inputId} style={{ display: 'block', ...style }}>
      {label ? (
        <span style={{
          display: 'block', marginBottom: '8px',
          fontFamily: 'var(--font-display)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          fontSize: '13px', color: 'var(--text-secondary)',
        }}>{label}</span>
      ) : null}
      <span
        className="berd-input"
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          height: 'var(--control-h)', padding: '0 16px',
          background: 'var(--surface-input)',
          borderRadius: 'var(--radius-md)',
          boxShadow: invalid
            ? 'inset 0 0 0 1.5px var(--danger)'
            : 'inset 0 0 0 1px var(--surface-line-2)',
          transition: 'box-shadow var(--dur) var(--ease-out)',
        }}
      >
        {prefix ? <span style={{ color: 'var(--grey)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{prefix}</span> : null}
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          style={{
            flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none',
            background: 'transparent', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 500,
          }}
          {...rest}
        />
      </span>
      {hint ? (
        <span style={{ display: 'block', marginTop: '7px', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: invalid ? 'var(--danger)' : 'var(--text-muted)' }}>{hint}</span>
      ) : null}
      <style>{`.berd-input:focus-within { box-shadow: inset 0 0 0 1.5px var(--orange), var(--glow-sm) !important; }`}</style>
    </label>
  );
}
