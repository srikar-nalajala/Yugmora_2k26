// hooks/useScrollStore.ts — Zustand store for scroll progress
"use client";

import { create } from "zustand";

interface ScrollState {
  progress: number; // 0–1
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
  currentHour: number; // 0–40 mapped from progress
  setScroll: (scrollY: number, viewportHeight: number, documentHeight: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  scrollY: 0,
  viewportHeight: 0,
  documentHeight: 0,
  currentHour: 0,
  setScroll: (scrollY, viewportHeight, documentHeight) => {
    const maxScroll = documentHeight - viewportHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    const currentHour = Math.round(progress * 40);
    set({ progress, scrollY, viewportHeight, documentHeight, currentHour });
  },
}));
