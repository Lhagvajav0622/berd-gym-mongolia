import "server-only";
import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db, schema, type Tx } from "./db";
import {
  lockerMonths,
  membershipState,
  pauseUpdate,
  resumeUpdate,
  RuleError,
  todayUB,
  type MembershipState,
  type Rules,
} from "./membership";
import { getSettings, rulesFrom } from "./settings";

export type Membership = typeof schema.memberships.$inferSelect;
export type MembershipView = Membership & { state: MembershipState };

/** Unpaid QPay orders hold their locker this long, then release it. */
const PENDING_HOLD_MS = 30 * 60_000;

export function withState(m: Membership, today: string, rules: Rules): MembershipView {
  return { ...m, state: membershipState(m, today, rules) };
}

export async function listPackages(opts: { activeOnly?: boolean } = {}) {
  const q = db.select().from(schema.packages).orderBy(asc(schema.packages.sortOrder), asc(schema.packages.priceMnt));
  const rows = await q;
  return opts.activeOnly ? rows.filter((p) => p.active) : rows;
}

export async function userMemberships(userId: string, rules: Rules, today = todayUB()) {
  const rows = await db
    .select()
    .from(schema.memberships)
    .where(eq(schema.memberships.userId, userId))
    .orderBy(desc(schema.memberships.createdAt));
  return rows.map((m) => withState(m, today, rules));
}

/**
 * Which membership a visit uses: the running one (active or paused) first,
 * otherwise the oldest paid one that has not started yet.
 */
export function pickForEntry(list: MembershipView[]): MembershipView | null {
  const running = list.find((m) => m.state.phase === "active" || m.state.phase === "paused");
  if (running) return running;
  const waiting = list
    .filter((m) => m.state.phase === "not_started")
    .sort((a, b) => +a.createdAt - +b.createdAt);
  return waiting[0] ?? null;
}

/* ── Lockers ─────────────────────────────────────────────────────────── */

async function lockersInUse(tx: Tx | typeof db, rules: Rules, today = todayUB()): Promise<Map<number, Membership>> {
  const rows = await tx
    .select()
    .from(schema.memberships)
    .where(and(isNotNull(schema.memberships.lockerNumber), inArray(schema.memberships.status, ["pending_payment", "paid"])));
  const used = new Map<number, Membership>();
  for (const m of rows) {
    if (m.status === "pending_payment" && Date.now() - +m.createdAt > PENDING_HOLD_MS) continue;
    const phase = membershipState(m, today, rules).phase;
    if (phase === "expired" || phase === "cancelled") continue;
    used.set(m.lockerNumber!, m);
  }
  return used;
}

export async function lockerOverview() {
  const s = await getSettings();
  const used = await lockersInUse(db, rulesFrom(s));
  const userIds = [...used.values()].map((m) => m.userId);
  const users = userIds.length
    ? await db
        .select({ id: schema.user.id, name: schema.user.name, phone: schema.user.phoneNumber })
        .from(schema.user)
        .where(inArray(schema.user.id, userIds))
    : [];
  const byId = new Map(users.map((u) => [u.id, u]));
  return Array.from({ length: s.lockerCount }, (_, i) => {
    const n = i + 1;
    const m = used.get(n);
    return { number: n, membership: m ?? null, user: m ? byId.get(m.userId) ?? null : null };
  });
}

export async function freeLockerCount() {
  const s = await getSettings();
  const used = await lockersInUse(db, rulesFrom(s));
  let free = 0;
  for (let n = 1; n <= s.lockerCount; n++) if (!used.has(n)) free++;
  return free;
}

/* ── Orders & payments ───────────────────────────────────────────────── */

