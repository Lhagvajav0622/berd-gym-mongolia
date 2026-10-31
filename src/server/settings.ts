import "server-only";
import { sql } from "drizzle-orm";
import { db, schema } from "./db";
import type { Rules } from "./membership";

/** Admin-editable settings with their defaults. */
export const SETTING_DEFAULTS = {
  maxPauses: 3,
  lockerCount: 16,
  lockerMonthlyPriceMnt: 30000,
  /** Auto-start a membership N days after payment if never scanned. null = never. */
  activationDeadlineDays: null as number | null,
  refundNotice:
    "Төлбөр төлсний дараа буцаан олгох боломжгүй. Төлбөр төлөхөөсөө өмнө заалны зураг болон тоноглолтой сайтар танилцана уу.",
  promoActive: false,
  promoTag: "Шинэ жил",
  promoText: "Бүх багцад хямдрал",
};

export type Settings = typeof SETTING_DEFAULTS;
export type SettingKey = keyof Settings;

export async function getSettings(): Promise<Settings> {
  const rows = await db.select().from(schema.settings);
  const out: Record<string, unknown> = { ...SETTING_DEFAULTS };
  for (const r of rows) if (r.key in SETTING_DEFAULTS) out[r.key] = r.value;
  return out as Settings;
}

export async function saveSettings(values: Partial<Settings>) {
  const entries = Object.entries(values).filter(([k]) => k in SETTING_DEFAULTS);
  if (!entries.length) return;
  await db
    .insert(schema.settings)
    .values(entries.map(([key, value]) => ({ key, value: value as unknown })))
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { value: sql`excluded.value`, updatedAt: new Date() },
    });
}

export function rulesFrom(s: Settings): Rules {
  return { maxPauses: s.maxPauses, activationDeadlineDays: s.activationDeadlineDays };
}
