// app/api/admin/login/route.ts — Secure admin login with bcrypt + rate limiting
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  verifyPasscode,
  getPasscodeHash,
  signSessionToken,
  setSessionCookie,
  checkRateLimit,
  hashPasscode,
} from "@/lib/auth";

export async function POST(request: Request) {
  // Extract client IP for rate limiting
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  // Rate limit check
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many login attempts. Please wait before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateCheck.retryAfterMs || 60000) / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const passcode = body.passcode?.trim();

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Get stored hash from environment
    let storedHash = getPasscodeHash();

    // Development fallback: if no hash is configured, hash the default passcode
    // This allows the app to work in development without setting up env vars
    if (!storedHash) {
      if (process.env.NODE_ENV === "production") {
        console.error(
          "[auth] ADMIN_PASSCODE_HASH is not set! Admin login is disabled in production."
        );
        return NextResponse.json(
          { success: false, error: "Admin login is not configured" },
          { status: 503 }
        );
      }
      // Dev fallback — hash "yugmora2026" on the fly (only in development)
      storedHash = await hashPasscode("yugmora2026");
      console.warn(
        "[auth] Using development fallback passcode. Set ADMIN_PASSCODE_HASH in production!"
      );
    }

    // Bcrypt comparison — constant-time by design
    const isValid = await verifyPasscode(passcode, storedHash);

    if (!isValid) {
      // Generic error — never reveal whether the passcode exists
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate signed session token and set HTTP-only cookie
    const token = signSessionToken();
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Authenticated successfully",
    });
  } catch (err: unknown) {
    console.error("[auth] Login error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
