import React from 'react';

// Deterministic QR-looking matrix (placeholder — not a scannable code).
function buildMatrix(seed, n) {
  const cells = [];
  let s = seed >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const isFinder = (r, c) => {
    const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0);
  };
  const finderOn = (r, c) => {
    const f = (br, bc) => {
      const rr = r - br, cc = c - bc;
      if (rr < 0 || rr > 6 || cc < 0 || cc > 6) return null;
      const ring = rr === 0 || rr === 6 || cc === 0 || cc === 6;
      const core = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
      return ring || core;
    };
    const a = f(0, 0), b = f(0, n - 7), d = f(n - 7, 0);
    return a ?? b ?? d;
  };
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (isFinder(r, c)) cells.push(finderOn(r, c) ? 1 : 0);
    else cells.push(rnd() > 0.5 ? 1 : 0);
  }
  return cells;
}

/**
 * BERD GYM — QRCheckout. QPay QR-display state for the checkout flow.
 * Shows plan + amount, a QR placeholder (pass `qrSrc` for a real code),
 * status and bank-app hint. No payment logic — presentation only.
 */
export function QRCheckout({
  plan = 'Багштай анги',
  amount = '250,000₮',
  status = 'waiting',     // 'waiting' | 'paid'
  expiresLabel = '04:58',
  qrSrc = null,
  onBack = null,
  style = {},
}) {
  const n = 25;
  const matrix = React.useMemo(() => buildMatrix(20250613, n), []);
  const paid = status === 'paid';

  return (
    <div style={{
      maxWidth: '400px', margin: '0 auto',
      background: 'var(--grad-surface)',
      border: '1px solid var(--surface-line-2)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px', textAlign: 'center',
      boxShadow: 'var(--shadow-card)', ...style,
    }}>
      {/* QPay header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em', fontSize: '15px', color: 'var(--text-primary)',
        }}>QPay</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--grey)' }}>QR төлбөр</span>
      </div>
      <p style={{ margin: '0 0 18px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--grey)' }}>
        Банкны аппаар уншуулна уу
      </p>

      {/* QR panel */}
      <div style={{ position: 'relative', display: 'inline-block', padding: '14px', background: '#fff', borderRadius: 'var(--radius-md)' }}>
        {qrSrc ? (
          <img src={qrSrc} alt="QPay QR" style={{ width: '208px', height: '208px', display: 'block' }} />
        ) : (
          <div style={{
            width: '208px', height: '208px',
            display: 'grid',
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`,
          }}>
            {matrix.map((v, i) => (
              <span key={i} style={{ background: v ? '#0E0E0E' : 'transparent' }} />
            ))}
          </div>
        )}
        {/* center mark */}
        <span style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '46px', height: '46px', borderRadius: '11px',
          background: 'var(--grad-orange-flat)', boxShadow: '0 0 0 5px #fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink-on-orange)', fontSize: '20px' }}>B</span>
        </span>

        {paid ? (
          <div style={{
            position: 'absolute', inset: '14px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(14,14,14,0.92)', color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            <span style={{
              width: '54px', height: '54px', borderRadius: '50%', background: 'var(--grad-orange-flat)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-on-orange)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Төлөгдсөн</span>
          </div>
        ) : null}
      </div>

      {/* amount */}
      <div style={{ margin: '18px 0 4px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--grey)' }}>{plan}</span>
      </div>
      <div className="berd-metal-text" style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '40px', lineHeight: 1,
      }}>{amount}</div>

      {/* status row */}
      <div style={{
        marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '9px',
        padding: '8px 14px', borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-2)', border: '1px solid var(--surface-line-2)',
      }}>
        {!paid ? (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', boxShadow: 'var(--glow-sm)', animation: 'berdPulse 1.2s var(--ease-out) infinite' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)' }}>Төлбөр хүлээж байна · {expiresLabel}</span>
          </>
        ) : (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--orange)', fontWeight: 700 }}>Амжилттай төлөгдлөө</span>
        )}
      </div>

      {onBack ? (
        <div style={{ marginTop: '16px' }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.06em', fontSize: '13px', color: 'var(--grey)',
          }}>← Буцах</button>
        </div>
      ) : null}

      <style>{`@keyframes berdPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}
