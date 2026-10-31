import { describe, expect, it } from "vitest";
import {
  addDays,
  diffDays,
  lockerMonths,
  membershipState,
  pauseUpdate,
  resumeUpdate,
  RuleError,
  todayUB,
  type MembershipFields,
} from "./membership";

const base: MembershipFields = {
  status: "paid",
  durationDays: 30,
  paidAt: new Date("2026-11-01T02:00:00Z"),
  activatedOn: null,
  pausedFrom: null,
  pausedDays: 0,
  pauseCount: 0,
  adjustDays: 0,
};

describe("dates", () => {
  it("uses Ulaanbaatar day (UTC+8)", () => {
    expect(todayUB(new Date("2026-10-31T17:00:00Z"))).toBe("2026-11-01");
    expect(todayUB(new Date("2026-10-31T15:59:00Z"))).toBe("2026-10-31");
  });
  it("adds and diffs days across months", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(diffDays("2026-11-01", "2026-12-01")).toBe(30);
  });
});

describe("membershipState", () => {
  it("does not count days before the first scan", () => {
    const s = membershipState(base, "2026-11-20");
    expect(s.phase).toBe("not_started");
    expect(s.daysLeft).toBe(30);
  });

  it("counts 30 days from the first scan, inclusive", () => {
    const m = { ...base, activatedOn: "2026-11-05" };
    expect(membershipState(m, "2026-11-05")).toMatchObject({ phase: "active", daysLeft: 30, endOn: "2026-12-04" });
    expect(membershipState(m, "2026-12-04")).toMatchObject({ phase: "active", daysLeft: 1 });
    expect(membershipState(m, "2026-12-05").phase).toBe("expired");
  });

  it("auto-starts after the activation deadline", () => {
    const rules = { maxPauses: 3, activationDeadlineDays: 30 };
    expect(membershipState(base, "2026-11-30", rules).phase).toBe("not_started");
    expect(membershipState(base, "2026-12-01", rules)).toMatchObject({ phase: "active", startOn: "2026-12-01" });
  });

  it("freezes days left while paused", () => {
    const m = { ...base, activatedOn: "2026-11-01", pausedFrom: "2026-11-11", pauseCount: 1 };
    const a = membershipState(m, "2026-11-11");
    const b = membershipState(m, "2026-12-25");
    expect(a.phase).toBe("paused");
    expect(a.daysLeft).toBe(20);
    expect(b.daysLeft).toBe(20);
  });

  it("applies admin adjustments", () => {
    const m = { ...base, activatedOn: "2026-11-01", adjustDays: 5 };
    expect(membershipState(m, "2026-11-01").daysLeft).toBe(35);
  });
});

describe("pause / resume", () => {
  const active = { ...base, activatedOn: "2026-11-01" };

  it("returns the paused days after resume", () => {
    const p = pauseUpdate(active, "2026-11-11", false);
    expect(p).toEqual({ pausedFrom: "2026-11-11", pauseCount: 1 });
    const r = resumeUpdate({ ...active, ...p }, "2026-11-21");
    expect(r).toEqual({ pausedFrom: null, pausedDays: 10 });
    const s = membershipState({ ...active, ...p, ...r }, "2026-11-21");
    expect(s).toMatchObject({ phase: "active", daysLeft: 20, endOn: "2026-12-10" });
  });

  it("does not refund today if the member already entered", () => {
    const p = pauseUpdate(active, "2026-11-11", true);
    expect(p.pausedFrom).toBe("2026-11-12");
    const r = resumeUpdate({ ...active, ...p }, "2026-11-11");
    expect(r.pausedDays).toBe(0);
  });

  it("allows only maxPauses pauses", () => {
    const used = { ...active, pauseCount: 3 };
    expect(() => pauseUpdate(used, "2026-11-11", false)).toThrow(RuleError);
  });

  it("cannot pause before the first scan or after expiry", () => {
    expect(() => pauseUpdate(base, "2026-11-11", false)).toThrow(RuleError);
    expect(() => pauseUpdate(active, "2027-01-01", false)).toThrow(RuleError);
  });
});

describe("lockerMonths", () => {
  it("rounds up to whole months", () => {
    expect(lockerMonths(30)).toBe(1);
    expect(lockerMonths(31)).toBe(2);
    expect(lockerMonths(90)).toBe(3);
    expect(lockerMonths(7)).toBe(1);
  });
});
