import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

beforeAll(() => {
  process.env.BETTER_AUTH_SECRET = "test-secret-0123456789";
});

describe("entry QR token", async () => {
  const { makeEntryToken, readEntryToken } = await import("./qr-token");

  it("round-trips a fresh token", () => {
    const { token } = makeEntryToken("user-1");
    expect(readEntryToken(token)).toEqual({ ok: true, userId: "user-1" });
  });

  it("rejects an expired token (screenshot sent later)", () => {
    const { token } = makeEntryToken("user-1", Date.now() - 6 * 60_000);
    expect(readEntryToken(token)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects a token edited to another user", () => {
    const { token } = makeEntryToken("user-1");
    const forged = token.replace("user-1", "user-2");
    expect(readEntryToken(forged)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects random QR codes", () => {
    expect(readEntryToken("https://example.com").ok).toBe(false);
    expect(readEntryToken("BG1.a.b").ok).toBe(false);
  });
});
