import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Member entry QR: "BG1.<userId>.<expiresAtSeconds>.<signature>".
 * Signed with BETTER_AUTH_SECRET and valid for a few minutes, so a screenshot
 * sent to a friend stops working. The member page refreshes it automatically.
 */
const TTL_SECONDS = 5 * 60;

function secret() {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s) throw new Error("BETTER_AUTH_SECRET not set");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update("qr:" + payload).digest("base64url").slice(0, 22);
}

export function makeEntryToken(userId: string, now = Date.now()) {
  const exp = Math.floor(now / 1000) + TTL_SECONDS;
  const payload = `${userId}.${exp}`;
  return { token: `BG1.${payload}.${sign(payload)}`, expiresAt: exp * 1000 };
}

export type TokenCheck = { ok: true; userId: string } | { ok: false; reason: "invalid" | "expired" };

export function readEntryToken(token: string, now = Date.now()): TokenCheck {
  const parts = token.trim().split(".");
  if (parts.length !== 4 || parts[0] !== "BG1") return { ok: false, reason: "invalid" };
  const [, userId, expStr, sig] = parts;
  const expected = sign(`${userId}.${expStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "invalid" };
  if (Number(expStr) * 1000 < now) return { ok: false, reason: "expired" };
  return { ok: true, userId };
}

/** Signature for the QPay callback URL so random calls are ignored cheaply. */
export function callbackSig(paymentId: string) {
  return createHmac("sha256", secret()).update("qpay:" + paymentId).digest("base64url").slice(0, 22);
}