export async function createOrder(p: { userId: string; packageId: string; withLocker: boolean; method: "qpay" | "cash" }) {
  const s = await getSettings();
  const rules = rulesFrom(s);
  return db.transaction(async (tx) => {
    // Serialize orders so two people can't take the last locker at once.
    await tx.execute(sql`select pg_advisory_xact_lock(4242)`);
    const [pkg] = await tx.select().from(schema.packages).where(eq(schema.packages.id, p.packageId));
    if (!pkg || !pkg.active) throw new RuleError("Багц олдсонгүй.");

    let lockerNumber: number | null = null;
    let lockerPriceMnt = 0;
    if (p.withLocker) {
      if (!pkg.lockerAllowed) throw new RuleError("Энэ багцад шүүгээ авах боломжгүй.");
      const used = await lockersInUse(tx, rules);
      for (let n = 1; n <= s.lockerCount; n++)
        if (!used.has(n)) {
          lockerNumber = n;
          break;
        }
      if (lockerNumber == null) throw new RuleError("Сул шүүгээ үлдээгүй байна.");
      lockerPriceMnt = lockerMonths(pkg.durationDays) * s.lockerMonthlyPriceMnt;
    }

    const [m] = await tx
      .insert(schema.memberships)
      .values({
        userId: p.userId,
        packageId: pkg.id,
        packageName: pkg.name,
        durationDays: pkg.durationDays,
        priceMnt: pkg.priceMnt,
        lockerNumber,
        lockerPriceMnt,
      })
      .returning();
    const [pay] = await tx
      .insert(schema.payments)
      .values({ membershipId: m.id, userId: p.userId, amountMnt: pkg.priceMnt + lockerPriceMnt, method: p.method })
      .returning();
    return { membership: m, payment: pay };
  });
}

/** Idempotent: marks the payment and its membership paid. */
export async function markPaid(paymentId: string, confirmedBy: string | null) {
  return db.transaction(async (tx) => {
    const [pay] = await tx
      .update(schema.payments)
      .set({ status: "paid", paidAt: new Date(), confirmedBy })
      .where(and(eq(schema.payments.id, paymentId), eq(schema.payments.status, "pending")))
      .returning();
    if (!pay) return false;
    await tx
      .update(schema.memberships)
      .set({ status: "paid", paidAt: pay.paidAt })
      .where(and(eq(schema.memberships.id, pay.membershipId), eq(schema.memberships.status, "pending_payment")));
    return true;
  });
}

export async function cancelPayment(paymentId: string) {
  return db.transaction(async (tx) => {
    const [pay] = await tx
      .update(schema.payments)
      .set({ status: "cancelled" })
      .where(and(eq(schema.payments.id, paymentId), eq(schema.payments.status, "pending")))
      .returning();
    if (!pay) return null;
    await tx
      .update(schema.memberships)
      .set({ status: "cancelled", lockerNumber: null })
      .where(and(eq(schema.memberships.id, pay.membershipId), eq(schema.memberships.status, "pending_payment")));
    return pay;
  });
}

/* ── Entry (reception) ───────────────────────────────────────────────── */

export type EntryPreview = {
  user: { id: string; name: string; phone: string | null; hasPhoto: boolean; profileComplete: boolean };
  membership: MembershipView | null;
  enteredToday: number;
  lastEntry: Date | null;
  canEnter: boolean;
  message: string;
  /** Cash orders waiting at the desk: take the money, confirm, then admit. */
  pendingCash: { id: string; amountMnt: number; code: string; packageName: string }[];
};

