/* @ds-bundle: {"format":3,"namespace":"BERDGYMDesignSystem_75db46","components":[{"name":"QRCheckout","sourcePath":"components/checkout/QRCheckout.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"FeatureCheck","sourcePath":"components/marketing/FeatureCheck.jsx"},{"name":"MembershipCard","sourcePath":"components/marketing/MembershipCard.jsx"},{"name":"PriceBlock","sourcePath":"components/marketing/PriceBlock.jsx"},{"name":"PromoBanner","sourcePath":"components/marketing/PromoBanner.jsx"},{"name":"SectionHeading","sourcePath":"components/marketing/SectionHeading.jsx"}],"sourceHashes":{"components/checkout/QRCheckout.jsx":"9fd79d416559","components/core/Badge.jsx":"20382c084593","components/core/Button.jsx":"c7b2ffb6bf3e","components/core/Input.jsx":"58ff00445691","components/marketing/FeatureCheck.jsx":"d8d818dcaf28","components/marketing/MembershipCard.jsx":"c470ab2af9aa","components/marketing/PriceBlock.jsx":"89bba078ff28","components/marketing/PromoBanner.jsx":"547384887cec","components/marketing/SectionHeading.jsx":"1bb4944905f4","ui_kits/landing/app.jsx":"cee29309481b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BERDGYMDesignSystem_75db46 = window.BERDGYMDesignSystem_75db46 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/checkout/QRCheckout.jsx
try { (() => {
// Deterministic QR-looking matrix (placeholder — not a scannable code).
function buildMatrix(seed, n) {
  const cells = [];
  let s = seed >>> 0;
  const rnd = () => {
    s = s * 1664525 + 1013904223 >>> 0;
    return s / 4294967296;
  };
  const isFinder = (r, c) => {
    const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0);
  };
  const finderOn = (r, c) => {
    const f = (br, bc) => {
      const rr = r - br,
        cc = c - bc;
      if (rr < 0 || rr > 6 || cc < 0 || cc > 6) return null;
      const ring = rr === 0 || rr === 6 || cc === 0 || cc === 6;
      const core = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
      return ring || core;
    };
    const a = f(0, 0),
      b = f(0, n - 7),
      d = f(n - 7, 0);
    return a ?? b ?? d;
  };
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (isFinder(r, c)) cells.push(finderOn(r, c) ? 1 : 0);else cells.push(rnd() > 0.5 ? 1 : 0);
  }
  return cells;
}

/**
 * BERD GYM — QRCheckout. QPay QR-display state for the checkout flow.
 * Shows plan + amount, a QR placeholder (pass `qrSrc` for a real code),
 * status and bank-app hint. No payment logic — presentation only.
 */
