import * as React from 'react';

export interface InputProps {
  label?: string;
  hint?: string;
  /** Static leading content, e.g. "+976". */
  prefix?: React.ReactNode;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Dark-surface text field with orange focus ring — used in signup & checkout. */
export function Input(props: InputProps): JSX.Element;
