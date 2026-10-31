import * as React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. primary = molten-orange CTA (default). */
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  /** lg = 56px CTA (default), md = 44px, sm = 38px. */
  size?: 'lg' | 'md' | 'sm';
  fullWidth?: boolean;
  /** Leading icon node (SVG / glyph). */
  icon?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
  /** Render as <a> for links. */
  as?: 'button' | 'a';
  href?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * Primary action button. Molten-orange CTA with heat glow for the main
 * conversion action; secondary/dark/ghost for supporting actions.
 * @startingPoint section="Core" subtitle="Molten-orange CTA + variants" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