function QRCheckout({
  plan = 'Багштай анги',
  amount = '250,000₮',
  status = 'waiting',
  // 'waiting' | 'paid'
  expiresLabel = '04:58',
  qrSrc = null,
  onBack = null,
  style = {}
}) {
  const n = 25;
  const matrix = React.useMemo(() => buildMatrix(20250613, n), []);
  const paid = status === 'paid';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '400px',
      margin: '0 auto',
      background: 'var(--grad-surface)',
      border: '1px solid var(--surface-line-2)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontSize: '15px',
      color: 'var(--text-primary)'
    }
  }, "QPay"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      color: 'var(--grey)'
    }
  }, "QR \u0442\u04E9\u043B\u0431\u04E9\u0440")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--grey)'
    }
  }, "\u0411\u0430\u043D\u043A\u043D\u044B \u0430\u043F\u043F\u0430\u0430\u0440 \u0443\u043D\u0448\u0443\u0443\u043B\u043D\u0430 \u0443\u0443"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      padding: '14px',
      background: '#fff',
      borderRadius: 'var(--radius-md)'
    }
  }, qrSrc ? /*#__PURE__*/React.createElement("img", {
    src: qrSrc,
    alt: "QPay QR",
    style: {
      width: '208px',
      height: '208px',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '208px',
      height: '208px',
      display: 'grid',
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      gridTemplateRows: `repeat(${n}, 1fr)`
    }
  }, matrix.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      background: v ? '#0E0E0E' : 'transparent'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '46px',
      height: '46px',
      borderRadius: '11px',
      background: 'var(--grad-orange-flat)',
      boxShadow: '0 0 0 5px #fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--ink-on-orange)',
      fontSize: '20px'
    }
  }, "B")), paid ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '14px',
      borderRadius: 'var(--radius-sm)',
      background: 'rgba(14,14,14,0.92)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '54px',
      height: '54px',
      borderRadius: '50%',
      background: 'var(--grad-orange-flat)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-on-orange)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7",
    stroke: "currentColor",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "\u0422\u04E9\u043B\u04E9\u0433\u0434\u0441\u04E9\u043D")) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '18px 0 4px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--grey)'
    }
  }, plan)), /*#__PURE__*/React.createElement("div", {
    className: "berd-metal-text",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '40px',
      lineHeight: 1
    }
  }, amount), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '9px',
      padding: '8px 14px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-2)',
      border: '1px solid var(--surface-line-2)'
    }
  }, !paid ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'var(--orange)',
      boxShadow: 'var(--glow-sm)',
      animation: 'berdPulse 1.2s var(--ease-out) infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--text-secondary)'
    }
  }, "\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0445\u04AF\u043B\u044D\u044D\u0436 \u0431\u0430\u0439\u043D\u0430 \xB7 ", expiresLabel)) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      color: 'var(--orange)',
      fontWeight: 700
    }
  }, "\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0442\u04E9\u043B\u04E9\u0433\u0434\u043B\u04E9\u04E9")), onBack ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '16px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontSize: '13px',
      color: 'var(--grey)'
    }
  }, "\u2190 \u0411\u0443\u0446\u0430\u0445")) : null, /*#__PURE__*/React.createElement("style", null, `@keyframes berdPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`));
}
Object.assign(__ds_scope, { QRCheckout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/checkout/QRCheckout.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BERD GYM — Badge / pill tag.
 * Solid orange = "most popular" / promo flag; outline & ghost for meta.
 */
function Badge({
  children,
  variant = 'solid',
  size = 'md',
  icon = null,
  style = {},
  ...rest
}) {
  const sizes = {
    md: {
      fontSize: '13px',
      padding: '7px 14px',
      height: '30px'
    },
    sm: {
      fontSize: '11px',
      padding: '5px 10px',
      height: '24px'
    }
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
    ...sizes[size]
  };
  const variants = {
    solid: {
      background: 'var(--grad-orange-flat)',
      color: 'var(--ink-on-orange)',
      boxShadow: 'var(--glow-sm)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--orange)',
      boxShadow: 'inset 0 0 0 1.5px var(--orange)'
    },
    dark: {
      background: 'var(--surface-2)',
      color: 'var(--text-secondary)',
      boxShadow: 'inset 0 0 0 1px var(--surface-line-2)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.05em'
    }
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BERD GYM — Button
 * Primary = molten-orange CTA with heat glow ("Гишүүн болох").
 * Heavy condensed uppercase label. Mobile-first 56px tap height by default.
 */
function Button({
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
  const heights = {
    lg: 'var(--control-h)',
    md: 'var(--control-h-sm)',
    sm: '38px'
  };
  const padX = {
    lg: '28px',
    md: '22px',
    sm: '16px'
  };
  const fontSize = {
    lg: '18px',
    md: '16px',
    sm: '14px'
  };
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
    userSelect: 'none'
  };
  const variants = {
    primary: {
      background: 'var(--grad-orange-metal)',
      color: 'var(--ink-on-orange)',
      boxShadow: 'var(--glow-cta), var(--inset-glint)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--orange)',
      boxShadow: 'inset 0 0 0 2px var(--orange)'
    },
    dark: {
      background: 'var(--surface-2)',
      color: 'var(--text-primary)',
      boxShadow: 'inset 0 0 0 1px var(--surface-line-2)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      boxShadow: 'none'
    }
  };
  const cls = 'berd-btn berd-btn--' + variant;
  const Tag = as === 'a' ? 'a' : 'button';
  const extra = Tag === 'a' ? {
    href
  } : {
    disabled,
    type: rest.type || 'button'
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    onClick: disabled ? undefined : onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, extra, rest), icon ? /*#__PURE__*/React.createElement("span", {
    className: "berd-btn__i",
    style: {
      display: 'inline-flex',
      fontSize: '1.15em'
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", null, children), iconRight ? /*#__PURE__*/React.createElement("span", {
    className: "berd-btn__i",
    style: {
      display: 'inline-flex',
      fontSize: '1.15em'
    }
  }, iconRight) : null, /*#__PURE__*/React.createElement("style", null, `
        .berd-btn:not([disabled]):hover { transform: translateY(-1px); }
        .berd-btn--primary:not([disabled]):hover { box-shadow: var(--glow-md), var(--inset-glint); }
        .berd-btn--secondary:not([disabled]):hover { background: rgba(247,148,29,0.10); }
        .berd-btn--dark:not([disabled]):hover { background: var(--surface-3); }
        .berd-btn--ghost:not([disabled]):hover { color: var(--orange); }
        .berd-btn:not([disabled]):active { transform: translateY(0) scale(0.975); }
      `));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BERD GYM — Input. Dark surface field for the checkout / signup flow.
 * Orange focus ring. Pass label + optional prefix (e.g. phone code).
 */
function Input({
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
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'block',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: '8px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontSize: '13px',
      color: 'var(--text-secondary)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    className: "berd-input",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: 'var(--control-h)',
      padding: '0 16px',
      background: 'var(--surface-input)',
      borderRadius: 'var(--radius-md)',
      boxShadow: invalid ? 'inset 0 0 0 1.5px var(--danger)' : 'inset 0 0 0 1px var(--surface-line-2)',
      transition: 'box-shadow var(--dur) var(--ease-out)'
    }
  }, prefix ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--grey)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600
    }
  }, prefix) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    onChange: onChange,
    style: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      fontWeight: 500
    }
  }, rest))), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: '7px',
      fontFamily: 'var(--font-body)',
      fontSize: '12.5px',
      color: invalid ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, hint) : null, /*#__PURE__*/React.createElement("style", null, `.berd-input:focus-within { box-shadow: inset 0 0 0 1.5px var(--orange), var(--glow-sm) !important; }`));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FeatureCheck.jsx
