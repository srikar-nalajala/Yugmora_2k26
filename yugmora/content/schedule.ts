// content/schedule.ts — 40-hour timeline (§9)
import { ScheduleItem } from "./types";

export const schedule: ScheduleItem[] = [
  { hourLabel: "HOUR 0", hourStart: 0, time: "[Day 1, 9:00 AM]", activity: "Registration & Check-in" },
  { hourLabel: "HOUR 1", hourStart: 1, time: "[Day 1, 10:00 AM]", activity: "Opening Ceremony & Keynote" },
  { hourLabel: "HOUR 2", hourStart: 2, time: "[Day 1, 11:00 AM]", activity: "Problem Statement Reveal & Team Formation" },
  { hourLabel: "HOUR 3", hourStart: 3, time: "[Day 1, 12:00 PM]", activity: "Hacking Begins 🚀" },
  { hourLabel: "HOUR 5", hourStart: 5, time: "[Day 1, 2:00 PM]", activity: "Workshop Session 1" },
  { hourLabel: "HOUR 8", hourStart: 8, time: "[Day 1, 5:00 PM]", activity: "Workshop Session 2" },
  { hourLabel: "HOUR 12", hourStart: 12, time: "[Day 1, 9:00 PM]", activity: "Mentor Check-in Round 1" },
  { hourLabel: "HOUR 16", hourStart: 16, time: "[Day 2, 1:00 AM]", activity: "Midnight Snacks & Chill Zone" },
  { hourLabel: "HOUR 20", hourStart: 20, time: "[Day 2, 5:00 AM]", activity: "Early Bird Workshop" },
  { hourLabel: "HOUR 24", hourStart: 24, time: "[Day 2, 9:00 AM]", activity: "Mentor Check-in Round 2" },
  { hourLabel: "HOUR 28", hourStart: 28, time: "[Day 2, 1:00 PM]", activity: "Workshop Session 3" },
  { hourLabel: "HOUR 35", hourStart: 35, time: "[Day 2, 8:00 PM]", activity: "Hacking Ends — Submissions Due" },
  { hourLabel: "HOUR 37", hourStart: 37, time: "[Day 2, 10:00 PM]", activity: "Judging & Demos" },
  { hourLabel: "HOUR 40", hourStart: 40, time: "[Day 3, 1:00 AM]", activity: "Results & Closing Ceremony 🏆" },
];

export const importantDates = [
  { date: "[Date]", event: "Registration Opens" },
  { date: "[Date]", event: "Early Bird Deadline" },
  { date: "[Date]", event: "Registration Closes" },
  { date: "[Date]", event: "Team Formation Deadline" },
  { date: "[Date]", event: "Problem Statements Released" },
  { date: "[Date]", event: "Event Day 1 — Yugmora Begins" },
  { date: "[Date]", event: "Event Day 2 — Hacking & Workshops" },
  { date: "[Date]", event: "Results & Internship Mela" },
];
