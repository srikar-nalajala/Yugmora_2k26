// content/partners.ts — Partnership data (§11)
import { Partnership } from "./types";

export const partnerships: Partnership[] = [
  {
    name: "Problem Statement Partner",
    youDo:
      "Contribute a real-world problem statement for teams to solve. Assign a mentor to guide and evaluate teams. Optionally sponsor a 'Best Solution' prize.",
    youGet:
      "Direct access to innovative solutions for your business challenges. First pick of top talent for internships. Brand visibility as a problem-statement partner across all materials.",
  },
  {
    name: "Workshop / Speaker Partner",
    youDo:
      "Send an expert to conduct a hands-on workshop aligned to the hackathon's problem domains. Share tools, frameworks, or APIs that teams can use.",
    youGet:
      "Thought leadership positioning in front of top student talent. Workshop branded with your company. Networking with students and other partners.",
  },
  {
    name: "Internship Mela Partner",
    youDo:
      "Set up a booth at the Internship Mela. Interview top performers from the hackathon. Offer internships, PPOs, or project-based roles.",
    youGet:
      "Pre-vetted, high-performing candidates who have proven their skills under pressure. Reduce your hiring funnel to the best. On-campus brand presence.",
  },
  {
    name: "Prize / Sponsorship Partner",
    youDo:
      "Sponsor a prize category (e.g., Best AI Solution, Most Innovative Hack). Contribute to the overall prize pool or sponsor logistics (food, venue, swag).",
    youGet:
      "Logo on the main stage, banners, website, and all promotional materials. Naming rights for the sponsored prize. Social media mentions and post-event report.",
  },
];

export const whyPartner = [
  "Access a curated pool of student builders who can solve real problems",
  "Test your problem statements with diverse, creative teams",
  "First-mover advantage in hiring top performers via the Internship Mela",
  "Position your brand as an innovation-friendly employer on campus",
  "Workshop slots let you demonstrate your tech stack to future developers",
  "Measurable engagement: teams formed, solutions built, hires made",
];

export const partnerChecklist = [
  "Problem statement document (background, challenge, deliverables)",
  "Company logo (SVG or high-res PNG, transparent background)",
  "Mentor name, designation, email, and LinkedIn",
  "Workshop title and duration (if applicable)",
  "Prize amount or sponsorship tier (if applicable)",
  "Brief company description (2–3 lines) for the website",
];
