import * as React from 'react';

export interface FeatureCheckProps {
  children: React.ReactNode;
  /** box = rounded orange square (default) · circle = filled disc. */
  variant?: 'box' | 'circle';
  style?: React.CSSProperties;
}

/** Poster-style orange check-mark + benefit line. Stack several in a list. */
export function FeatureCheck(props: FeatureCheckProps): JSX.Element;
