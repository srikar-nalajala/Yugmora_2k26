"use client";

import { usePathname } from "next/navigation";
import { event } from "@/content/event";
import { YugmoraLogo } from "@/components/ui/YugmoraLogo";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/srikar")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <YugmoraLogo size={32} />
              <span className="font-display font-black text-xl tracking-wide">
                YUGMORA
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              40 Hours. Real Problems. Real Impact. A hackathon that bridges
              industry and academia.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mono-label mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "About", href: "#about" },
                { label: "Problem Statements", href: "#missions" },
                { label: "Workshops", href: "#workshops" },
                { label: "Schedule", href: "#schedule" },
                { label: "Partner With Us", href: "#partner" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-muted hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="mono-label mb-4">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(event.socials).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-line flex items-center justify-center text-text-muted hover:text-neon-cyan hover:border-neon-cyan transition-colors text-xs font-mono uppercase"
                  aria-label={platform}
                >
                  {platform.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-line my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <span>© {year} Yugmora. All rights reserved.</span>
          <span className="font-mono text-xs">
            {event.college} • {event.city}
          </span>
        </div>
      </div>
    </footer>
  );
}
