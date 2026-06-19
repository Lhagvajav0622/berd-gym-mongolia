import * as React from 'react';

export interface PriceBlockProps {
  /** The price, formatted as you want it shown, e.g. "250K" or "250,000₮". */
  amount: string;
  /** Term / unit shown beside the price. Default "/ сар". */
  unit?: string;
  /** Optional struck-through previous price for discounts, e.g. "300K". */
  oldAmount?: string | null;
  /** mega = hero (88→176px) · lg = card (default) · md. */
  size?: 'mega' | 'lg' | 'md';
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}

/**
 * The signature oversized molten-orange price block — set like a poster headline.
 * @startingPoint section="Marketing" subtitle="Oversized molten-orange hero price" viewport="700x240"
 */
export function PriceBlock(props: PriceBlockProps): JSX.Element;
