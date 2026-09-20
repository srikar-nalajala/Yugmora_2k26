// __tests__/auth.test.ts — Unit tests for lib/auth.ts (bcrypt, HMAC, rate limiting)
import { describe, it, expect, beforeEach, vi } from "vitest";

// We test the pure functions directly (token signing, rate limiting, bcrypt)
// Cookie functions are tested indirectly via route integration tests

// ═══════════════════════════════════════════════════
//  Mock next/headers so auth.ts can be imported outside Next.js
// ═══════════════════════════════════════════════════
vi.mock("next/headers", () => {
  const store = new Map<string, { value: string }>();
  return {
    cookies: vi.fn(async () => ({
      get: (name: string) => store.get(name) || null,
      set: (name: string, value: string) => {
        if (value === "") {
          store.delete(name);
        } else {
          store.set(name, { value });
        }
      },
    })),
    // expose for tests to seed cookies
    __cookieStore: store,
  };
});

describe("lib/auth — bcrypt password hashing", () => {
  it("hashPasscode returns a bcrypt hash string", async () => {
    const { hashPasscode } = await import("@/lib/auth");
    const hashed = await hashPasscode("test-password");
    expect(hashed).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt format
    expect(hashed.length).toBeGreaterThan(50);
  });

  it("verifyPasscode returns true for correct password", async () => {
    const { hashPasscode, verifyPasscode } = await import("@/lib/auth");
    const hashed = await hashPasscode("yugmora2026");
    const result = await verifyPasscode("yugmora2026", hashed);
    expect(result).toBe(true);
  });

  it("verifyPasscode returns false for wrong password", async () => {
    const { hashPasscode, verifyPasscode } = await import("@/lib/auth");
    const hashed = await hashPasscode("yugmora2026");
    const result = await verifyPasscode("wrong-password", hashed);
    expect(result).toBe(false);
  });

  it("verifyPasscode is case-sensitive", async () => {
    const { hashPasscode, verifyPasscode } = await import("@/lib/auth");
    const hashed = await hashPasscode("Yugmora2026");
    expect(await verifyPasscode("yugmora2026", hashed)).toBe(false);
    expect(await verifyPasscode("Yugmora2026", hashed)).toBe(true);
  });
});

describe("lib/auth — HMAC session tokens", () => {
  it("signSessionToken produces a data.signature format", async () => {
    const { signSessionToken } = await import("@/lib/auth");
    const token = signSessionToken();
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBeGreaterThan(10);
    expect(parts[1].length).toBeGreaterThan(10);
  });

  it("verifySessionToken validates a freshly-signed token", async () => {
    const { signSessionToken, verifySessionToken } = await import("@/lib/auth");
    const token = signSessionToken();
    const payload = verifySessionToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe("admin");
    expect(payload!.exp).toBeGreaterThan(Date.now());
  });

  it("verifySessionToken rejects a tampered token", async () => {
    const { signSessionToken, verifySessionToken } = await import("@/lib/auth");
    const token = signSessionToken();
    // Tamper with the signature
    const tampered = token.slice(0, -1) + (token.endsWith("A") ? "B" : "A");
    const payload = verifySessionToken(tampered);
    expect(payload).toBeNull();
  });

  it("verifySessionToken rejects a tampered payload", async () => {
    const { signSessionToken, verifySessionToken } = await import("@/lib/auth");
    const token = signSessionToken();
    const [data, sig] = token.split(".");
    // Decode, tamper, re-encode
    const decoded = JSON.parse(Buffer.from(data, "base64url").toString());
    decoded.sub = "hacker";
    const tamperedData = Buffer.from(JSON.stringify(decoded)).toString("base64url");
    const payload = verifySessionToken(`${tamperedData}.${sig}`);
    expect(payload).toBeNull();
  });

  it("verifySessionToken rejects an expired token", async () => {
    const { verifySessionToken } = await import("@/lib/auth");
    const { createHmac, randomBytes } = await import("crypto");

    // Manually create an expired token
    const payload = {
      sub: "admin",
      iat: Date.now() - 100000,
      exp: Date.now() - 1000, // expired 1 second ago
      nonce: randomBytes(16).toString("hex"),
    };
    const secret = "dev-fallback-secret-do-not-use-in-production-test";
    const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = createHmac("sha256", secret).update(data).digest("base64url");

    const result = verifySessionToken(`${data}.${sig}`);
    expect(result).toBeNull();
  });

  it("verifySessionToken rejects empty/malformed strings", async () => {
    const { verifySessionToken } = await import("@/lib/auth");
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("no-dot-separator")).toBeNull();
    expect(verifySessionToken("a.b.c")).toBeNull(); // too many parts
    expect(verifySessionToken(".")).toBeNull();
  });

  it("each token has a unique nonce", async () => {
    const { signSessionToken, verifySessionToken } = await import("@/lib/auth");
    const t1 = signSessionToken();
    const t2 = signSessionToken();
    const p1 = verifySessionToken(t1)!;
    const p2 = verifySessionToken(t2)!;
    expect(p1.nonce).not.toBe(p2.nonce);
  });
});

describe("lib/auth — rate limiting", () => {
  beforeEach(() => {
    // Reset rate limit state between tests by using unique IPs
  });

  it("allows the first 5 requests from an IP", async () => {
    const { checkRateLimit } = await import("@/lib/auth");
    const ip = `test-ip-${Date.now()}-first5`;
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(ip);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks the 6th request from the same IP within the window", async () => {
    const { checkRateLimit } = await import("@/lib/auth");
    const ip = `test-ip-${Date.now()}-block6`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip);
    }
    const blocked = checkRateLimit(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("different IPs have independent rate limits", async () => {
    const { checkRateLimit } = await import("@/lib/auth");
    const ip1 = `test-ip-${Date.now()}-independent1`;
    const ip2 = `test-ip-${Date.now()}-independent2`;

    // Exhaust ip1's limit
    for (let i = 0; i < 5; i++) checkRateLimit(ip1);
    expect(checkRateLimit(ip1).allowed).toBe(false);

    // ip2 should still be allowed
    expect(checkRateLimit(ip2).allowed).toBe(true);
  });
});
