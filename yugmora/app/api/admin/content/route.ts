// app/api/admin/content/route.ts — Live Content Storage & Persistence Endpoint
// GET is public (serves content to landing page), POST is admin-only
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { validateContentType, stripPrototypePollution } from "@/lib/security";
import { logSecurityEvent } from "@/lib/logger";
import fs from "fs";
import path from "path";

// Memory cache fallback for serverless environments
let memoryContentCache: Record<string, unknown> | null = null;

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.resolve(DATA_DIR, "live_content.json");
const MAX_CONTENT_BYTES = 1024 * 1024; // 1 MB limit

// Verify DATA_FILE resides securely inside DATA_DIR to prevent path traversal
function isSafePath(filePath: string): boolean {
  const resolved = path.resolve(filePath);
  return resolved.startsWith(DATA_DIR);
}

// Strict Zod schema for content updates
export const contentUpdateSchema = z.object({
  reset: z.boolean().optional(),
  content: z
    .object({
      event: z.record(z.string(), z.unknown()).optional(),
      keyNumbers: z.array(z.record(z.string(), z.unknown())).optional(),
      hero: z.record(z.string(), z.unknown()).optional(),
      missions: z.array(z.record(z.string(), z.unknown())).optional(),
      workshops: z.array(z.record(z.string(), z.unknown())).optional(),
      melaCompanies: z.array(z.record(z.string(), z.unknown())).optional(),
      schedule: z.array(z.record(z.string(), z.unknown())).optional(),
      prizes: z.array(z.record(z.string(), z.unknown())).optional(),
    })
    .passthrough()
    .optional(),
});

function readSavedContent() {
  if (memoryContentCache) return memoryContentCache;
  try {
    if (isSafePath(DATA_FILE) && fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      memoryContentCache = JSON.parse(raw);
      return memoryContentCache;
    }
  } catch (err) {
    console.warn("Could not read live_content.json from disk, using memory:", err);
  }
  return null;
}

function writeSavedContent(content: Record<string, unknown> | null) {
  memoryContentCache = content;
  try {
    if (!isSafePath(DATA_FILE)) {
      throw new Error("Invalid storage destination");
    }
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (content === null) {
      if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), "utf-8");
    }
    return true;
  } catch (err) {
    console.warn("Could not write live_content.json to disk (filesystem may be read-only):", err);
    return false;
  }
}

// GET remains public — it serves content to the landing page
export async function GET() {
  const content = readSavedContent();
  return NextResponse.json({
    success: true,
    content: content,
  });
}

// POST requires admin authentication
export async function POST(request: Request) {
  // ▶ AUTH GUARD
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Reject unexpected Content-Types / file uploads
  if (!validateContentType(request, "application/json")) {
    return NextResponse.json(
      { success: false, error: "Unsupported Media Type. Expected application/json" },
      { status: 415 }
    );
  }

  // Enforce body size limit (1 MB)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_BYTES) {
    return NextResponse.json(
      { success: false, error: "Payload too large. Maximum size is 1MB" },
      { status: 413 }
    );
  }

  try {
    const rawText = await request.text();
    if (rawText.length > MAX_CONTENT_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload too large. Maximum size is 1MB" },
        { status: 413 }
      );
    }

    const parsedJson = JSON.parse(rawText);
    const sanitizedBody = stripPrototypePollution(parsedJson);
    const validated = contentUpdateSchema.parse(sanitizedBody);

    if (validated.reset) {
      writeSavedContent(null);
      return NextResponse.json({
        success: true,
        message: "Content reset to defaults",
      });
    }

    if (!validated.content) {
      return NextResponse.json(
        { success: false, error: "Missing content payload" },
        { status: 400 }
      );
    }

    writeSavedContent(validated.content as Record<string, unknown>);

    return NextResponse.json({
      success: true,
      message: "Content saved successfully",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid content schema", details: err.issues },
        { status: 400 }
      );
    }

    logSecurityEvent({
      type: "SERVER_ERROR",
      path: "/api/admin/content",
      method: "POST",
      error: err instanceof Error ? err.message : String(err),
    });

    const safeMessage =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : (err as Error).message || "Internal server error";

    return NextResponse.json(
      { success: false, error: safeMessage },
      { status: 500 }
    );
  }
}
