// middleware.ts — Edge middleware: HTTPS redirection & CORS restriction
import { NextResponse, type NextRequest } from "next/server";
import { logSecurityEvent } from "@/lib/logger";

function getAllowedOrigins(req: NextRequest): string[] {
  const allowed = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
  ];

  if (process.env.ALLOWED_ORIGIN) {
    allowed.push(...process.env.ALLOWED_ORIGIN.split(",").map((o) => o.trim()));
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    allowed.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_URL) {
    allowed.push(`https://${process.env.VERCEL_URL}`);
  }

  // Also allow the host making the request (same-origin)
  const host = req.headers.get("host");
  if (host) {
    allowed.push(`http://${host}`);
    allowed.push(`https://${host}`);
  }

  return allowed;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // 1. FORCE HTTPS (in production on non-localhost requests)
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host") || "";
  if (
    isProduction &&
    proto === "http" &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.0.0.1")
  ) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl.toString(), 301);
  }

  // 2. CORS RESTRICTIONS FOR /api/* ENDPOINTS
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = getAllowedOrigins(request);

    // If an Origin header is present (cross-origin request)
    if (origin) {
      const isAllowed = allowedOrigins.includes(origin);

      // Handle OPTIONS Preflight
      if (request.method === "OPTIONS") {
        if (!isAllowed) {
          logSecurityEvent({
            type: "CORS_BLOCKED",
            path: pathname,
            method: "OPTIONS",
            ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
            reason: `Blocked unauthorized origin: ${origin}`,
          });
          return new NextResponse(null, { status: 403 });
        }

        const preflightHeaders = new Headers();
        preflightHeaders.set("Access-Control-Allow-Origin", origin);
        preflightHeaders.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
        preflightHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        preflightHeaders.set("Access-Control-Allow-Credentials", "true");
        preflightHeaders.set("Access-Control-Max-Age", "86400"); // 24 hours
        return new NextResponse(null, { status: 204, headers: preflightHeaders });
      }

      // Non-OPTIONS cross-origin requests
      if (!isAllowed) {
        logSecurityEvent({
          type: "CORS_BLOCKED",
          path: pathname,
          method: request.method,
          ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
          reason: `Blocked unauthorized origin: ${origin}`,
        });
        return NextResponse.json(
          { success: false, error: "Cross-Origin Request Blocked" },
          { status: 403 }
        );
      }

      // Allowed cross-origin response
      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, pdfs
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};
