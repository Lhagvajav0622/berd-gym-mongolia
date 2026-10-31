import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "danger";
type Size = "lg" | "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-metal text-on-orange shadow-cta hover:brightness-105",
  secondary: "text-orange ring-2 ring-inset ring-orange hover:bg-orange/10",
  dark: "bg-surface-2 text-fg ring-1 ring-inset ring-line-2 hover:bg-surface-3",
  ghost: "text-fg hover:text-orange",
  danger: "bg-bad/15 text-bad ring-1 ring-inset ring-bad/40 hover:bg-bad/25",
};
const sizes: Record<Size, string> = {
  lg: "h-14 px-7 text-lg",
  md: "h-11 px-5 text-base",
  sm: "h-9 px-4 text-sm",
};

export function btnClass(variant: Variant = "primary", size: Size = "lg", full = false) {
  return [
    "display inline-flex items-center justify-center gap-2.5 rounded-full tracking-[0.04em] whitespace-nowrap select-none",
    "transition active:scale-[0.975] disabled:cursor-not-allowed disabled:opacity-45",
    variants[variant],
    sizes[size],
    full ? "w-full" : "",
  ].join(" ");
}

export function Button({
  variant = "primary",
  size = "lg",
  full,
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; full?: boolean }) {
  return <button type="button" className={`${btnClass(variant, size, full)} ${className}`} {...rest} />;
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  full,
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; full?: boolean }) {
  return <Link className={`${btnClass(variant, size, full)} ${className}`} {...rest} />;
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-[13px] text-grey">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full h-12 rounded-md bg-surface-2 border border-line-2 px-3.5 text-[16px] text-fg outline-none placeholder:text-muted focus:border-orange";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Card({ className = "", ...rest }: ComponentProps<"div">) {
  return <div className={`rounded-lg border border-line-2 bg-surface-1 ${className}`} {...rest} />;
}

const tones = {
  orange: "bg-orange text-on-orange",
  ok: "bg-ok/15 text-ok",
  warn: "bg-warn/15 text-warn",
  bad: "bg-bad/15 text-bad",
  grey: "bg-surface-3 text-fg-2",
};

export function Badge({ tone = "grey", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <span className={`display inline-flex items-center rounded-full px-2.5 py-1 text-[11px] tracking-[0.1em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Container({ className = "", ...rest }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 ${className}`} {...rest} />;
}

export function Logo({ className = "h-8" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/img/logo-berdgym-dark.png" alt="BERD GYM MONGOLIA" className={`w-auto ${className}`} />;
}

export function mnt(n: number) {
  return n.toLocaleString("en-US") + "₮";
}

export function shortMnt(n: number) {
  return n % 1000 === 0 ? `${n / 1000}K` : mnt(n);
}

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="rounded-md bg-bad/10 px-3 py-2 text-[14px] text-bad">{children}</p>;
}
