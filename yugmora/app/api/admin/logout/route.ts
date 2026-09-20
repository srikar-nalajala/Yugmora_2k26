// app/api/admin/logout/route.ts — Secure admin logout
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
