// content/sponsors.ts — Sponsor tiers (§12)
import { SponsorTier } from "./types";

export const sponsorTiers: SponsorTier[] = [
  {
    tier: "Title Sponsor",
    sponsors: [{ name: "[Your Logo Here]", logo: "" }],
  },
  {
    tier: "Problem Statement Partners",
    sponsors: [
      { name: "[Company A]", logo: "" },
      { name: "[Company B]", logo: "" },
      { name: "[Company C]", logo: "" },
    ],
  },
  {
    tier: "Workshop Partners",
    sponsors: [
      { name: "[Company D]", logo: "" },
      { name: "[Company E]", logo: "" },
    ],
  },
  {
    tier: "Internship Mela Partners",
    sponsors: [
      { name: "[Company F]", logo: "" },
      { name: "[Company G]", logo: "" },
      { name: "[Company H]", logo: "" },
    ],
  },
  {
    tier: "Community & Media Partners",
    sponsors: [
      { name: "[Media Partner]", logo: "" },
      { name: "[Community Partner]", logo: "" },
    ],
  },
];