try { (() => {
/**
 * BERD GYM — FeatureCheck. The poster-style orange check-mark + benefit line.
 * variant "box" = rounded orange square (like the membership posters),
 * variant "circle" = filled orange disc.
 */
function FeatureCheck({
  children,
  variant = 'box',
  style = {}
}) {
  const mark = /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: '0 0 auto',
      width: '26px',
      height: '26px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--grad-orange-flat)',
      color: 'var(--ink-on-orange)',
      borderRadius: variant === 'circle' ? '50%' : '7px',
      boxShadow: 'var(--glow-sm)',
      marginTop: '2px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7",
    stroke: "currentColor",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '13px',
      ...style
    }
  }, mark, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.4,
      color: 'var(--text-primary)'
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCheck });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FeatureCheck.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PriceBlock.jsx
try { (() => {
/**
 * BERD GYM — PriceBlock. THE signature element.
 * Oversized molten-orange price set like a poster headline.
 * Optional struck-through old price (discount) and term unit.
 */
function PriceBlock({
  amount,
  // e.g. "250K" or "250,000₮"
  unit = '/ сар',
  // term
  oldAmount = null,
  // struck old price, e.g. "300K"
  size = 'lg',
  // 'mega' | 'lg' | 'md'
  align = 'left',
  style = {}
}) {
  const sizes = {
    mega: 'var(--fs-price-mega)',
    lg: 'var(--fs-price-lg)',
    md: 'clamp(2.75rem, 11vw, 4rem)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      ...style
    }
  }, oldAmount ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: 1,
      fontSize: '0.32em' // relative not used; set below
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size === 'mega' ? '2.25rem' : '1.75rem',
      color: 'var(--text-muted)',
      textDecoration: 'line-through',
      textDecorationColor: 'var(--danger)',
      textDecorationThickness: '3px'
    }
  }, oldAmount)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '0.18em',
      justifyContent: align === 'center' ? 'center' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "berd-metal-text",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: 'var(--lh-price)',
      letterSpacing: '-0.02em',
      fontSize: sizes[size],
      filter: 'drop-shadow(0 6px 18px rgba(247,148,29,0.35))'
    }
  }, amount), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: 'var(--grey)',
      fontSize: '0.9rem',
      paddingBottom: '0.7em',
      whiteSpace: 'nowrap'
    }
  }, unit) : null));
}
Object.assign(__ds_scope, { PriceBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PriceBlock.jsx", error: String((e && e.message) || e) }); }

// components/marketing/MembershipCard.jsx
try { (() => {
/**
 * BERD GYM — MembershipCard. A pricing tier with the oversized price as the
 * centrepiece. `featured` lifts it with an orange border + glow + badge.
 */
function MembershipCard({
  title,
  // "1 сар" / "Багштай анги"
  subtitle = null,
  // small line under title
  amount,
  // "250K"
  oldAmount = null,
  // "300K"
  unit = '/ сар',
  features = [],
  featured = false,
  badge = null,
  // e.g. "Хамгийн эрэлттэй"
  ctaLabel = 'Гишүүн болох',
  onSelect,
  note = null,
  // fine print under CTA
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: featured ? 'linear-gradient(180deg, #241a0e 0%, var(--surface-1) 55%)' : 'var(--grad-surface)',
      border: featured ? '1.5px solid var(--orange)' : '1px solid var(--surface-line-2)',
      borderRadius: 'var(--radius-lg)',
      padding: '26px 22px 22px',
      boxShadow: featured ? 'var(--glow-md), var(--shadow-card)' : 'var(--shadow-card)',
      ...style
    }
  }, badge ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-14px',
      left: '22px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "solid"
  }, badge)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      fontSize: '26px',
      color: 'var(--text-primary)'
    }
  }, title)), subtitle ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: '13.5px',
      color: 'var(--grey)'
    }
  }, subtitle) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '14px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PriceBlock, {
    amount: amount,
    oldAmount: oldAmount,
    unit: unit,
    size: "lg"
  })), features.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '11px',
      marginBottom: '22px'
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement(__ds_scope.FeatureCheck, {
    key: i
  }, f))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? 'primary' : 'secondary',
    fullWidth: true,
    onClick: onSelect
  }, ctaLabel), note ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      color: 'var(--text-muted)'
    }
  }, note) : null));
}
Object.assign(__ds_scope, { MembershipCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/MembershipCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PromoBanner.jsx
try { (() => {
/**
 * BERD GYM — PromoBanner. Top campaign strip for seasonal discounts
 * (Наадам / Шинэ жил / Зун). Tone "orange" = solid molten bar,
 * "dark" = near-black bar with orange accents. Dismissable.
 */
function PromoBanner({
  label = 'Наадам',
  // campaign tag
  message,
  // main line, e.g. "Бүх багцад 20% хямдрал"
  cta = null,
  // optional link text
  href = '#',
  onCta,
  tone = 'orange',
  onClose = null,
  style = {}
}) {
  const isOrange = tone === 'orange';
  return /*#__PURE__*/React.createElement("div", {
    role: "region",
    "aria-label": "\u0423\u0440\u0430\u043C\u0448\u0443\u0443\u043B\u0430\u043B",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      background: isOrange ? 'var(--grad-orange-flat)' : 'var(--surface-1)',
      borderBottom: isOrange ? 'none' : '1px solid var(--surface-line-2)',
      boxShadow: isOrange ? 'var(--glow-sm)' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontSize: '12px',
      padding: '4px 9px',
      borderRadius: 'var(--radius-pill)',
      background: isOrange ? 'rgba(20,10,0,0.85)' : 'var(--grad-orange-flat)',
      color: isOrange ? 'var(--orange-bright)' : 'var(--ink-on-orange)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: 1.25,
      color: isOrange ? 'var(--ink-on-orange)' : 'var(--text-primary)'
    }
  }, message, cta ? /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onCta,
    style: {
      marginLeft: '10px',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      fontSize: '13px',
      color: isOrange ? 'var(--ink-on-orange)' : 'var(--orange)',
      textDecoration: 'underline',
      textUnderlineOffset: '3px'
    }
  }, cta, " \u2192") : null), onClose ? /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u0425\u0430\u0430\u0445",
    onClick: onClose,
    style: {
      flex: '0 0 auto',
      width: '28px',
      height: '28px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: isOrange ? 'var(--ink-on-orange)' : 'var(--grey)',
      fontSize: '18px',
      lineHeight: 1,
      opacity: 0.8
    }
  }, "\u2715") : null);
}
Object.assign(__ds_scope, { PromoBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PromoBanner.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeading.jsx
try { (() => {
/**
 * BERD GYM — SectionHeading. Orange eyebrow + heavy condensed display title,
 * with an optional orange accent word and slanted "poster italic".
 */
function SectionHeading({
  eyebrow = null,
  children,
  // title; wrap accent in <span data-accent>
  accent = null,
  // alternative: orange accent appended after title
  slant = false,
  align = 'left',
  size = 'display-2',
  // 'display-1' | 'display-2' | 'display-3'
  style = {}
}) {
  const sizeVar = {
    'display-1': 'var(--fs-display-1)',
    'display-2': 'var(--fs-display-2)',
    'display-3': 'var(--fs-display-3)'
  }[size];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      ...style
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      color: 'var(--orange)',
      fontSize: '13px',
      marginBottom: '12px'
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      fontSize: sizeVar,
      color: 'var(--text-primary)',
      transform: slant ? 'var(--skew-italic)' : 'none',
      transformOrigin: align === 'center' ? 'center' : 'left'
    }
  }, children, accent ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange)'
    }
  }, " ", accent) : null));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/app.jsx
