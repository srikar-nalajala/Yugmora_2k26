// content/prizes.ts — Prizes & judging (§5.8, §5.9)
import { Prize, JudgingCriterion } from "./types";

export const prizes: Prize[] = [
  { award: "Winner", reward: "Rs. [X]" },
  { award: "First Runner-up", reward: "Rs. [X]" },
  { award: "Second Runner-up", reward: "Rs. [X]" },
];

export const specialPrizes: Prize[] = [
  { award: "Best AI/ML Solution", reward: "[Partner Award]" },
  { award: "Best Social Impact Project", reward: "[Partner Award]" },
  { award: "Most Innovative Hack", reward: "[Partner Award]" },
  { award: "Best UI/UX Design", reward: "[Partner Award]" },
  { award: "Internship Fast-Track", reward: "Direct interview at the Internship Mela" },
];

export const judgingCriteria: JudgingCriterion[] = [
  {
    name: "Problem Fit",
    description: "How well does the solution address the stated problem? Does it understand the real-world context?",
    weight: "20%",
  },
  {
    name: "Innovation",
    description: "Is the approach creative and original? Does it bring a fresh perspective to the problem?",
    weight: "20%",
  },
  {
    name: "Technical Excellence",
    description: "Code quality, architecture, use of appropriate technologies, and technical depth.",
    weight: "25%",
  },
  {
    name: "Impact & Scalability",
    description: "Can this solution create real impact? Is it scalable and sustainable beyond the hackathon?",
    weight: "15%",
  },
  {
    name: "Design & UX",
    description: "User experience, interface design, accessibility, and overall usability.",
    weight: "10%",
  },
  {
    name: "Presentation",
    description: "Clarity of the demo, storytelling, and the team's ability to communicate their solution.",
    weight: "10%",
  },
];
