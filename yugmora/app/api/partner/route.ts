// app/api/partner/route.ts — Partnership enquiry submission & retrieval endpoint
// POST is public (visitor form submissions), GET and PATCH are admin-only
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { escapeHtml, validateContentType } from "@/lib/security";
import { logSecurityEvent } from "@/lib/logger";
import fs from "fs";
import path from "path";

export const VALID_PARTNERSHIP_TYPES = [
  "Problem Statement Partner",
  "Workshop / Speaker Partner",
  "Internship Mela Partner",
  "Prize / Sponsorship Partner",
  "Sponsor",
  "Other / Custom",
] as const;

export const VALID_STATUSES = ["new", "contacted", "approved", "archived"] as const;

export const partnerPostSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  company: z.string().trim().min(2, "Company must be at least 2 characters").max(100, "Company cannot exceed 100 characters"),
  role: z.string().trim().min(2, "Role must be at least 2 characters").max(100, "Role cannot exceed 100 characters"),
  email: z.string().trim().email("Invalid email address").max(254, "Email too long").toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number too long")
    .regex(/^[+0-9\s\-()]{10,20}$/, "Invalid phone number format"),
  partnershipType: z.enum(VALID_PARTNERSHIP_TYPES),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
});

export const partnerPatchSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Missing id")
    .refine((val) => !val.includes("..") && !val.includes("/") && !val.includes("\\"), {
      message: "Invalid submission ID format",
    }),
  status: z
    .string()
    .refine((val): val is typeof VALID_STATUSES[number] => VALID_STATUSES.includes(val as (typeof VALID_STATUSES)[number]), {
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    }),
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
const MAX_POST_BYTES = 64 * 1024; // 64 KB

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
  // Check Content-Type (reject unexpected media types/file uploads)
  if (!validateContentType(request, "application/json")) {
    return NextResponse.json(
      { success: false, error: "Unsupported Media Type. Expected application/json" },
      { status: 415 }
    );
  }

  // Enforce body size limit
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_POST_BYTES) {
    return NextResponse.json(
      { success: false, error: "Payload too large. Maximum allowed size is 64KB" },
      { status: 413 }
    );
  }

  try {
    const rawText = await request.text();
    if (rawText.length > MAX_POST_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload too large" },
        { status: 413 }
      );
    }

    const body = JSON.parse(rawText);
    const validated = partnerPostSchema.parse(body);

    // Escape HTML in stored fields to prevent Stored XSS
    const sanitizedName = escapeHtml(validated.name);
    const sanitizedCompany = escapeHtml(validated.company);
    const sanitizedRole = escapeHtml(validated.role);
    const sanitizedMessage = escapeHtml(validated.message);

    const newSubmission: PartnerSubmission = {
      id: `SUB-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      name: sanitizedName,
      company: sanitizedCompany,
      role: sanitizedRole,
      email: validated.email,
      phone: validated.phone,
      partnershipType: validated.partnershipType,
      message: sanitizedMessage,
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
          body: JSON.stringify({
            ...newSubmission,
            rawMessage: validated.message,
          }),
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
    if (err instanceof z.ZodError) {
      const errorMsg = err.issues?.[0]?.message || "Invalid form submission";
      return NextResponse.json(
        { success: false, error: errorMsg, details: err.issues },
        { status: 400 }
      );
    }
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

  if (!validateContentType(request, "application/json")) {
    return NextResponse.json(
      { success: false, error: "Unsupported Media Type" },
      { status: 415 }
    );
  }

  try {
    const body = await request.json();
    const validated = partnerPatchSchema.parse(body);

    const current = getSubmissions();

    // ▶ RECORD EXISTENCE CHECK — ensure the submission actually exists
    const targetExists = current.some((sub) => sub.id === validated.id);
    if (!targetExists) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    const updated = current.map((sub) =>
      sub.id === validated.id ? { ...sub, status: validated.status } : sub
    );
    saveSubmissions(updated);

    return NextResponse.json({ success: true, message: "Submission updated" });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const errorMsg = err.issues?.[0]?.message || "Invalid input data";
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    logSecurityEvent({
      type: "SERVER_ERROR",
      path: "/api/partner",
      method: "PATCH",
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

