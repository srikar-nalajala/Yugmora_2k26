// __tests__/production.test.ts — Test suite for production security headers, HTTPS redirection, CORS, and logging
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import nextConfig from "@/next.config";
import { middleware } from "@/middleware";
import { logSecurityEvent } from "@/lib/logger";
import { NextRequest } from "next/server";

describe("Production Security Headers in next.config.ts", () => {
  it("disables the X-Powered-By header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("exports comprehensive security headers for all routes", async () => {
    expect(typeof nextConfig.headers).toBe("function");
    const headerRules = await nextConfig.headers!();
    expect(headerRules.length).toBeGreaterThan(0);

    const rootRule = headerRules.find((r) => r.source === "/(.*)");
    expect(rootRule).toBeDefined();

    const headersMap = new Map(rootRule!.headers.map((h) => [h.key, h.value]));

    // HSTS (HTTP Strict Transport Security)
    expect(headersMap.get("Strict-Transport-Security")).toBe(
      "max-age=63072000; includeSubDomains; preload"
    );

    // Clickjacking defense
    expect(headersMap.get("X-Frame-Options")).toBe("DENY");

    // MIME sniffing defense
    expect(headersMap.get("X-Content-Type-Options")).toBe("nosniff");

    // Referrer policy
    expect(headersMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

    // Permissions policy
    expect(headersMap.get("Permissions-Policy")).toContain("camera=()");
    expect(headersMap.get("Permissions-Policy")).toContain("microphone=()");

    // Content Security Policy
    const csp = headersMap.get("Content-Security-Policy");
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
  });
});

describe("Structured Security Logger (lib/logger.ts)", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    infoSpy.mockRestore();
  });

  it("logs AUTH_FAILURE at WARN level with IP and reason", () => {
    logSecurityEvent({
      type: "AUTH_FAILURE",
      ip: "192.168.1.50",
      path: "/api/admin/login",
      method: "POST",
      reason: "invalid_passcode",
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const logCall = warnSpy.mock.calls[0][0];
    expect(logCall).toContain("[SECURITY_AUDIT]");
    expect(logCall).toContain('"type":"AUTH_FAILURE"');
    expect(logCall).toContain('"ip":"192.168.1.50"');
    expect(logCall).toContain('"reason":"invalid_passcode"');
  });

  it("redacts sensitive fields like passcodes or tokens from metadata", () => {
    logSecurityEvent({
      type: "AUTH_FAILURE",
      meta: {
        passcode: "SuperSecret123!",
        userToken: "jwt.secret.token",
        username: "srikar",
      },
    });

    const logCall = warnSpy.mock.calls[0][0];
    expect(logCall).not.toContain("SuperSecret123!");
    expect(logCall).not.toContain("jwt.secret.token");
    expect(logCall).toContain('"passcode":"[REDACTED]"');
    expect(logCall).toContain('"username":"srikar"');
  });

  it("logs AUTH_SUCCESS at INFO level", () => {
    logSecurityEvent({
      type: "AUTH_SUCCESS",
      ip: "10.0.0.1",
      path: "/api/admin/login",
    });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const logCall = infoSpy.mock.calls[0][0];
    expect(logCall).toContain('"type":"AUTH_SUCCESS"');
  });
});

describe("Edge Middleware — HTTPS Redirection & CORS", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects HTTP requests to HTTPS in production with 301", () => {
    vi.stubEnv("NODE_ENV", "production");

    const req = new NextRequest("http://yugmora.com/srikar", {
      headers: {
        "x-forwarded-proto": "http",
        host: "yugmora.com",
      },
    });

    const res = middleware(req);
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://yugmora.com/srikar");
  });

  it("does not force HTTPS redirect on localhost in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    const req = new NextRequest("http://localhost:3000/srikar", {
      headers: {
        "x-forwarded-proto": "http",
        host: "localhost:3000",
      },
    });

    const res = middleware(req);
    expect(res.status).not.toBe(301);
  });

  it("allows CORS preflight (OPTIONS) for localhost or same-origin on /api/ endpoints", () => {
    const req = new NextRequest("http://localhost:3000/api/partner", {
      method: "OPTIONS",
      headers: {
        origin: "http://localhost:3000",
        host: "localhost:3000",
      },
    });

    const res = middleware(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
    expect(res.headers.get("access-control-allow-methods")).toContain("POST");
  });

  it("blocks CORS preflight (OPTIONS) for unauthorized third-party origins", () => {
    const req = new NextRequest("http://localhost:3000/api/partner", {
      method: "OPTIONS",
      headers: {
        origin: "https://evil-phishing-site.com",
        host: "yugmora.com",
      },
    });

    const res = middleware(req);
    expect(res.status).toBe(403);
  });

  it("blocks cross-origin requests from unauthorized origins", () => {
    const req = new NextRequest("http://localhost:3000/api/partner", {
      method: "POST",
      headers: {
        origin: "https://unauthorized-domain.com",
        host: "yugmora.com",
      },
    });

    const res = middleware(req);
    expect(res.status).toBe(403);
  });
});
