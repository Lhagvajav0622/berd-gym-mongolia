import * as React from 'react';

export interface SectionHeadingProps {
  /** Wide-tracked orange eyebrow label above the title. */
  eyebrow?: string | null;
  children: React.ReactNode;
  /** Orange accent word appended after the title. */
  accent?: string | null;
  /** Apply the slanted "poster italic" skew. */
  slant?: boolean;
  align?: 'left' | 'center';
  size?: 'display-1' | 'display-2' | 'display-3';
  style?: React.CSSProperties;
}

/** Orange eyebrow + heavy condensed display title for section headers. */
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
