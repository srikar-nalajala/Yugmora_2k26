// components/sections/Hero.tsx — Full viewport hero section
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLiveContent } from "@/context/LiveContentContext";
import { getCountdown, padTwo } from "@/lib/countdown";
import { trackEvent } from "@/lib/analytics";
import { fadeInUp, staggerContainer } from "@/lib/motion";

function CountdownDisplay({ eventStartISO }: { eventStartISO?: string }) {
  const [countdown, setCountdown] = useState(getCountdown(eventStartISO));

  useEffect(() => {
    setCountdown(getCountdown(eventStartISO));
    if (!eventStartISO) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(eventStartISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [eventStartISO]);

  if (!eventStartISO) {
    return (
      <div className="flex items-center gap-4 font-mono">
        {["Days", "Hours", "Minutes"].map((label) => (
          <div key={label} className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-text-muted tracking-wider">
              --
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const segments = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Min" },
    { value: countdown.seconds, label: "Sec" },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4 font-mono">
      {segments.map((seg, i) => (
        <div key={seg.label} className="flex items-center gap-3 sm:gap-4">
          <div className="text-center">
            <div
              className="text-3xl sm:text-4xl font-bold tracking-wider tabular-nums"
              style={{
                color: "var(--neon-cyan)",
                textShadow: "0 0 12px rgba(34, 225, 255, 0.5)",
              }}
            >
              {padTwo(seg.value)}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
              {seg.label}
            </div>
          </div>
          {i < segments.length - 1 && (
            <span className="text-2xl text-line font-bold self-start mt-1">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function KeyNumbersStrip({ items }: { items: { prefix?: string; value: string | number; suffix?: string; label: string }[] }) {
  return (
    <div className="w-full border-t border-b border-line py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-black text-2xl sm:text-3xl neon-text">
                {item.prefix || ""}
                {item.value}
                {item.suffix}
              </div>
              <div className="text-xs text-text-muted font-mono uppercase tracking-wider mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { content } = useLiveContent();
  const { event, hero, keyNumbers } = content;
  return (
    <section id="top" className="relative min-h-screen flex flex-col">

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(70, 27, 239, 0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center" style={{ paddingTop: "var(--nav-height)" }}>
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl relative z-10">
            {/* Seamless feathered atmospheric dark scrim that ensures 100% text contrast without cutting the 3D emblem */}
            <div
              className="absolute -inset-6 sm:-inset-10 -z-10 pointer-events-none rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse 95% 90% at 20% 45%, rgba(0, 0, 0, 0.94) 0%, rgba(2, 4, 12, 0.85) 50%, rgba(2, 4, 12, 0.35) 75%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            {/* Eyebrow */}
            <motion.p
              className="mono-label text-[11px] mb-6 flex items-center gap-2 drop-shadow-md"
              variants={fadeInUp}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              [ {hero.eyebrow} ]
            </motion.p>

            {/* H1 */}
            <motion.h1
              className="section-heading text-4xl sm:text-5xl lg:text-7xl mb-6"
              variants={fadeInUp}
            >
              <span className="neon-text">{hero.headline}</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              className="text-lg sm:text-xl text-text-muted leading-relaxed mb-4 max-w-2xl text-contrast-shield"
              style={{ fontFamily: "var(--font-body)" }}
              variants={fadeInUp}
            >
              {hero.subheadline}
            </motion.p>

            {/* Event line */}
            <motion.p
              className="font-mono text-sm text-tagline mb-8 text-contrast-shield"
              variants={fadeInUp}
            >
              {hero.eventLine}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              variants={fadeInUp}
            >
              <a
                href={event.urls.register}
                className="neon-btn neon-btn--primary"
                onClick={() => trackEvent("register_click")}
              >
                {hero.cta.primary.label}
              </a>
              <a
                href={hero.cta.secondary.href}
                className="neon-btn neon-btn--secondary"
              >
                {hero.cta.secondary.label}
              </a>
              {hero.cta.tertiary.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  className="neon-btn neon-btn--ghost"
                  onClick={() => {
                    if (btn.label.includes("Brochure"))
                      trackEvent("brochure_download");
                  }}
                >
                  {btn.label}
                </a>
              ))}
            </motion.div>

            {/* Countdown */}
            <motion.div variants={fadeInUp}>
              <CountdownDisplay eventStartISO={event.eventStartISO} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Key numbers strip */}
      <KeyNumbersStrip items={keyNumbers} />
    </section>
  );
}
