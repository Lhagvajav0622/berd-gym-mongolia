import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "./db";
import { normalizePhone } from "./phone";
import { otpMessage, sendSms } from "./sms";

const OTP_COOLDOWN_MS = 60_000;
const OTP_PER_HOUR = 5;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.PUBLIC_URL,
  // Vercel preview URLs must be trusted too, or sign-out is refused there.
  trustedOrigins: [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
    .filter((h): h is string => !!h)
    .map((h) => `https://${h}`),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 90, // stay logged in 90 days on the phone
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "member" },
      profileComplete: { type: "boolean", input: false, defaultValue: false },
    },
  },
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      phoneNumberValidator: (p) => normalizePhone(p) === p,
      signUpOnVerification: {
        getTempEmail: (p) => `${p}@phone.sparta.local`,
        getTempName: (p) => p,
      },
      async sendOTP({ phoneNumber: phone, code }) {
        // Per-phone limits so nobody can burn the SMS budget.
        const recent = await db
          .select({ createdAt: schema.otpSendLog.createdAt })
          .from(schema.otpSendLog)
          .where(and(eq(schema.otpSendLog.phone, phone), gt(schema.otpSendLog.createdAt, new Date(Date.now() - 3_600_000))));
        const last = recent.reduce((m, r) => Math.max(m, r.createdAt.getTime()), 0);
        if (Date.now() - last < OTP_COOLDOWN_MS)
          throw new APIError("TOO_MANY_REQUESTS", { message: "1 минутын дараа дахин код авна уу." });
        if (recent.length >= OTP_PER_HOUR)
          throw new APIError("TOO_MANY_REQUESTS", { message: "Хэт олон удаа код авсан байна. 1 цагийн дараа оролдоно уу." });
        await db.insert(schema.otpSendLog).values({ phone });
        await sendSms(phone, otpMessage(code));
      },
    }),
    nextCookies(),
  ],
  rateLimit: { enabled: true, window: 60, max: 30 },
});

