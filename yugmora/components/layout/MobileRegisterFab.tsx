// components/layout/MobileRegisterFab.tsx — Floating Register button on mobile
"use client";

import { usePathname } from "next/navigation";
import { useScrollStore } from "@/hooks/useScrollStore";
import { event } from "@/content/event";
import { trackEvent } from "@/lib/analytics";

export function MobileRegisterFab() {
  const pathname = usePathname();
  const scrollY = useScrollStore((s) => s.scrollY);
  if (pathname?.startsWith("/srikar")) return null;
  const isVisible = scrollY > 600; // Show after scrolling past hero

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 z-[150] lg:hidden transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <a
        href={event.urls.register}
        className="neon-btn neon-btn--primary w-full text-center py-4 text-sm"
        onClick={() => trackEvent("register_click")}
      >
        Register Now
      </a>
    </div>
  );
}
