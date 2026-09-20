// content/event.ts — Core event data

export const event = {
  name: "YUGMORA",
  tagline: "STARTS HERE",
  fullTitle: "YUGMORA: 40 Hours. Real Problems. Real Impact.",
  subtitle:
    "A 40-hour campus hackathon where companies and startups contribute real problem statements, guest speakers run problem-aligned workshops, and an Internship Mela turns the best builders into interns.",
  college: "[College / University Name]",
  collegeLogo: "",
  dates: "[Event Dates]",
  venue: "[Campus Venue]",
  city: "[City]",
  teamSize: "[3–5 members]",
  eligibility: "[Open to all undergraduate and postgraduate students]",
  fee: "[Registration Fee]",
  deadlines: {
    registration: "[Registration Deadline]",
    teamFormation: "[Team Formation Deadline]",
    projectSubmission: "[Submission Deadline]",
  },
  urls: {
    register: process.env.NEXT_PUBLIC_REGISTER_URL || "#register",
    community: process.env.NEXT_PUBLIC_COMMUNITY_URL || "#community",
    brochure:
      process.env.NEXT_PUBLIC_BROCHURE_URL || "/downloads/yugmora-brochure.pdf",
    partnerBrochure:
      process.env.NEXT_PUBLIC_PARTNER_BROCHURE_URL ||
      "/downloads/yugmora-partnership-brochure.pdf",
  },
  registerUrl: process.env.NEXT_PUBLIC_REGISTER_URL || "#register",
  communityUrl: process.env.NEXT_PUBLIC_COMMUNITY_URL || "#community",
  brochureUrl:
    process.env.NEXT_PUBLIC_BROCHURE_URL || "/downloads/yugmora-brochure.pdf",
  partnerBrochureUrl:
    process.env.NEXT_PUBLIC_PARTNER_BROCHURE_URL ||
    "/downloads/yugmora-partnership-brochure.pdf",
  socials: {
    instagram: "[Instagram URL]",
    linkedin: "[LinkedIn URL]",
    twitter: "[Twitter/X URL]",
    youtube: "[YouTube URL]",
    whatsapp: "[WhatsApp Group URL]",
    discord: "[Discord Server URL]",
  },
  eventStartISO: process.env.NEXT_PUBLIC_EVENT_START_ISO || "",
  durationHours: 40,
};

export const keyNumbers = [
  { value: 40, label: "Hours", suffix: "" },
  { value: "[X]", label: "Problem Statements", suffix: "+" },
  { value: "[X]", label: "Workshops", suffix: "+" },
  { value: "[X]", label: "Companies", suffix: "+" },
  { value: "[X]", label: "Internships", suffix: "+" },
  { value: "[X]", label: "Prize Pool", suffix: "", prefix: "Rs. " },
];
