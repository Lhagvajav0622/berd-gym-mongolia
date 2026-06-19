import * as React from 'react';

export interface QRCheckoutProps {
  /** Selected plan name. */
  plan?: string;
  /** Amount, preformatted, e.g. "250,000₮". */
  amount?: string;
  /** waiting = live QR (default) · paid = success overlay. */
  status?: 'waiting' | 'paid';
  /** Countdown label shown while waiting. */
  expiresLabel?: string;
  /** Pass a real QR image URL; omit to render the styled placeholder. */
  qrSrc?: string | null;
  onBack?: (() => void) | null;
  style?: React.CSSProperties;
}

/**
 * QPay QR-display state for checkout. Presentation only — no payment logic.
 * @startingPoint section="Checkout" subtitle="QPay QR payment screen + paid state" viewport="400x560"
 */
export function QRCheckout(props: QRCheckoutProps): JSX.Element;
