// content/mela.ts — Internship Mela data (§8)
import { Company } from "./types";

export const melaOverview = {
  title: "Internship Mela",
  subtitle: "Your hackathon performance is your resume.",
  description:
    "The Internship Mela is a unique on-campus hiring event held alongside Yugmora. Companies that contributed problem statements — and others — set up booths to interview top-performing teams and individual standouts. It's not a job fair; it's a performance-based fast track to internships and PPOs.",
};

export const melaSteps = [
  { step: 1, title: "Register", description: "Sign up for Yugmora and indicate your interest in the Internship Mela." },
  { step: 2, title: "Hack", description: "Solve real problem statements during the 40-hour hackathon." },
  { step: 3, title: "Get Noticed", description: "Mentors and judges evaluate your work and flag standout performers." },
  { step: 4, title: "Interview", description: "Top performers are invited to interview at company booths during the Mela." },
  { step: 5, title: "Get Offered", description: "Receive internship offers or PPOs based on your performance." },
  { step: 6, title: "Start Building", description: "Begin your industry journey with a real project under your belt." },
];

export const melaChecklist = [
  "Updated resume (1–2 pages)",
  "GitHub profile with hackathon project",
  "Portfolio or project demo link",
  "Government-issued ID",
  "College ID card",
  "Laptop with your project loaded",
];

export const melaRoles = [
  "Software Engineer Intern",
  "Data Science Intern",
  "Product Design Intern",
  "DevOps Intern",
  "ML Engineer Intern",
  "Full-Stack Developer Intern",
  "Mobile Developer Intern",
  "Cybersecurity Analyst Intern",
  "Business Analyst Intern",
  "QA Engineer Intern",
];

export const melaCompanies: Company[] = [
  {
    name: "[Company A]",
    logo: "",
    roles: ["[Software Engineer Intern]", "[Data Science Intern]"],
    type: "Internship",
    eligibility: "[3rd/4th year B.Tech, any branch]",
    stipend: "[Rs. 15,000 – 25,000/month]",
  },
  {
    name: "[Company B]",
    logo: "",
    roles: ["[Full-Stack Developer Intern]"],
    type: "Internship / PPO",
    eligibility: "[Pre-final and final year students]",
    stipend: "[Rs. 20,000 – 35,000/month]",
  },
  {
    name: "[Company C]",
    logo: "",
    roles: ["[Product Design Intern]", "[ML Engineer Intern]"],
    type: "PPO",
    eligibility: "[Final year students only]",
    stipend: "[Rs. 25,000 – 40,000/month]",
  },
  {
    name: "[Company D]",
    logo: "",
    roles: ["[DevOps Intern]"],
    type: "Internship",
    eligibility: "[Any year, CS/IT preferred]",
    stipend: "[Rs. 10,000 – 20,000/month]",
  },
];
