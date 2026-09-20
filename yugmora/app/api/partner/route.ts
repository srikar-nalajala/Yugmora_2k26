// app/api/partner/route.ts — Partnership enquiry submission & retrieval endpoint
// POST is public (visitor form submissions), GET and PATCH are admin-only
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";

const partnerSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  role: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  partnershipType: z.string(),
  message: z.string().min(10),
});

export interface PartnerSubmission {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
  status: "new" | "contacted" | "approved" | "archived";
}

let memorySubmissions: PartnerSubmission[] = [];

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "partner_submissions.json");

function getSubmissions(): PartnerSubmission[] {
  if (memorySubmissions.length > 0) return memorySubmissions;
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      memorySubmissions = JSON.parse(raw);
      return memorySubmissions;
    }
  } catch (err) {
    console.warn("Could not read submissions from file:", err);
  }
  return memorySubmissions;
}

function saveSubmissions(list: PartnerSubmission[]) {
  memorySubmissions = list;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write submissions to disk:", err);
  }
}

// GET requires admin authentication — exposes PII
export async function GET() {
  // ▶ AUTH GUARD
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const submissions = getSubmissions();
  return NextResponse.json({
    success: true,
    submissions: submissions,
  });
}

// POST remains public — visitor form submissions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = partnerSchema.parse(body);

    const newSubmission: PartnerSubmission = {
      id: `SUB-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      ...validated,
      status: "new",
    };

    const current = getSubmissions();
    current.unshift(newSubmission);
    saveSubmissions(current);

    const webhookUrl = process.env.PARTNER_FORM_ENDPOINT;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validated),
        });
      } catch (forwardErr) {
        console.error("Failed to forward partner lead to webhook:", forwardErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Partnership enquiry successfully received",
    });
  } catch (err: unknown) {
    console.error("Partner submission validation error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid form submission" },
      { status: 400 }
    );
  }
}

// PATCH requires admin authentication
export async function PATCH(request: Request) {
  // ▶ AUTH GUARD
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    // ▶ STATUS ENUM VALIDATION — only allow known values
    const VALID_STATUSES = ["new", "contacted", "approved", "archived"] as const;
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const current = getSubmissions();

    // ▶ RECORD EXISTENCE CHECK — ensure the submission actually exists
    const targetExists = current.some((sub) => sub.id === body.id);
    if (!targetExists) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    const updated = current.map((sub) =>
      sub.id === body.id ? { ...sub, status: body.status } : sub
    );
    saveSubmissions(updated);

    return NextResponse.json({ success: true, message: "Submission updated" });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

