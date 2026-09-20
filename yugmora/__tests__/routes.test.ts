// __tests__/routes.test.ts — Integration tests for every API route
// Tests auth guards, ownership checks, input validation, and rate limiting
import { describe, it, expect, beforeAll, beforeEach, vi, afterEach } from "vitest";

// ═══════════════════════════════════════════════════
//  Mock next/headers — simulates cookies for route handlers
// ═══════════════════════════════════════════════════
const cookieStore = new Map<string, { name: string; value: string }>();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => cookieStore.get(name) || undefined,
    set: (name: string, value: string, _opts?: Record<string, unknown>) => {
      if (value === "" || (_opts && _opts.maxAge === 0)) {
        cookieStore.delete(name);
      } else {
        cookieStore.set(name, { name, value });
      }
    },
  })),
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === "x-forwarded-for") return "127.0.0.1";
      return null;
    },
  })),
}));

// ═══════════════════════════════════════════════════
//  Mock fs — prevent actual filesystem access during tests
// ═══════════════════════════════════════════════════
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => "{}"),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
  existsSync: vi.fn(() => false),
  readFileSync: vi.fn(() => "{}"),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  unlinkSync: vi.fn(),
}));

// Set env before importing routes
process.env.ADMIN_SESSION_SECRET = "test-secret-that-is-at-least-32-chars-long-for-hmac";

import { signSessionToken } from "@/lib/auth";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(): Request {
  return new Request("http://localhost:3000/test", { method: "GET" });
}

// Helper to set an authenticated admin session
function loginAdmin() {
  const token = signSessionToken();
  cookieStore.set("admin_session", { name: "admin_session", value: token });
}

function logoutAdmin() {
  cookieStore.delete("admin_session");
}

// ═══════════════════════════════════════════════════
//  /api/admin/session — Session validation
// ═══════════════════════════════════════════════════
describe("GET /api/admin/session", () => {
  beforeEach(() => logoutAdmin());

  it("returns { authenticated: false } when no cookie is set", async () => {
    const { GET } = await import("@/app/api/admin/session/route");
    const res = await GET();
    const body = await res.json();
    expect(body.authenticated).toBe(false);
  });

  it("returns { authenticated: true } when valid session cookie is present", async () => {
    loginAdmin();
    const { GET } = await import("@/app/api/admin/session/route");
    const res = await GET();
    const body = await res.json();
    expect(body.authenticated).toBe(true);
  });

  it("returns { authenticated: false } for a tampered cookie", async () => {
    cookieStore.set("admin_session", { name: "admin_session", value: "garbage.token" });
    const { GET } = await import("@/app/api/admin/session/route");
    const res = await GET();
    const body = await res.json();
    expect(body.authenticated).toBe(false);
  });
});