try { (() => {
const {
  useState,
  useEffect
} = React;
const DS = window.BERDGYMDesignSystem_75db46;
const {
  Button,
  Badge,
  PriceBlock,
  FeatureCheck,
  MembershipCard,
  PromoBanner,
  SectionHeading,
  Input,
  QRCheckout
} = DS;
const PHONE = '86661231';
const PHONE2 = '88069560';

/* ——— responsive helpers ——— */
function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = e => setMatch(e.matches);
    setMatch(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return match;
}
const DESKTOP = '(min-width: 980px)';
const MAXW = 1200;
function Container({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: MAXW,
      margin: '0 auto',
      padding: '0 clamp(20px, 5vw, 48px)',
      boxSizing: 'border-box',
      ...style
    }
  }, children);
}
const SECTION_PAD = 'clamp(56px, 8vw, 112px)';
const PLANS = [{
  id: 'month1',
  title: '1 сар',
  subtitle: 'Чөлөөт бүртгэл',
  amount: '300K',
  amountFull: '300,000₮',
  unit: '/ сар',
  features: ['Бүх тренажер, төхөөрөмж', '06:00–22:00 нээлттэй', 'Хувцас солих өрөө, шүршүүр']
}, {
  id: 'coach',
  title: 'Багштай анги',
  subtitle: 'Мэргэжлийн дасгалжуулагчтай',
  amount: '250K',
  oldAmount: '300K',
  amountFull: '250,000₮',
  unit: '/ сар',
  featured: true,
  badge: 'Хамгийн эрэлттэй',
  features: ['7 хоногт 4–5 удаа бэлтгэл', 'Хоолны дэглэм • Cardio • Fitness', 'Хувийн төлөвлөгөө', 'Турах • Жин нэмэх • Булчин']
}, {
  id: 'season',
  title: '3 сарын багц',
  subtitle: 'Урт хугацааны хямдрал',
  amount: '160K',
  oldAmount: '200K',
  amountFull: '160,000₮',
  unit: '/ сар',
  features: ['3 сар тасралтгүй', 'Бүх тренажер, цаг', 'Найзтайгаа: 2 хүн хамт хямдрал']
}];
const FEATURES = ['Мэргэжлийн багш дасгалжуулагч', 'Хоолны зөвлөгөө, дэглэм', 'Дасгалын зөв техник заавар', 'Cardio • Fitness • Хүчний бэлтгэл', '06:00–22:00, өдөр бүр нээлттэй', 'Турах • Жин нэмэх • Булчин нэмэх'];
const NAV = [{
  label: 'Давуу тал',
  href: '#why'
}, {
  label: 'Багц',
  href: '#price'
}, {
  label: 'Хувийн дасгал',
  href: '#pt'
}, {
  label: 'Холбоо барих',
  href: '#contact'
}];
const FB = p => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: p.s || 18,
  height: p.s || 18,
  fill: "currentColor",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"
}));
const Phone = p => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: p.s || 18,
  height: p.s || 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
}));
const Pin = p => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: p.s || 18,
  height: p.s || 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
const Clock = p => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: p.s || 18,
  height: p.s || 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 7v5l3 2"
}));

/* —— Header —— */
function Header({
  onJoin
}) {
  const isDesktop = useMedia(DESKTOP);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(14,14,14,0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--surface-line)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      padding: isDesktop ? '14px clamp(20px, 5vw, 48px)' : '12px 18px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-berdgym-dark.png",
    alt: "BERD GYM MONGOLIA",
    style: {
      height: isDesktop ? 36 : 32,
      flex: '0 0 auto'
    }
  }), isDesktop ? /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 30,
      marginLeft: 'auto',
      marginRight: 8
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.href,
    href: n.href,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      fontSize: 15.5,
      color: 'var(--text-secondary)'
    }
  }, n.label))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + PHONE,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      color: 'var(--orange)'
    }
  }, /*#__PURE__*/React.createElement(Phone, {
    s: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17,
      letterSpacing: '.02em'
    }
  }, PHONE)), isDesktop ? /*#__PURE__*/React.createElement(Button, {
    onClick: onJoin
  }, "\u0413\u0438\u0448\u04AF\u04AF\u043D \u0431\u043E\u043B\u043E\u0445") : null)));
}

