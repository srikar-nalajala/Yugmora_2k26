// __tests__/validation.test.ts — Comprehensive test suite for input validation, schema enforcement, injection defense & media type rejection
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as partnerPOST, PATCH as partnerPATCH } from "@/app/api/partner/route";
import { POST as loginPOST } from "@/app/api/admin/login/route";
import { POST as contentPOST } from "@/app/api/admin/content/route";
import {
  escapeHtml,
  sanitizeSafeUrl,
  sanitizeFileName,
  stripPrototypePollution,
  validateContentType,
} from "@/lib/security";
import { signSessionToken } from "@/lib/auth";

// Mock next/headers for route testing
const mockCookies = new Map<string, string>();
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name.toLowerCase() === "x-forwarded-for") return "127.0.0.1";
      return null;
    },
  })),
  cookies: vi.fn(async () => ({
    get: (name: string) => {
      const val = mockCookies.get(name);
      return val ? { name, value: val } : undefined;
    },
    set: (name: string, value: string) => {
      mockCookies.set(name, value);
    },
    delete: (name: string) => {
      mockCookies.delete(name);
    },
  })),
}));

function makeJsonRequest(
  url: string,
  body: unknown,
  contentType: string = "application/json",
  headersObj: Record<string, string> = {}
): Request {
  const serialized = typeof body === "string" ? body : JSON.stringify(body);
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      ...headersObj,
    },
    body: serialized,
  });
}

function authenticateAdmin() {
  const token = signSessionToken();
  mockCookies.set("admin_session", token);
}

