// lib/countdown.ts — Countdown logic

export type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // ms remaining
  isExpired: boolean;
};

export function getCountdown(targetISO: string): CountdownValues {
  const now = Date.now();
  const target = new Date(targetISO).getTime();
  const total = Math.max(0, target - now);
  const isExpired = total <= 0;

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
    isExpired,
  };
}

export function padTwo(n: number): string {
  return String(n).padStart(2, "0");
}
