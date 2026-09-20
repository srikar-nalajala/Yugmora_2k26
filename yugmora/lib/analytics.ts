// lib/analytics.ts — Event tracking stubs

type EventName =
  | "register_click"
  | "brochure_download"
  | "partner_submit"
  | "mission_open"
  | "mission_register"
  | "community_join"
  | "partner_brochure_download";

export function trackEvent(event: EventName, data?: Record<string, string>) {
  // Stub: replace with real analytics (Google Analytics, Mixpanel, etc.)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, data);
  }
}
