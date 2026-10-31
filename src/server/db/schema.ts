import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* ── Better Auth tables (phone-number plugin adds phone fields) ─────────── */

export const userRole = pgEnum("user_role", ["member", "reception", "admin"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
  role: userRole("role").notNull().default("member"),
  /** True once the member has entered their name and face photo. */
  profileComplete: boolean("profile_complete").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ── Gym ──────────────────────────────────────────────────────────────── */

/** Member face photo, shown to reception on every scan. Small JPEG, base64. */
export const memberPhotos = pgTable("member_photos", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  mime: text("mime").notNull(),
  data: text("data").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Membership packages, edited by admin. */
export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  durationDays: integer("duration_days").notNull(),
  priceMnt: integer("price_mnt").notNull(),
  /** Crossed-out price shown next to the real one. */
  oldPriceMnt: integer("old_price_mnt"),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  lockerAllowed: boolean("locker_allowed").notNull().default(true),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const membershipStatus = pgEnum("membership_status", [
  "pending_payment",
  "paid",
  "cancelled",
]);

/**
 * One bought package. Days start counting on the first QR scan (activatedOn),
 * not on payment. Pause/resume shifts the end date. See server/membership.ts.
 */
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    packageId: uuid("package_id").references(() => packages.id, { onDelete: "set null" }),
    /** Snapshot so later package edits don't change bought memberships. */
    packageName: text("package_name").notNull(),
    durationDays: integer("duration_days").notNull(),
    priceMnt: integer("price_mnt").notNull(),
    lockerPriceMnt: integer("locker_price_mnt").notNull().default(0),
    lockerNumber: integer("locker_number"),
    status: membershipStatus("status").notNull().default("pending_payment"),
    paidAt: timestamp("paid_at"),
    /** Calendar day (Ulaanbaatar) of the first check-in. */
    activatedOn: date("activated_on"),
    /** First day not counted while paused; null when not paused. */
    pausedFrom: date("paused_from"),
    pausedDays: integer("paused_days").notNull().default(0),
    pauseCount: integer("pause_count").notNull().default(0),
    /** Days added or removed by admin. */
    adjustDays: integer("adjust_days").notNull().default(0),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("memberships_user_idx").on(t.userId, t.createdAt),
    index("memberships_locker_idx").on(t.lockerNumber),
  ],
);

export const paymentMethod = pgEnum("payment_method", ["qpay", "cash"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "paid", "cancelled"]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amountMnt: integer("amount_mnt").notNull(),
    method: paymentMethod("method").notNull(),
    status: paymentStatus("status").notNull().default("pending"),
    qpayInvoiceId: text("qpay_invoice_id").unique(),
    /** QR image, deeplinks returned by QPay. */
    qpayData: jsonb("qpay_data").$type<{ qrImage?: string; qrText?: string; urls?: { name: string; link: string; logo?: string }[] }>(),
    confirmedBy: text("confirmed_by").references(() => user.id),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("payments_status_idx").on(t.status, t.createdAt)],
);

/** One row per entry into the gym. */
export const checkins = pgTable(
  "checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    membershipId: uuid("membership_id").references(() => memberships.id, { onDelete: "set null" }),
    /** Ulaanbaatar calendar day of the visit. */
    day: date("day").notNull(),
    staffId: text("staff_id").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("checkins_user_day_idx").on(t.userId, t.day),
    index("checkins_day_idx").on(t.day),
  ],
);

/** Hall and equipment photos shown on the site and in the refund notice. */
export const galleryPhotos = pgTable("gallery_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  caption: text("caption"),
  mime: text("mime").notNull(),
  data: text("data").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Admin-editable settings (pause limit, lockers, notice text...). */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const otpSendLog = pgTable(
  "otp_send_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull(),
    ip: text("ip"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("otp_send_phone_idx").on(t.phone, t.createdAt)],
);
