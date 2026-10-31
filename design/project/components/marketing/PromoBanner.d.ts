import * as React from 'react';

export interface PromoBannerProps {
  /** Campaign tag pill, e.g. "Наадам", "Шинэ жил", "Зун". */
  label?: string;
  /** Main promo line. */
  message: React.ReactNode;
  /** Optional inline link text. */
  cta?: string | null;
  href?: string;
  onCta?: (e: React.MouseEvent) => void;
  /** orange = solid molten bar (default) · dark = near-black bar. */
  tone?: 'orange' | 'dark';
  /** Provide a handler to render the dismiss ✕. */
  onClose?: (() => void) | null;
  style?: React.CSSProperties;
}

/**
 * Top campaign banner for seasonal discounts. Stick it to the top of the page.
 * @startingPoint section="Marketing" subtitle="Seasonal campaign top bar" viewport="700x64"
 */
export function PromoBanner(props: PromoBannerProps): JSX.Element;