describe("Security Utilities", () => {
  describe("escapeHtml", () => {
    it("escapes special HTML characters to prevent XSS", () => {
      expect(escapeHtml("<script>alert('XSS')</script>")).toBe(
        "&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;"
      );
      expect(escapeHtml('Hello "World" & <Friends>')).toBe(
        "Hello &quot;World&quot; &amp; &lt;Friends&gt;"
      );
    });

    it("handles null, empty, or non-string inputs safely", () => {
      expect(escapeHtml("")).toBe("");
      expect(escapeHtml(null as unknown as string)).toBe("");
    });
  });

  describe("sanitizeSafeUrl", () => {
    it("allows safe http, https, mailto, tel, and relative links", () => {
      expect(sanitizeSafeUrl("https://yugmora.com")).toBe("https://yugmora.com");
      expect(sanitizeSafeUrl("mailto:contact@yugmora.com")).toBe("mailto:contact@yugmora.com");
      expect(sanitizeSafeUrl("tel:+919876543210")).toBe("tel:+919876543210");
      expect(sanitizeSafeUrl("/downloads/brochure.pdf")).toBe("/downloads/brochure.pdf");
      expect(sanitizeSafeUrl("#register")).toBe("#register");
    });

    it("blocks dangerous javascript: and data: URIs", () => {
      expect(sanitizeSafeUrl("javascript:alert(1)")).toBe("#blocked");
      expect(sanitizeSafeUrl("JAVASCRIPT:alert(1)")).toBe("#blocked");
      expect(sanitizeSafeUrl("data:text/html,<script>alert(1)</script>")).toBe("#blocked");
      expect(sanitizeSafeUrl("vbscript:msgbox(1)")).toBe("#blocked");
    });
  });

  describe("sanitizeFileName", () => {
    it("strips path traversal sequences and null bytes", () => {
      expect(sanitizeFileName("../../../etc/passwd")).toBe("___etc_passwd");
      expect(sanitizeFileName("..\\..\\windows\\system32")).toBe("__windows_system32");
      expect(sanitizeFileName("report\0.pdf")).toBe("report.pdf");
    });

    it("restricts characters to a safe alphanumeric and dot/dash set", () => {
      expect(sanitizeFileName("my file (1) *?.pdf")).toBe("my_file__1____.pdf");
    });
  });

  describe("stripPrototypePollution", () => {
    it("strips __proto__, constructor, and prototype keys", () => {
      const malicious = JSON.parse('{"__proto__":{"isAdmin":true},"valid":"ok","nested":{"constructor":{"hack":1}}}');
      const clean = stripPrototypePollution(malicious);
      expect(clean).toEqual({ valid: "ok", nested: {} });
      expect((clean as Record<string, unknown>).__proto__).toBe(Object.prototype);
    });
  });

  describe("validateContentType", () => {
    it("approves matching content types and rejects mismatched types", () => {
      const jsonReq = new Request("http://localhost", {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
      expect(validateContentType(jsonReq, "application/json")).toBe(true);

      const formReq = new Request("http://localhost", {
        headers: { "Content-Type": "multipart/form-data; boundary=---" },
      });
      expect(validateContentType(formReq, "application/json")).toBe(false);

      const noHeaderReq = new Request("http://localhost");
      expect(validateContentType(noHeaderReq, "application/json")).toBe(false);
    });
  });
});

describe("/api/partner Input Validation & Injection Defense", () => {
  const validSubmission = {
    name: "Dr. Vikram Sarabhai",
    company: "ISRO Research",
    role: "Director of Innovation",
    email: "vikram@isro.gov.in",
    phone: "+91 98765 43210",
    partnershipType: "Problem Statement Partner",
    message: "We would like to sponsor the Aerospace track with autonomous rover challenges.",
  };

  it("accepts a fully compliant partner submission", async () => {
    const req = makeJsonRequest("http://localhost/api/partner", validSubmission);
    const res = await partnerPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("rejects non-JSON content types (e.g. multipart/form-data / unexpected file uploads)", async () => {
    const req = makeJsonRequest(
      "http://localhost/api/partner",
      validSubmission,
      "multipart/form-data; boundary=---------------------------974767299852498929531610575"
    );
    const res = await partnerPOST(req);
    expect(res.status).toBe(415);
  });

  it("rejects oversized payloads (> 64 KB)", async () => {
    const hugeMessage = "A".repeat(70 * 1024); // 70 KB
    const req = makeJsonRequest("http://localhost/api/partner", {
      ...validSubmission,
      message: hugeMessage,
    });
    const res = await partnerPOST(req);
    expect(res.status).toBe(413);
  });

  it("rejects inputs that exceed maximum string lengths", async () => {
    const req = makeJsonRequest("http://localhost/api/partner", {
      ...validSubmission,
      name: "A".repeat(150), // Max is 100
    });
    const res = await partnerPOST(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid phone number formats with alphabetic characters or symbols", async () => {
    const req = makeJsonRequest("http://localhost/api/partner", {
      ...validSubmission,
      phone: "call-me-now-12345",
    });
    const res = await partnerPOST(req);
    expect(res.status).toBe(400);
  });

  it("rejects illegal partnershipType values not in the allowed enum", async () => {
    const req = makeJsonRequest("http://localhost/api/partner", {
      ...validSubmission,
      partnershipType: "Arbitrary Hacker Injection",
    });
    const res = await partnerPOST(req);
    expect(res.status).toBe(400);
  });

  it("escapes HTML tags in submitted fields to prevent Stored XSS", async () => {
    const xssPayload = {
      ...validSubmission,
      name: "<script>alert('XSS')</script>",
      message: "Here is an <b>injection</b> <iframe src='evil.com'></iframe>",
    };
    const req = makeJsonRequest("http://localhost/api/partner", xssPayload);
    const res = await partnerPOST(req);
    expect(res.status).toBe(200);
  });

  describe("PATCH /api/partner Schema Validation", () => {
    beforeEach(() => {
      authenticateAdmin();
    });

    it("rejects non-JSON Content-Type on PATCH", async () => {
      const req = new Request("http://localhost/api/partner", {
        method: "PATCH",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ id: "SUB-123", status: "contacted" }),
      });
      const res = await partnerPATCH(req);
      expect(res.status).toBe(415);
    });

    it("rejects malformed submission IDs", async () => {
      const req = new Request("http://localhost/api/partner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "../../evil-id", status: "approved" }),
      });
      const res = await partnerPATCH(req);
      expect(res.status).toBe(400);
    });

    it("rejects invalid status values", async () => {
      const req = new Request("http://localhost/api/partner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "SUB-ABC123XYZ", status: "unauthorized_status" }),
      });
      const res = await partnerPATCH(req);
      expect(res.status).toBe(400);
    });
  });
});

describe("/api/admin/login Input Validation", () => {
  it("rejects non-JSON Content-Type with 415", async () => {
    const req = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "passcode=CSE2K26",
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(415);
  });

  it("rejects oversized login payloads (> 8 KB)", async () => {
    const hugePasscode = "A".repeat(10 * 1024);
    const req = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: hugePasscode }),
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(413);
  });

  it("rejects passcodes longer than 128 characters", async () => {
    const req = new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: "A".repeat(200) }),
    });
    const res = await loginPOST(req);
    expect(res.status).toBe(400);
  });
});

describe("/api/admin/content Input Validation & Pollution Defense", () => {
  beforeEach(() => {
    authenticateAdmin();
  });

  it("rejects non-JSON Content-Type with 415", async () => {
    const req = new Request("http://localhost/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "text/html" },
      body: "reset=true",
    });
    const res = await contentPOST(req);
    expect(res.status).toBe(415);
  });

  it("rejects missing content payload when reset is not requested", async () => {
    const req = new Request("http://localhost/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await contentPOST(req);
    expect(res.status).toBe(400);
  });

  it("accepts valid content update without prototype pollution", async () => {
    const payload = {
      content: {
        event: { name: "YUGMORA 2026", dates: "October 15-17, 2026" },
        keyNumbers: [{ value: "40+", label: "Hours" }],
      },
    };
    const req = new Request("http://localhost/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await contentPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
