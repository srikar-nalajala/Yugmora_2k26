// app/api/admin/content/route.ts — Live Content Storage & Persistence Endpoint
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Memory cache fallback for serverless environments
let memoryContentCache: Record<string, unknown> | null = null;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "live_content.json");

function readSavedContent() {
  if (memoryContentCache) return memoryContentCache;
  try {
    if (fs.existsSync(DATA_FILE)) {
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

export async function GET() {
  const content = readSavedContent();
  return NextResponse.json({
    success: true,
    content: content,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.reset) {
      writeSavedContent(null);
      return NextResponse.json({
        success: true,
        message: "Content reset to defaults",
      });
    }

    if (!body.content) {
      return NextResponse.json(
        { success: false, error: "Missing content payload" },
        { status: 400 }
      );
    }

    writeSavedContent(body.content);

    return NextResponse.json({
      success: true,
      message: "Content saved successfully",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
