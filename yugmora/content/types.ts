// content/types.ts — Yugmora data model (Section 8 of architecture)

export type Domain =
  | "AI/ML"
  | "Web & Mobile"
  | "Cybersecurity"
  | "IoT & Embedded"
  | "Data Analytics"
  | "FinTech"
  | "HealthTech"
  | "EdTech"
  | "AgriTech"
  | "Sustainability"
  | "Open Innovation";

export type Mission = {
  id: string; // "YG-01"
  company: { name: string; logo?: string };
  title: string;
  domain: Domain;
  difficulty: 1 | 2 | 3 | 4 | 5 | null;
  background: string;
  challenge: string;
  deliverables: string[];
  resources?: string[]; // datasets, APIs, tools
  mentors: string[];
  linkedWorkshopId?: string;
  locked?: boolean; // for "unlocks on [Date]" card
};

export type Workshop = {
  id: string;
  title: string;
  domain: Domain;
  speakerId: string;
  datetime: string;
  duration: string;
};

export type Speaker = {
  id: string;
  name: string;
  designation: string;
  company: { name: string; logo?: string };
  bio: string;
  photo?: string;
  linkedin?: string;
  session: string;
  roles: ("Keynote" | "Workshop" | "Mentor" | "Judge" | "Talk")[];
};

export type Company = {
  name: string;
  logo?: string;
  roles: string[];
  type: "Internship" | "PPO" | "Internship / PPO";
  eligibility: string;
  stipend: string;
};

export type ScheduleItem = {
  hourLabel: string;
  hourStart: number;
  time: string;
  activity: string;
};

export type Prize = {
  award: string;
  reward: string;
};

export type JudgingCriterion = {
  name: string;
  description: string;
  weight: string; // "[20%]"
};

export type Faq = {
  q: string;
  a: string;
};

export type Partnership = {
  name: string;
  youDo: string;
  youGet: string;
};

export type SponsorTier = {
  tier: string;
  sponsors: { name: string; logo?: string }[];
};

export type Contact = {
  role: string;
  name: string;
  email: string;
  phone: string;
};
