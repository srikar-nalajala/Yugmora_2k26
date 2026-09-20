// lib/auth.ts — Server-side authentication utilities (NEVER import from client components)
import { compare, hash } from "bcryptjs";
import { createHmac, randomBytes } from "crypto";
import { cookies } from "next/headers";

// ═══════════════════════════════════════════════════
//  PASSWORD HASHING (bcrypt, cost factor 12)
// ═══════════════════════════════════════════════════

const BCRYPT_ROUNDS = 12;

/** Generate a bcrypt hash — used during setup only */
export async function hashPasscode(plaintext: string): Promise<string> {
  return hash(plaintext, BCRYPT_ROUNDS);
}

/** Compare plaintext against stored hash */
export async function verifyPasscode(
  plaintext: string,
  storedHash: string
): Promise<boolean> {
  return compare(plaintext, storedHash);
}

// ═══════════════════════════════════════════════════
//  HMAC-SIGNED SESSION TOKENS
// ═══════════════════════════════════════════════════

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const COOKIE_NAME = "admin_session";

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    // Fallback for development — in production ADMIN_SESSION_SECRET must be set
    console.warn(
      "[auth] ADMIN_SESSION_SECRET is not set or too short. Using fallback for development only."
    );
    return "dev-fallback-secret-do-not-use-in-production-" + (process.env.NODE_ENV || "dev");
  }
  return secret;
}

interface SessionPayload {
  sub: string; // subject (always "admin")
  iat: number; // issued at (ms)
  exp: number; // expires at (ms)
  nonce: string; // random per-session
}

/** Create a signed session token */
export function signSessionToken(): string {
  const payload: SessionPayload = {
    sub: "admin",
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_MS,
    nonce: randomBytes(16).toString("hex"),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSessionSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

/** Verify a signed session token, returns payload if valid */
export function verifySessionToken(
  token: string
): SessionPayload | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expectedSig = createHmac("sha256", getSessionSecret())
      .update(data)
      .digest("base64url");

    // Constant-time comparison
    if (sig.length !== expectedSig.length) return null;
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a[i] ^ b[i];
    }
    if (diff !== 0) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    );

    // Check expiry
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════
//  COOKIE MANAGEMENT
// ═══════════════════════════════════════════════════

/** Set the admin session cookie */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000, // seconds
  });
}

/** Clear the admin session cookie */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

/** Extract and validate session from incoming request */
export async function getSessionFromRequest(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySessionToken(cookie.value);
}

/** Quick boolean check — is the request from an authenticated admin? */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getSessionFromRequest();
  return session !== null;
}

// ═══════════════════════════════════════════════════
//  RATE LIMITING (in-memory, per-IP)
// ═══════════════════════════════════════════════════

interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 5;

/** Clean expired entries periodically */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Check and consume a rate limit slot.
 * Returns { allowed: true } if under limit, or { allowed: false, retryAfterMs } if over.
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { attempts: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, retryAfterMs };
  }

  entry.attempts++;
  return { allowed: true };
}

// ═══════════════════════════════════════════════════
//  PASSCODE HASH HELPER
// ═══════════════════════════════════════════════════

/** Get the stored passcode hash from environment */
export function getPasscodeHash(): string | null {
  return process.env.ADMIN_PASSCODE_HASH || null;
}