/* —— Hero —— */
function Hero({
  onJoin
}) {
  const isDesktop = useMedia(DESKTOP);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 'clamp(640px, 92vh, 900px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "url('../../assets/imagery/athlete-torso.jpg') center 14%/cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-hero-scrim)'
    }
  }), isDesktop ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(8,8,8,.94) 0%, rgba(8,8,8,.5) 46%, transparent 78%)'
    }
  }) : null, /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      paddingTop: 40,
      paddingBottom: 'clamp(38px, 6vw, 80px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.2em',
      color: 'var(--text-secondary)',
      fontSize: 'clamp(11px, 1.1vw, 13px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 2,
      background: 'var(--orange)'
    }
  }), "\u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440 \xB7 2003 \u043E\u043D\u043E\u043E\u0441"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '18px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: .86,
      letterSpacing: '-.015em',
      fontSize: 'clamp(56px, 8vw, 128px)',
      color: '#fff'
    }
  }, "\u0425\u04AF\u0447 \u0447\u0438\u043D\u044C", /*#__PURE__*/React.createElement("br", null), "\u0434\u043E\u0442\u0440\u043E\u043E\u0441 \u044D\u0445\u044D\u043B\u043D\u044D"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '22px 0 0',
      maxWidth: 480,
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(16.5px, 1.6vw, 20px)',
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, "\u041C\u044D\u0440\u0433\u044D\u0436\u043B\u0438\u0439\u043D \u0434\u0430\u0441\u0433\u0430\u043B\u0436\u0443\u0443\u043B\u0430\u0433\u0447, \u0445\u043E\u043E\u043B\u043D\u044B \u0434\u044D\u0433\u043B\u044D\u043C, \u0437\u04E9\u0432 \u0442\u0435\u0445\u043D\u0438\u043A. \u042D\u0445\u043D\u0438\u0439 30 \u0445\u04AF\u043D\u0434 \u0445\u044F\u043C\u0434\u0440\u0430\u043B \u0445\u04AF\u0447\u0438\u043D\u0442\u044D\u0439."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 30,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: isDesktop ? '0 0 auto' : 1
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onJoin,
    fullWidth: !isDesktop
  }, "\u0413\u0438\u0448\u04AF\u04AF\u043D \u0431\u043E\u043B\u043E\u0445")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    as: "a",
    href: "#price"
  }, "\u04AE\u043D\u044D \u04AF\u0437\u044D\u0445")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderTop: '1px solid var(--surface-line-2)',
      background: 'rgba(8,8,8,.5)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'clamp(16px, 4vw, 40px)',
      padding: '14px clamp(20px, 5vw, 48px)'
    }
  }, /*#__PURE__*/React.createElement(DetailItem, null, "06:00\u201322:00 \xB7 \u04E9\u0434\u04E9\u0440 \u0431\u04AF\u0440"), /*#__PURE__*/React.createElement(DetailItem, null, "3, 4 \u0445\u043E\u0440\u043E\u043E\u043B\u043E\u043B \xB7 2 \u0441\u0430\u043B\u0431\u0430\u0440"), /*#__PURE__*/React.createElement(DetailItem, null, "QPay \xB7 \u043E\u043D\u043B\u0430\u0439\u043D \u0431\u04AF\u0440\u0442\u0433\u044D\u043B"))));
}
function DetailItem({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      fontSize: 'clamp(12px, 1.2vw, 14px)',
      color: 'var(--text-secondary)'
    }
  }, children);
}

/* —— Editorial section label: oversized index + title + hairline —— */
function SectionLabel({
  index,
  kicker,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--surface-line-2)',
      paddingTop: 18,
      display: 'flex',
      alignItems: 'baseline',
      gap: 'clamp(16px, 3vw, 36px)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(15px, 1.4vw, 18px)',
      color: 'var(--orange)',
      letterSpacing: '.04em'
    }
  }, index), /*#__PURE__*/React.createElement("div", null, kicker ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '.16em',
      fontSize: 'clamp(11px, 1.1vw, 13px)',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, kicker) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: .92,
      letterSpacing: '-.01em',
      fontSize: 'clamp(34px, 5vw, 64px)',
      color: '#fff'
    }
  }, children)));
}

/* —— Features (editorial numbered list) —— */
function Features() {
  const isDesktop = useMedia(DESKTOP);
  return /*#__PURE__*/React.createElement("section", {
    id: "why",
    style: {
      padding: SECTION_PAD + ' 0'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01",
    kicker: "\u042F\u0430\u0433\u0430\u0430\u0434 \u0411\u042D\u0420\u0414"
  }, "\u0411\u0438\u0434\u043D\u0438\u0439 \u0434\u0430\u0432\u0443\u0443 \u0442\u0430\u043B"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'clamp(28px, 4vw, 48px)'
    }
  }, FEATURES.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? '72px 1fr' : '48px 1fr',
      alignItems: 'center',
      gap: 'clamp(14px, 2vw, 28px)',
      padding: 'clamp(16px, 2.2vw, 26px) 0',
      borderTop: i === 0 ? 'none' : '1px solid var(--surface-line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(20px, 2.4vw, 30px)',
      color: 'var(--surface-3)',
      letterSpacing: '.02em'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.01em',
      lineHeight: 1.05,
      fontSize: 'clamp(20px, 2.6vw, 34px)',
      color: '#fff'
    }
  }, f))))));
}