export async function entryPreview(userId: string): Promise<EntryPreview | null> {
  const s = await getSettings();
  const rules = rulesFrom(s);
  const today = todayUB();
  const [u] = await db.select().from(schema.user).where(eq(schema.user.id, userId));
  if (!u) return null;
  const [photo] = await db
    .select({ id: schema.memberPhotos.userId })
    .from(schema.memberPhotos)
    .where(eq(schema.memberPhotos.userId, userId));
  const list = await userMemberships(userId, rules, today);
  const m = pickForEntry(list);
  const visits = await db
    .select({ createdAt: schema.checkins.createdAt, day: schema.checkins.day })
    .from(schema.checkins)
    .where(eq(schema.checkins.userId, userId))
    .orderBy(desc(schema.checkins.createdAt))
    .limit(20);
  const enteredToday = visits.filter((v) => v.day === today).length;

  let canEnter = false;
  let message: string;
  if (!m) {
    const pending = list.find((x) => x.state.phase === "pending_payment");
    message = pending ? "Төлбөр төлөгдөөгүй байна." : "Хүчинтэй багц байхгүй.";
  } else if (m.state.phase === "not_started") {
    canEnter = true;
    message = `Анхны орох. Өнөөдрөөс ${m.durationDays + m.adjustDays} хоног эхэлнэ.`;
  } else if (m.state.phase === "paused") {
    canEnter = true;
    message = "Багц зогссон байна. Оруулбал автоматаар үргэлжилнэ.";
  } else {
    canEnter = true;
    message = `${m.state.daysLeft} хоног үлдсэн.`;
  }
  if (!photo) message += " Царайны зураг байхгүй.";
  const cash = await db
    .select({ id: schema.payments.id, amountMnt: schema.payments.amountMnt, packageName: schema.memberships.packageName })
    .from(schema.payments)
    .innerJoin(schema.memberships, eq(schema.memberships.id, schema.payments.membershipId))
    .where(and(eq(schema.payments.userId, userId), eq(schema.payments.status, "pending"), eq(schema.payments.method, "cash")));

  return {
    user: { id: u.id, name: u.name, phone: u.phoneNumber, hasPhoto: !!photo, profileComplete: u.profileComplete },
    membership: m,
    enteredToday,
    lastEntry: visits[0]?.createdAt ?? null,
    canEnter,
    message,
    pendingCash: cash.map((c) => ({ ...c, code: c.id.slice(0, 8).toUpperCase() })),
  };
}

export async function confirmEntry(userId: string, staffId: string) {
  const s = await getSettings();
  const rules = rulesFrom(s);
  const today = todayUB();
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}))`);
    const rows = await tx.select().from(schema.memberships).where(eq(schema.memberships.userId, userId));
    const m = pickForEntry(rows.map((r) => withState(r, today, rules)));
    if (!m) throw new RuleError("Хүчинтэй багц байхгүй.");

    const patch: Partial<Membership> = {};
    if (!m.activatedOn) patch.activatedOn = m.state.startOn ?? today;
    if (m.pausedFrom) Object.assign(patch, resumeUpdate(m, today));
    if (Object.keys(patch).length)
      await tx.update(schema.memberships).set(patch).where(eq(schema.memberships.id, m.id));

    const [c] = await tx.insert(schema.checkins).values({ userId, membershipId: m.id, day: today, staffId }).returning();
    return { checkin: c, firstEntry: !m.activatedOn };
  });
}

/* ── Pause ───────────────────────────────────────────────────────────── */

export async function pauseMembership(userId: string, membershipId: string) {
  const rules = rulesFrom(await getSettings());
  const today = todayUB();
  return db.transaction(async (tx) => {
    const [m] = await tx
      .select()
      .from(schema.memberships)
      .where(and(eq(schema.memberships.id, membershipId), eq(schema.memberships.userId, userId)));
    if (!m) throw new RuleError("Багц олдсонгүй.");
    const [visit] = await tx
      .select({ id: schema.checkins.id })
      .from(schema.checkins)
      .where(and(eq(schema.checkins.membershipId, m.id), eq(schema.checkins.day, today)))
      .limit(1);
    const patch = pauseUpdate(m, today, !!visit, rules);
    await tx.update(schema.memberships).set(patch).where(eq(schema.memberships.id, m.id));
  });
}

export async function resumeMembership(userId: string, membershipId: string) {
  const today = todayUB();
  const [m] = await db
    .select()
    .from(schema.memberships)
    .where(and(eq(schema.memberships.id, membershipId), eq(schema.memberships.userId, userId)));
  if (!m) throw new RuleError("Багц олдсонгүй.");
  await db.update(schema.memberships).set(resumeUpdate(m, today)).where(eq(schema.memberships.id, m.id));
}
