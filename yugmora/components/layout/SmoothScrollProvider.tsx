// components/layout/SmoothScrollProvider.tsx — Lenis smooth scroll wrapper
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useScrollStore } from "@/hooks/useScrollStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScroll = useScrollStore((s) => s.setScroll);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      // Still track scroll position even without smooth scrolling
      const handler = () => {
        setScroll(window.scrollY, window.innerHeight, document.documentElement.scrollHeight);
      };
      window.addEventListener("scroll", handler, { passive: true });
      handler();
      return () => window.removeEventListener("scroll", handler);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      setScroll(scroll, window.innerHeight, limit + window.innerHeight);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScroll, prefersReduced]);

  return <>{children}</>;
}