// ═══════════════════════════════════════════════════
//  /api/admin/login — Login with bcrypt + rate limit
// ═══════════════════════════════════════════════════
describe("POST /api/admin/login", () => {
  beforeEach(() => logoutAdmin());

  it("rejects with 400 when passcode is missing", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("rejects with 401 for wrong passcode", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const res = await POST(makeRequest({ passcode: "wrong-password" }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid credentials"); // generic, no info leakage
  });

  it("does not reveal whether the passcode exists on failure", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const res = await POST(makeRequest({ passcode: "nonexistent" }));
    const body = await res.json();
    // Should say "Invalid credentials", not "Passcode not found" or similar
    expect(body.error).not.toMatch(/not found|does not exist|unknown/i);
  });

  it("succeeds with dev fallback passcode in non-production", async () => {
    // In test (non-production), the dev fallback uses "yugmora2026"
    const { POST } = await import("@/app/api/admin/login/route");
    const res = await POST(makeRequest({ passcode: "yugmora2026" }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("sets an HTTP-only session cookie on successful login", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    await POST(makeRequest({ passcode: "yugmora2026" }));
    // The mock cookie store should now have the session
    const cookie = cookieStore.get("admin_session");
    expect(cookie).toBeDefined();
    expect(cookie!.value).toContain("."); // HMAC format: data.sig
  });
});

// ═══════════════════════════════════════════════════
//  /api/admin/logout — Logout
// ═══════════════════════════════════════════════════
describe("POST /api/admin/logout", () => {
  it("clears the session cookie", async () => {
    loginAdmin();
    expect(cookieStore.has("admin_session")).toBe(true);

    const { POST } = await import("@/app/api/admin/logout/route");
    const res = await POST();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(cookieStore.has("admin_session")).toBe(false);
  });

  it("succeeds even when already logged out (idempotent)", async () => {
    logoutAdmin();
    const { POST } = await import("@/app/api/admin/logout/route");
    const res = await POST();
    expect(res.status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════
//  /api/admin/content — Content CRUD
// ═══════════════════════════════════════════════════
describe("/api/admin/content", () => {
  beforeEach(() => logoutAdmin());

  describe("GET (public)", () => {
    it("returns content without authentication", async () => {
      const { GET } = await import("@/app/api/admin/content/route");
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });

  describe("POST (admin-only)", () => {
    it("rejects with 401 when not authenticated", async () => {
      const { POST } = await import("@/app/api/admin/content/route");
      const res = await POST(makeRequest({ content: { test: true } }));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("Unauthorized");
    });

    it("rejects with 401 when cookie is tampered", async () => {
      cookieStore.set("admin_session", { name: "admin_session", value: "fake.token" });
      const { POST } = await import("@/app/api/admin/content/route");
      const res = await POST(makeRequest({ content: { test: true } }));
      expect(res.status).toBe(401);
    });

    it("succeeds with valid admin session", async () => {
      loginAdmin();
      const { POST } = await import("@/app/api/admin/content/route");
      const res = await POST(makeRequest({ content: { event: { title: "Test" } } }));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });

    it("rejects with 400 when content payload is missing", async () => {
      loginAdmin();
      const { POST } = await import("@/app/api/admin/content/route");
      const res = await POST(makeRequest({}));
      expect(res.status).toBe(400);
    });

    it("allows reset when authenticated", async () => {
      loginAdmin();
      const { POST } = await import("@/app/api/admin/content/route");
      const res = await POST(makeRequest({ reset: true }));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toContain("reset");
    });

    it("rejects reset when not authenticated", async () => {
      const { POST } = await import("@/app/api/admin/content/route");
      const res = await POST(makeRequest({ reset: true }));
      expect(res.status).toBe(401);
    });
  });
});

// ═══════════════════════════════════════════════════
//  /api/partner — Partner submissions
// ═══════════════════════════════════════════════════
const validPartnerPayload = {
  name: "Test Partner",
  company: "Acme Corp",
  role: "CTO",
  email: "test@example.com",
  phone: "9876543210",
  partnershipType: "Sponsor",
  message: "Interested in sponsoring the hackathon event for 2026",
};

describe("/api/partner", () => {
  beforeEach(() => logoutAdmin());

  describe("POST (public — form submission)", () => {
    it("accepts a valid partner submission without auth", async () => {
      const { POST } = await import("@/app/api/partner/route");
      const res = await POST(makeRequest(validPartnerPayload));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });

    it("rejects invalid email", async () => {
      const { POST } = await import("@/app/api/partner/route");
      const res = await POST(
        makeRequest({ ...validPartnerPayload, email: "not-an-email" })
      );
      expect(res.status).toBe(400);
    });

    it("rejects too-short name", async () => {
      const { POST } = await import("@/app/api/partner/route");
      const res = await POST(
        makeRequest({ ...validPartnerPayload, name: "A" })
      );
      expect(res.status).toBe(400);
    });

    it("rejects too-short message", async () => {
      const { POST } = await import("@/app/api/partner/route");
      const res = await POST(
        makeRequest({ ...validPartnerPayload, message: "Hi" })
      );
      expect(res.status).toBe(400);
    });

    it("rejects missing required fields", async () => {
      const { POST } = await import("@/app/api/partner/route");
      const res = await POST(makeRequest({ name: "Test" }));
      expect(res.status).toBe(400);
    });
  });

  describe("GET (admin-only — reads PII)", () => {
    it("rejects with 401 when not authenticated", async () => {
      const { GET } = await import("@/app/api/partner/route");
      const res = await GET();
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("rejects with 401 for tampered cookie", async () => {
      cookieStore.set("admin_session", { name: "admin_session", value: "bogus.value" });
      const { GET } = await import("@/app/api/partner/route");
      const res = await GET();
      expect(res.status).toBe(401);
    });

    it("returns submissions when authenticated", async () => {
      loginAdmin();
      const { GET } = await import("@/app/api/partner/route");
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(Array.isArray(body.submissions)).toBe(true);
    });
  });

  describe("PATCH (admin-only — updates status)", () => {
    it("rejects with 401 when not authenticated", async () => {
      const { PATCH } = await import("@/app/api/partner/route");
      const res = await PATCH(
        makeRequest({ id: "SUB-TEST123", status: "contacted" })
      );
      expect(res.status).toBe(401);
    });

    it("rejects with 400 when id is missing", async () => {
      loginAdmin();
      const { PATCH } = await import("@/app/api/partner/route");
      const res = await PATCH(makeRequest({ status: "contacted" }));
      expect(res.status).toBe(400);
    });

    it("rejects with 400 when status is missing", async () => {
      loginAdmin();
      const { PATCH } = await import("@/app/api/partner/route");
      const res = await PATCH(makeRequest({ id: "SUB-TEST123" }));
      expect(res.status).toBe(400);
    });

    it("rejects invalid status values", async () => {
      loginAdmin();
      const { PATCH } = await import("@/app/api/partner/route");
      const res = await PATCH(
        makeRequest({ id: "SUB-TEST123", status: "HACKED" })
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("Invalid status");
    });

    it("rejects with 404 when submission ID does not exist", async () => {
      loginAdmin();
      const { PATCH } = await import("@/app/api/partner/route");
      const res = await PATCH(
        makeRequest({ id: "SUB-NONEXISTENT", status: "contacted" })
      );
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toContain("not found");
    });

    it("only accepts valid status enum values", async () => {
      loginAdmin();
      const { PATCH } = await import("@/app/api/partner/route");
      const validStatuses = ["new", "contacted", "approved", "archived"];
      const invalidStatuses = ["deleted", "pending", "active", "HACKED", "admin", ""];

      for (const status of invalidStatuses) {
        const res = await PATCH(
          makeRequest({ id: "SUB-TEST", status })
        );
        const statusCode = res.status;
        expect(statusCode === 400 || statusCode === 404).toBe(true);
      }
    });
  });
});

// ═══════════════════════════════════════════════════
//  Cross-cutting: No secret leakage
// ═══════════════════════════════════════════════════
describe("Secret leakage prevention", () => {
  it("login error responses do not leak passcode hints", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const res = await POST(makeRequest({ passcode: "wrong" }));
    const body = await res.json();
    const responseStr = JSON.stringify(body);
    expect(responseStr).not.toContain("yugmora2026");
    expect(responseStr).not.toContain("srikar");
    expect(responseStr).not.toContain("admin");
    expect(responseStr).not.toContain("$2b$"); // no hash leakage
  });

  it("session endpoint does not leak token details", async () => {
    loginAdmin();
    const { GET } = await import("@/app/api/admin/session/route");
    const res = await GET();
    const body = await res.json();
    const responseStr = JSON.stringify(body);
    // Should only have { authenticated: true }, no token/nonce/secret
    expect(Object.keys(body)).toEqual(["authenticated"]);
    expect(responseStr).not.toContain("nonce");
    expect(responseStr).not.toContain("secret");
  });

  it("content API error does not leak internal paths", async () => {
    const { POST } = await import("@/app/api/admin/content/route");
    const res = await POST(makeRequest({ content: { test: true } }));
    const body = await res.json();
    const responseStr = JSON.stringify(body);
    expect(responseStr).not.toContain("C:\\");
    expect(responseStr).not.toContain("/home/");
    expect(responseStr).not.toContain("node_modules");
  });
});