/* —— Pricing (price board / list) —— */
function Pricing({
  onSelect
}) {
  const isDesktop = useMedia(DESKTOP);
  return /*#__PURE__*/React.createElement("section", {
    id: "price",
    style: {
      padding: SECTION_PAD + ' 0',
      background: 'var(--berd-black-deep)'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02",
    kicker: "\u0413\u0438\u0448\u04AF\u04AF\u043D\u0447\u043B\u044D\u043B"
  }, "\u0411\u0430\u0433\u0446\u0430\u0430 \u0441\u043E\u043D\u0433\u043E"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(16px, 1.5vw, 18.5px)',
      color: 'var(--text-secondary)',
      maxWidth: 520,
      lineHeight: 1.55
    }
  }, "\u041E\u043D\u043B\u0430\u0439\u043D \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u044D\u0434 \u0438\u0440\u0441\u044D\u043D \u04E9\u0434\u0440\u04E9\u04E9\u0441\u04E9\u04E9 \u044D\u0445\u043B\u04AF\u04AF\u043B\u044D\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0442\u043E\u0439."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'clamp(34px, 5vw, 56px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(12px, 1.6vw, 18px)'
    }
  }, PLANS.map(p => /*#__PURE__*/React.createElement(PriceRow, {
    key: p.id,
    plan: p,
    isDesktop: isDesktop,
    onSelect: () => onSelect(p)
  })))));
}
function PriceRow({
  plan,
  isDesktop,
  onSelect
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onSelect,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      cursor: 'pointer',
      display: 'grid',
      gridTemplateColumns: isDesktop ? '1fr auto auto' : '1fr auto',
      alignItems: 'center',
      columnGap: 'clamp(16px, 3vw, 48px)',
      rowGap: 12,
      padding: 'clamp(22px, 3vw, 36px) clamp(18px, 2.4vw, 34px)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid ' + (plan.featured ? 'var(--orange)' : 'var(--surface-line-2)'),
      background: hover ? 'var(--surface-2)' : plan.featured ? 'rgba(247,148,29,0.06)' : 'var(--surface-1)',
      transition: 'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '-.005em',
      fontSize: 'clamp(24px, 3vw, 40px)',
      color: '#fff',
      lineHeight: 1
    }
  }, plan.title), plan.featured ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      fontSize: 11,
      color: 'var(--ink-on-orange)',
      background: 'var(--orange)',
      padding: '4px 9px'
    }
  }, "\u0421\u0430\u043D\u0430\u043B \u0431\u043E\u043B\u0433\u043E\u0445") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(13.5px, 1.4vw, 16px)',
      color: 'var(--text-secondary)',
      lineHeight: 1.5
    }
  }, plan.features.join(' · '))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      whiteSpace: 'nowrap'
    }
  }, plan.oldAmount ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'clamp(13px, 1.3vw, 16px)',
      color: 'var(--text-muted)',
      textDecoration: 'line-through',
      lineHeight: 1
    }
  }, plan.oldAmount) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'flex-end',
      gap: 6,
      marginTop: plan.oldAmount ? 4 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(40px, 5.5vw, 68px)',
      color: plan.featured ? 'var(--orange)' : '#fff',
      lineHeight: .9,
      letterSpacing: '-.01em'
    }
  }, plan.amount), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(12px, 1.2vw, 14px)',
      color: 'var(--text-muted)'
    }
  }, plan.unit))), isDesktop ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      justifySelf: 'end',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-pill)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid ' + (hover ? 'var(--orange)' : 'var(--surface-line-2)'),
      background: hover ? 'var(--orange)' : 'transparent',
      color: hover ? 'var(--ink-on-orange)' : '#fff',
      fontSize: 22,
      transition: 'all var(--dur) var(--ease-out)',
      transform: hover ? 'translateX(4px)' : 'none'
    }
  }, "\u2192") : null);
}

