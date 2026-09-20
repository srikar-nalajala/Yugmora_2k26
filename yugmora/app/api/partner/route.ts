// app/api/partner/route.ts — Partnership enquiry submission endpoint
import { NextResponse } from "next/server";
import { z } from "zod";

const partnerSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  role: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  partnershipType: z.string(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = partnerSchema.parse(body);

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
