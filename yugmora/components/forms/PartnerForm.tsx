// components/forms/PartnerForm.tsx — Partner enquiry form with zod + react-hook-form
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackEvent } from "@/lib/analytics";

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  company: z.string().trim().min(2, "Company name is required").max(100, "Company name cannot exceed 100 characters"),
  role: z.string().trim().min(2, "Your role is required").max(100, "Role cannot exceed 100 characters"),
  email: z.string().trim().email("Valid work email is required").max(254, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(10, "Valid phone number is required (at least 10 characters)")
    .max(20, "Phone number is too long")
    .regex(/^[+0-9\s\-()]{10,20}$/, "Invalid phone format"),
  partnershipType: z.enum([
    "Problem Statement Partner",
    "Workshop / Speaker Partner",
    "Internship Mela Partner",
    "Prize / Sponsorship Partner",
    "Other / Custom",
  ]),
  message: z.string().trim().min(10, "Please share a brief message or proposal").max(2000, "Message cannot exceed 2000 characters"),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

export function PartnerForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      partnershipType: "Problem Statement Partner",
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit enquiry. Please try again.");
      }

      setStatus("success");
      trackEvent("partner_submit", { company: data.company, type: data.partnershipType });
      reset();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please reach out directly.");
    }
  };

  return (
    <div className="hud-card p-6 sm:p-8 border border-line bg-surface-1/90">
      <div className="mb-6">
        <span className="mono-label">[ ENQUIRY FORM ]</span>
        <h3 className="font-display font-bold text-xl text-text mt-1">
          Partner With Yugmora
        </h3>
        <p className="text-text-muted text-xs font-mono mt-1">
          Complete this form and our industry partnership team will respond within 24 hours.
        </p>
      </div>

      {status === "success" ? (
        <div className="p-6 rounded border border-neon-cyan/50 bg-neon-blue/10 text-center">
          <div className="text-neon-cyan text-3xl mb-2">✦</div>
          <h4 className="font-display font-bold text-lg text-white mb-2">
            Enquiry Received!
          </h4>
          <p className="text-text-muted text-sm mb-4">
            Thank you for your interest in collaborating with Yugmora. Our team will contact you shortly.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="neon-btn neon-btn--secondary text-xs"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Your Name *
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
              />
              {errors.name && (
                <p className="text-neon-pink text-xs mt-1 font-mono">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Company / Organization *
              </label>
              <input
                {...register("company")}
                placeholder="e.g. Acme Labs"
                className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
              />
              {errors.company && (
                <p className="text-neon-pink text-xs mt-1 font-mono">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Work Email *
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="alex@acmelabs.com"
                className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
              />
              {errors.email && (
                <p className="text-neon-pink text-xs mt-1 font-mono">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Phone Number *
              </label>
              <input
                {...register("phone")}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
              />
              {errors.phone && (
                <p className="text-neon-pink text-xs mt-1 font-mono">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Your Designation / Role *
              </label>
              <input
                {...register("role")}
                placeholder="e.g. Engineering Lead / HR"
                className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
              />
              {errors.role && (
                <p className="text-neon-pink text-xs mt-1 font-mono">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">
                Partnership Track *
              </label>
              <select
                {...register("partnershipType")}
                className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
              >
                <option value="Problem Statement Partner">Problem Statement Partner</option>
                <option value="Workshop / Speaker Partner">Workshop / Speaker Partner</option>
                <option value="Internship Mela Partner">Internship Mela Partner</option>
                <option value="Prize / Sponsorship Partner">Prize / Sponsorship Partner</option>
                <option value="Other / Custom">Other / Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted uppercase mb-1">
              Proposal / Message *
            </label>
            <textarea
              {...register("message")}
              rows={3}
              placeholder="Tell us about the problem statements you'd like to pitch, roles you want to hire for, or sponsorship interests..."
              className="w-full px-3 py-2 bg-surface-2 border border-line rounded text-text text-sm focus:border-neon-cyan outline-none font-sans"
            />
            {errors.message && (
              <p className="text-neon-pink text-xs mt-1 font-mono">{errors.message.message}</p>
            )}
          </div>

          {status === "error" && (
            <p className="text-neon-pink text-xs font-mono">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="neon-btn neon-btn--primary w-full"
          >
            {status === "submitting" ? "Transmitting..." : "Submit Partnership Enquiry →"}
          </button>
        </form>
      )}
    </div>
  );
}