/* —— Personal training —— */
function PTHighlight({
  onSelect
}) {
  const isDesktop = useMedia(DESKTOP);
  return /*#__PURE__*/React.createElement("section", {
    id: "pt",
    style: {
      padding: SECTION_PAD + ' 0',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
      gap: 'clamp(28px, 4vw, 64px)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03",
    kicker: "\u0425\u0443\u0432\u0438\u0439\u043D \u0434\u0430\u0441\u0433\u0430\u043B\u0436\u0443\u0443\u043B\u0430\u043B\u0442"
  }, "\u04AE\u0440 \u0434\u04AF\u043D", /*#__PURE__*/React.createElement("br", null), "\u0445\u0430\u0440\u0430\u0433\u0434\u0430\u043D\u0430"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '20px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(16.5px, 1.6vw, 20px)',
      color: 'var(--text-secondary)',
      lineHeight: 1.6,
      maxWidth: 440
    }
  }, "\u0417\u04E9\u0432 \u0445\u043E\u043E\u043B\u043B\u043E\u043B\u0442, \u0434\u0430\u0441\u0433\u0430\u043B\u044B\u043D \u0437\u04E9\u0432 \u0442\u0435\u0445\u043D\u0438\u043A, \u0445\u0443\u0432\u0438\u0439\u043D \u0434\u0430\u0441\u0433\u0430\u043B\u0436\u0443\u0443\u043B\u0430\u0433\u0447\u0442\u0430\u0439. \u042D\u0445\u043B\u044D\u043B\u044D\u044D\u0441 \u0442\u0430\u0439\u0437 \u0445\u04AF\u0440\u0442\u044D\u043B."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginTop: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onSelect(PLANS[1])
  }, "\u042D\u043B\u0441\u044D\u043B\u0442 \u0430\u0432\u0430\u0445"), /*#__PURE__*/React.createElement("a", {
    href: 'tel:' + PHONE2,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--orange)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement(Phone, {
    s: 17
  }), PHONE2))), /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      overflow: 'hidden',
      border: '1px solid var(--surface-line-2)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/transform-strip.jpg",
    alt: "\u0413\u0438\u0448\u04AF\u04AF\u0434\u0438\u0439\u043D \u04AF\u0440 \u0434\u04AF\u043D",
    style: {
      width: '100%',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      position: 'absolute',
      left: 12,
      bottom: 10,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    size: "sm",
    variant: "solid"
  }, "\u042D\u0445\u043B\u044D\u043B"), /*#__PURE__*/React.createElement(Badge, {
    size: "sm",
    variant: "dark"
  }, "\u2192 3 \u0441\u0430\u0440"), /*#__PURE__*/React.createElement(Badge, {
    size: "sm",
    variant: "outline"
  }, "\u0422\u044D\u043C\u0446\u044D\u044D\u043D"))))));
}

/* —— Footer —— */
function Footer() {
  const isDesktop = useMedia(DESKTOP);
  return /*#__PURE__*/React.createElement("footer", {
    id: "contact",
    style: {
      padding: `clamp(44px, 6vw, 72px) 0 ${isDesktop ? '64px' : '120px'}`,
      borderTop: '1px solid var(--surface-line)',
      background: 'var(--berd-black-deep)'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: isDesktop ? 'row' : 'column',
      gap: 'clamp(28px, 4vw, 64px)',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-berdgym-dark.png",
    alt: "BERD GYM MONGOLIA",
    style: {
      height: 38
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, "\u0425\u04AF\u0447 \u0447\u0438\u043D\u044C \u0434\u043E\u0442\u0440\u043E\u043E\u0441 \u044D\u0445\u044D\u043B\u043D\u044D. \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440 \u0445\u043E\u0442\u044B\u043D 3, 4 \u0445\u043E\u0440\u043E\u043E\u043B\u043B\u044B\u043D \u0441\u0430\u043B\u0431\u0430\u0440\u0442 \u0442\u0430\u043D\u044C \u0445\u04AF\u043B\u044D\u044D\u0436 \u0431\u0430\u0439\u043D\u0430.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
      gap: 16,
      flex: isDesktop ? '0 0 auto' : '1',
      minWidth: isDesktop ? 460 : 'auto'
    }
  }, /*#__PURE__*/React.createElement(FootRow, {
    icon: /*#__PURE__*/React.createElement(Phone, {
      s: 18
    }),
    label: "\u0423\u0442\u0430\u0441",
    value: PHONE + ' · ' + PHONE2,
    href: 'tel:' + PHONE
  }), /*#__PURE__*/React.createElement(FootRow, {
    icon: /*#__PURE__*/React.createElement(Pin, {
      s: 18
    }),
    label: "\u0421\u0430\u043B\u0431\u0430\u0440",
    value: "3, 4 \u0445\u043E\u0440\u043E\u043E\u043B\u043E\u043B \u0441\u0430\u043B\u0431\u0430\u0440"
  }), /*#__PURE__*/React.createElement(FootRow, {
    icon: /*#__PURE__*/React.createElement(Clock, {
      s: 18
    }),
    label: "\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C",
    value: "06:00\u201322:00, \u04E9\u0434\u04E9\u0440 \u0431\u04AF\u0440"
  }), /*#__PURE__*/React.createElement(FootRow, {
    icon: /*#__PURE__*/React.createElement(FB, {
      s: 18
    }),
    label: "Facebook",
    value: "BerdGymMongolia",
    href: "https://facebook.com/BerdGymMongolia"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      paddingTop: 18,
      borderTop: '1px solid var(--surface-line)',
      fontFamily: 'var(--font-body)',
      fontSize: 13.5,
      color: 'var(--grey)'
    }
  }, "\xA9 2026 BERD GYM MONGOLIA. \u0411\u04AF\u0445 \u044D\u0440\u0445 \u0445\u0443\u0443\u043B\u0438\u0430\u0440 \u0445\u0430\u043C\u0433\u0430\u0430\u043B\u0430\u0433\u0434\u0441\u0430\u043D.")));
}
function FootRow({
  icon,
  label,
  value,
  href
}) {
  const inner = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 44,
      height: 44,
      background: 'var(--surface-1)',
      border: '1px solid var(--surface-line-2)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--orange)'
    }
  }, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 16.5,
      color: '#fff'
    }
  }, value)));
  return href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noreferrer"
  }, inner) : inner;
}

/* —— Sticky bottom CTA (mobile only) —— */
function StickyCTA({
  onJoin
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      zIndex: 40,
      padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
      background: 'linear-gradient(180deg, rgba(14,14,14,0) 0%, var(--berd-black) 32%)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0411\u0430\u0433\u0446\u0443\u0443\u0434"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 23,
      lineHeight: 1
    },
    className: "berd-metal-text"
  }, "160K-\u0430\u0430\u0441")), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onJoin
  }, "\u0413\u0438\u0448\u04AF\u04AF\u043D \u0431\u043E\u043B\u043E\u0445"));
}

