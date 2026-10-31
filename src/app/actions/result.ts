import { RuleError } from "@/server/membership";
import { HttpError } from "@/server/session";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

/** Runs a server action body and turns known errors into messages for the UI. */
export async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (e) {
    if (e instanceof RuleError || e instanceof HttpError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Алдаа гарлаа. Дахин оролдоно уу." };
  }
}
