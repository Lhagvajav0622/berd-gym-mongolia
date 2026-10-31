/**
 * Membership day rules. Pure functions, no database, so they are easy to test.
 *
 * - Days start counting on the first QR scan at reception (activatedOn),
 *   not on payment.
 * - A paused membership does not lose days: the end date moves forward for
 *   every paused day. Pause length is unlimited; the number of pauses per
 *   membership is limited (setting maxPauses, default 3).
 * - If the member already entered the gym today, a pause starts tomorrow,
 *   so today's visit is not refunded.
 * - All days are Ulaanbaatar calendar days, as "YYYY-MM-DD".
 */

export const TZ = "Asia/Ulaanbaatar";

export type Day = string; // YYYY-MM-DD

export function todayUB(now: Date = new Date()): Day {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function toUTC(d: Day): number {
  const [y, m, day] = d.split("-").map(Number);
  return Date.UTC(y, m - 1, day);
}

export function addDays(d: Day, n: number): Day {
  return new Date(toUTC(d) + n * 86_400_000).toISOString().slice(0, 10);
}

/** b − a in whole days. */
export function diffDays(a: Day, b: Day): number {
  return Math.round((toUTC(b) - toUTC(a)) / 86_400_000);
}

export type MembershipFields = {
  status: "pending_payment" | "paid" | "cancelled";
  durationDays: number;
  paidAt: Date | null;
  activatedOn: Day | null;
  pausedFrom: Day | null;
  pausedDays: number;
  pauseCount: number;
  adjustDays: number;
};

export type Phase =
  | "pending_payment"
  | "cancelled"
  | "not_started"
  | "active"
  | "paused"
  | "expired";

export type MembershipState = {
  phase: Phase;
  startOn: Day | null;
  /** Last day the member may enter (inclusive). */
  endOn: Day | null;
  /** Days left including today; full duration before the first scan. */
  daysLeft: number;
  pausesLeft: number;
};

export type Rules = {
  maxPauses: number;
  /** Auto-start the membership this many days after payment, if never scanned. Null = never. */
  activationDeadlineDays: number | null;
};

export const DEFAULT_RULES: Rules = { maxPauses: 3, activationDeadlineDays: null };

export function effectiveStart(m: MembershipFields, today: Day, rules: Rules): Day | null {
  if (m.activatedOn) return m.activatedOn;
  if (rules.activationDeadlineDays != null && m.paidAt) {
    const auto = addDays(todayUB(m.paidAt), rules.activationDeadlineDays);
    if (diffDays(auto, today) >= 0) return auto;
  }
  return null;
}

export function membershipState(m: MembershipFields, today: Day, rules: Rules = DEFAULT_RULES): MembershipState {
  const pausesLeft = Math.max(0, rules.maxPauses - m.pauseCount);
  if (m.status === "pending_payment")
    return { phase: "pending_payment", startOn: null, endOn: null, daysLeft: m.durationDays, pausesLeft };
  if (m.status === "cancelled")
    return { phase: "cancelled", startOn: null, endOn: null, daysLeft: 0, pausesLeft };

  const startOn = effectiveStart(m, today, rules);
  if (!startOn)
    return { phase: "not_started", startOn: null, endOn: null, daysLeft: m.durationDays + m.adjustDays, pausesLeft };

  const runningPause = m.pausedFrom ? Math.max(0, diffDays(m.pausedFrom, today)) : 0;
  const endOn = addDays(startOn, m.durationDays - 1 + m.pausedDays + m.adjustDays + runningPause);
  const left = diffDays(today, endOn) + 1;

  if (m.pausedFrom) {
    // While paused the end date moves with today, so days left stay frozen.
    return { phase: "paused", startOn, endOn, daysLeft: Math.max(0, left), pausesLeft };
  }
  if (left <= 0) return { phase: "expired", startOn, endOn, daysLeft: 0, pausesLeft };
  return { phase: "active", startOn, endOn, daysLeft: left, pausesLeft };
}

export class RuleError extends Error {}

/** Returns the fields to update when the member pauses. */
export function pauseUpdate(
  m: MembershipFields,
  today: Day,
  enteredToday: boolean,
  rules: Rules = DEFAULT_RULES,
): Pick<MembershipFields, "pausedFrom" | "pauseCount"> {
  const s = membershipState(m, today, rules);
  if (s.phase !== "active") throw new RuleError("Зөвхөн идэвхтэй багцыг зогсооно.");
  if (s.pausesLeft <= 0) throw new RuleError(`Зогсоох эрх дууссан (${rules.maxPauses} удаа).`);
  return {
    pausedFrom: enteredToday ? addDays(today, 1) : today,
    pauseCount: m.pauseCount + 1,
  };
}

/** Returns the fields to update when the member resumes. */
export function resumeUpdate(m: MembershipFields, today: Day): Pick<MembershipFields, "pausedFrom" | "pausedDays"> {
  if (!m.pausedFrom) throw new RuleError("Багц зогссон байдалгүй байна.");
  return {
    pausedFrom: null,
    pausedDays: m.pausedDays + Math.max(0, diffDays(m.pausedFrom, today)),
  };
}

/** Locker months for a package: 30 days = 1 month, rounded up. */
export function lockerMonths(durationDays: number): number {
  return Math.max(1, Math.ceil(durationDays / 30));
}

export const PHASE_LABEL: Record<Phase, string> = {
  pending_payment: "Төлбөр хүлээгдэж байна",
  cancelled: "Цуцлагдсан",
  not_started: "Эхлээгүй",
  active: "Идэвхтэй",
  paused: "Зогсоосон",
  expired: "Дууссан",
};