/* —— Checkout sheet —— */
function Checkout({
  plan,
  onClose
}) {
  const isDesktop = useMedia(DESKTOP);
  const [step, setStep] = useState('details'); // details | qr
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  const panelStyle = isDesktop ? {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--berd-black)',
    borderRadius: 24,
    border: '1px solid var(--surface-line-2)',
    padding: '14px 24px 28px',
    boxShadow: '0 40px 120px rgba(0,0,0,.7)',
    animation: 'sheetPop .3s var(--ease-out)'
  } : {
    position: 'relative',
    width: '100%',
    maxWidth: 480,
    maxHeight: '94vh',
    overflowY: 'auto',
    background: 'var(--berd-black)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    border: '1px solid var(--surface-line-2)',
    borderBottom: 'none',
    padding: '14px 20px 28px',
    animation: 'sheetUp .32s var(--ease-out)'
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: isDesktop ? 'center' : 'flex-end',
      padding: isDesktop ? 20 : 0,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,.72)',
      backdropFilter: 'blur(2px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: panelStyle
  }, !isDesktop ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 5,
      borderRadius: 999,
      background: 'var(--surface-3)',
      margin: '0 auto 14px'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
      marginTop: isDesktop ? 6 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      fontSize: 20,
      color: '#fff'
    }
  }, step === 'details' ? 'Бүртгэл' : 'QPay төлбөр'), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "\u0425\u0430\u0430\u0445",
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      border: '1px solid var(--surface-line-2)',
      background: 'var(--surface-1)',
      color: 'var(--grey)',
      fontSize: 17,
      cursor: 'pointer'
    }
  }, "\u2715")), step === 'details' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '14px 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-1)',
      border: '1px solid var(--surface-line-2)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: 18,
      color: '#fff'
    }
  }, plan.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--grey)'
    }
  }, plan.subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "berd-metal-text",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1
    }
  }, plan.amount), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, plan.unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u041D\u044D\u0440",
    placeholder: "\u0422\u0430\u043D\u044B \u043D\u044D\u0440"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u0423\u0442\u0430\u0441",
    type: "tel",
    prefix: "+976",
    placeholder: "8800 0000"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingTop: 16,
      borderTop: '1px solid var(--surface-line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--grey)'
    }
  }, "\u041D\u0438\u0439\u0442 \u0442\u04E9\u043B\u0431\u04E9\u0440"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 24,
      color: '#fff'
    }
  }, plan.amountFull)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    icon: "\u25CF",
    onClick: () => setStep('qr')
  }, "QPay-\u044D\u044D\u0440 \u0442\u04E9\u043B\u04E9\u0445")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u0441\u043D\u04E9\u04E9\u0440 \u0433\u0438\u0448\u04AF\u04AF\u043D\u0447\u043B\u044D\u043B \u0438\u0434\u044D\u0432\u0445\u0436\u0438\u043D\u044D.")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(QRCheckout, {
    plan: plan.title,
    amount: plan.amountFull,
    status: paid ? 'paid' : 'waiting',
    expiresLabel: "04:58",
    onBack: () => setStep('details')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, !paid ? /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => setPaid(true)
  }, "\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0448\u0430\u043B\u0433\u0430\u0445") : /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onClose
  }, "\u0414\u0443\u0443\u0441\u0433\u0430\u0445")))), /*#__PURE__*/React.createElement("style", null, `
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetPop { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `));
}

/* —— App —— */
function App() {
  const isDesktop = useMedia(DESKTOP);
  const [promo, setPromo] = useState(true);
  const [checkout, setCheckout] = useState(null);
  const openFeatured = () => setCheckout(PLANS[1]);
  return /*#__PURE__*/React.createElement("div", null, promo ? /*#__PURE__*/React.createElement(PromoBanner, {
    label: "\u041D\u0430\u0430\u0434\u0430\u043C",
    message: "\u0411\u04AF\u0445 \u0431\u0430\u0433\u0446\u0430\u0434 20% \u0445\u044F\u043C\u0434\u0440\u0430\u043B \u2014 7 \u0445\u043E\u043D\u043E\u0433",
    cta: "\u0410\u0432\u0430\u0445",
    onCta: e => {
      e.preventDefault();
      openFeatured();
    },
    onClose: () => setPromo(false)
  }) : null, /*#__PURE__*/React.createElement(Header, {
    onJoin: openFeatured
  }), /*#__PURE__*/React.createElement(Hero, {
    onJoin: openFeatured
  }), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(Pricing, {
    onSelect: setCheckout
  }), /*#__PURE__*/React.createElement(PTHighlight, {
    onSelect: setCheckout
  }), /*#__PURE__*/React.createElement(Footer, null), !isDesktop ? /*#__PURE__*/React.createElement(StickyCTA, {
    onJoin: openFeatured
  }) : null, checkout ? /*#__PURE__*/React.createElement(Checkout, {
    plan: checkout,
    onClose: () => setCheckout(null)
  }) : null);
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.QRCheckout = __ds_scope.QRCheckout;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.FeatureCheck = __ds_scope.FeatureCheck;

__ds_ns.MembershipCard = __ds_scope.MembershipCard;

__ds_ns.PriceBlock = __ds_scope.PriceBlock;

__ds_ns.PromoBanner = __ds_scope.PromoBanner;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

})();
