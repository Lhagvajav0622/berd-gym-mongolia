import * as React from 'react';

export interface MembershipCardProps {
  /** Tier name, e.g. "1 сар" or "Багштай анги". */
  title: string;
  subtitle?: string | null;
  /** Price string, e.g. "250K". */
  amount: string;
  /** Struck old price for discounts, e.g. "300K". */
  oldAmount?: string | null;
  unit?: string;
  /** Benefit lines rendered as orange FeatureChecks. */
  features?: string[];
  /** Lifts the card with orange border + glow + badge slot. */
  featured?: boolean;
  /** Flag text shown in the top badge, e.g. "Хамгийн эрэлттэй". */
  badge?: string | null;
  ctaLabel?: string;
  onSelect?: () => void;
  note?: string | null;
  style?: React.CSSProperties;
}

/**
 * A membership pricing tier with the oversized price as the centrepiece.
 * @startingPoint section="Marketing" subtitle="Pricing tier with hero price + features" viewport="380x560"
 */
export function MembershipCard(props: MembershipCardProps): JSX.Element;
