// content/workshops.ts — Workshops data (§6)
import { Workshop } from "./types";

export const workshops: Workshop[] = [
  {
    id: "WS-01",
    title: "[Workshop on AI/ML for Real-World Applications]",
    domain: "AI/ML",
    speakerId: "SP-01",
    datetime: "[Day 1, 10:00 AM – 12:00 PM]",
    duration: "[2 hours]",
  },
  {
    id: "WS-02",
    title: "[Full-Stack Development: From Idea to MVP]",
    domain: "Web & Mobile",
    speakerId: "SP-02",
    datetime: "[Day 1, 2:00 PM – 4:00 PM]",
    duration: "[2 hours]",
  },
  {
    id: "WS-03",
    title: "[IoT Prototyping with Arduino and Raspberry Pi]",
    domain: "IoT & Embedded",
    speakerId: "SP-03",
    datetime: "[Day 1, 4:30 PM – 6:00 PM]",
    duration: "[1.5 hours]",
  },
  {
    id: "WS-04",
    title: "[Data Analytics and Visualization]",
    domain: "Data Analytics",
    speakerId: "SP-04",
    datetime: "[Day 2, 9:00 AM – 11:00 AM]",
    duration: "[2 hours]",
  },
  {
    id: "WS-05",
    title: "[Cybersecurity Fundamentals for Developers]",
    domain: "Cybersecurity",
    speakerId: "SP-05",
    datetime: "[Day 2, 11:30 AM – 1:00 PM]",
    duration: "[1.5 hours]",
  },
];

export const workshopTakeaways = [
  "Hands-on experience with industry-standard tools and frameworks",
  "Direct mentorship from industry professionals during the workshop",
  "Skills directly applicable to the hackathon problem statements",
  "Certificate of participation for each workshop attended",
  "Networking opportunities with speakers and fellow participants",
];
