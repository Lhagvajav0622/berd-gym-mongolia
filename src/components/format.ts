import type { Phase } from "@/server/membership";

export const PHASE_TONE: Record<Phase, "ok" | "warn" | "bad" | "grey" | "orange"> = {
  active: "ok",
  paused: "warn",
  not_started: "orange",
  pending_payment: "warn",
  expired: "grey",
  cancelled: "bad",
};

/** "2026-12-04" → "2026.12.04" */
export function fmtDay(d: string | null | undefined) {
  return d ? d.replaceAll("-", ".") : "—";
}

export function fmtTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  // Built by hand: some browsers print Mongolian months as Roman numerals.
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ulaanbaatar",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(d))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
}

/** 30 → "сар", 90 → "3 сар", 14 → "14 хоног" */
export function durationLabel(days: number) {
  if (days % 30 === 0) return days === 30 ? "сар" : `${days / 30} сар`;
  return `${days} хоног`;
}
