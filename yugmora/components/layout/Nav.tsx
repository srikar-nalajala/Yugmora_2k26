// components/layout/Nav.tsx — Sticky navigation with Events dropdown
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollStore } from "@/hooks/useScrollStore";
import { event } from "@/content/event";
import { trackEvent } from "@/lib/analytics";
import { YugmoraLogo } from "@/components/ui/YugmoraLogo";

interface NavSubItem {
  label: string;
  href: string;
  desc?: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavSubItem[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "#top" },
  {
    label: "Events",
    children: [
      {
        label: "Workshops",
        href: "#workshops",
        desc: "Expert sessions & guest speakers",
      },
      {
        label: "Internship Mela",
        href: "#mela",
        desc: "On-campus fast-track hiring",
      },
      {
        label: "Missions",
        href: "#missions",
        desc: "Industry problem statements",
      },
      {
        label: "How It Works",
        href: "#how",
        desc: "40-hour quest roadmap",
      },
    ],
  },
  { label: "Schedule", href: "#schedule" },
  { label: "Prizes", href: "#prizes" },
  { label: "Partner", href: "#partner" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const scrollY = useScrollStore((s) => s.scrollY);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isScrolled = scrollY > 50;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setEventsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile nav on window resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        isScrolled
          ? "bg-black/85 backdrop-blur-xl border-b border-line shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 group">
          <YugmoraLogo size={34} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-display font-black text-lg tracking-wider text-white">
              YUGMORA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-tagline -mt-1 hidden sm:block">
              STARTS HERE
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div
                  key={item.label}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setEventsOpen(true)}
                  onMouseLeave={() => setEventsOpen(false)}
                >
                  <button
                    onClick={() => setEventsOpen(!eventsOpen)}
                    aria-expanded={eventsOpen}
                    className={`px-3 py-2 text-sm font-medium transition-colors font-body flex items-center gap-1.5 rounded-md ${
                      eventsOpen
                        ? "text-neon-cyan bg-surface-1/60"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`text-[10px] transition-transform duration-200 ${
                        eventsOpen ? "rotate-180 text-neon-cyan" : "text-text-muted"
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {eventsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-64 pt-2"
                      >
                        <div className="hud-card hud-brackets p-3 border border-line bg-surface-1/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] rounded-lg">
                          <div className="text-[10px] font-mono text-neon-cyan uppercase tracking-wider px-3 pt-1 pb-2 border-b border-line/50 mb-1">
                            [ EVENT ACTIVITIES ]
                          </div>
                          <div className="space-y-1">
                            {item.children.map((sub) => (
                              <a
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setEventsOpen(false)}
                                className="block p-2.5 rounded hover:bg-surface-2/80 hover:border-neon-indigo/50 border border-transparent transition-all group"
                              >
                                <div className="font-display font-semibold text-xs text-text group-hover:text-neon-cyan transition-colors flex items-center justify-between">
                                  <span>{sub.label}</span>
                                  <span className="text-[10px] text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                  </span>
                                </div>
                                {sub.desc && (
                                  <div className="text-[11px] text-text-muted font-sans mt-0.5">
                                    {sub.desc}
                                  </div>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm text-text-muted hover:text-white transition-colors font-body rounded-md"
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Desktop Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={event.urls.brochure}
            className="neon-btn neon-btn--ghost text-xs px-3 py-2"
            onClick={() => trackEvent("brochure_download")}
            download
          >
            ↓ Brochure
          </a>
          <a
            href={event.urls.register}
            className="neon-btn neon-btn--primary text-xs px-4 py-2"
            onClick={() => trackEvent("register_click")}
          >
            Register Now
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded border border-line bg-surface-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed inset-x-0 top-[var(--nav-height)] bottom-0 bg-black/95 backdrop-blur-2xl z-[199] overflow-y-auto border-t border-line"
          >
            <div className="flex flex-col p-6 gap-2 max-w-md mx-auto">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div
                      key={item.label}
                      className="border border-line/60 rounded-lg p-3 bg-surface-1/60"
                    >
                      <button
                        onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                        className="w-full flex items-center justify-between font-display font-bold text-base text-text py-1"
                      >
                        <span className="text-neon-cyan">{item.label}</span>
                        <span className="text-xs font-mono">
                          {mobileEventsOpen ? "▲" : "▼"}
                        </span>
                      </button>

                      {mobileEventsOpen && (
                        <div className="mt-2 pt-2 border-t border-line/40 space-y-2 pl-2">
                          {item.children.map((sub) => (
                            <a
                              key={sub.href}
                              href={sub.href}
                              className="block py-1.5 text-sm text-text-muted hover:text-white"
                              onClick={() => setMobileOpen(false)}
                            >
                              <div className="font-semibold text-white">
                                {sub.label}
                              </div>
                              {sub.desc && (
                                <div className="text-xs text-text-muted">
                                  {sub.desc}
                                </div>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="py-2.5 px-3 text-base text-text-muted hover:text-white hover:bg-surface-1 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}

              <hr className="border-line my-4" />

              <a
                href={event.urls.register}
                className="neon-btn neon-btn--primary text-center py-3"
                onClick={() => {
                  trackEvent("register_click");
                  setMobileOpen(false);
                }}
              >
                Register Now →
              </a>
              <a
                href={event.urls.brochure}
                className="neon-btn neon-btn--ghost text-center py-3"
                onClick={() => trackEvent("brochure_download")}
                download
              >
                ↓ Download Brochure (PDF)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
