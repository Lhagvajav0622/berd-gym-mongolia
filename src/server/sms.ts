import "server-only";

/**
 * SMS sending for OTP codes.
 *
 * SMS_PROVIDER=callpro  → CallPro (MessagePro) API. Set CALLPRO_API_KEY and
 *                         CALLPRO_SENDER (the number/name CallPro gave you).
 *                         CALLPRO_API_URL defaults to https://api.messagepro.mn/send;
 *                         check it against the docs CallPro sends with your key.
 * SMS_PROVIDER unset    → test mode: the code is printed to the server log
 *                         (Vercel → Logs). Never use test mode for real members.
 *
 * Messages are Latin on purpose: one SMS fits 160 Latin chars but only
 * 70 Cyrillic chars, so Latin is cheaper.
 */
export async function sendSms(to: string, text: string): Promise<void> {
  const provider = process.env.SMS_PROVIDER;

  if (!provider) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_TEST_SMS !== "1") {
      throw new Error("SMS_PROVIDER is not configured");
    }
    console.log(`[sms:test] to=${to} text="${text}"`);
    return;
  }

  if (provider === "callpro") {
    const key = process.env.CALLPRO_API_KEY;
    const from = process.env.CALLPRO_SENDER;
    if (!key || !from) throw new Error("CALLPRO_API_KEY / CALLPRO_SENDER not set");
    const base = process.env.CALLPRO_API_URL ?? "https://api.messagepro.mn/send";
    const url = new URL(base);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    url.searchParams.set("text", text);
    const res = await fetch(url, {
      method: "GET",
      headers: { "x-api-key": key },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`CallPro SMS failed: ${res.status} ${body.slice(0, 200)}`);
    }
    return;
  }

  throw new Error(`Unknown SMS_PROVIDER: ${provider}`);
}

export function otpMessage(code: string): string {
  return `BERD GYM: tany batalgaajuulah kod ${code}. 5 minutad huchintei. Busdad bitgii heleerei.`;
}
