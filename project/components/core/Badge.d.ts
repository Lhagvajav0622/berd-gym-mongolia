import * as React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  /** solid = orange flag (default) · outline · dark (meta chip). */
  variant?: 'solid' | 'outline' | 'dark';
  size?: 'md' | 'sm';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Pill badge / tag — "most popular", promo flags, and meta chips. */
export function Badge(props: BadgeProps): JSX.Element;
