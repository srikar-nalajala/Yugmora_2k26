// context/LiveContentContext.tsx — Reactive state manager for dynamic YUGMORA content
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { event as defaultEvent, keyNumbers as defaultKeyNumbers } from "@/content/event";
import { hero as defaultHero } from "@/content/hero";
import { missions as defaultMissions } from "@/content/missions";
import { workshops as defaultWorkshops } from "@/content/workshops";
import { melaCompanies as defaultMela } from "@/content/mela";
import { schedule as defaultSchedule } from "@/content/schedule";
import { prizes as defaultPrizes } from "@/content/prizes";
import { Mission, Workshop, Company, ScheduleItem, Prize } from "@/content/types";

export type EventData = typeof defaultEvent;
export type KeyNumberItem = typeof defaultKeyNumbers[0];

export interface FullContentState {
  event: EventData;
  keyNumbers: KeyNumberItem[];
  hero: typeof defaultHero;
  missions: Mission[];
  workshops: Workshop[];
  melaCompanies: Company[];
  schedule: ScheduleItem[];
  prizes: Prize[];
}

const DEFAULT_STATE: FullContentState = {
  event: defaultEvent,
  keyNumbers: defaultKeyNumbers,
  hero: defaultHero,
  missions: defaultMissions,
  workshops: defaultWorkshops,
  melaCompanies: defaultMela,
  schedule: defaultSchedule,
  prizes: defaultPrizes,
};

const STORAGE_KEY = "yugmora_live_content_v1";

interface LiveContentContextType {
  content: FullContentState;
  isLoaded: boolean;
  updateEvent: (updated: Partial<EventData>) => void;
  updateKeyNumbers: (numbers: KeyNumberItem[]) => void;
  updateHero: (updated: Partial<typeof defaultHero>) => void;
  updateMissions: (missions: Mission[]) => void;
  updateWorkshops: (workshops: Workshop[]) => void;
  updateMelaCompanies: (companies: Company[]) => void;
  updateSchedule: (schedule: ScheduleItem[]) => void;
  updatePrizes: (prizes: Prize[]) => void;
  resetToDefaults: () => void;
  saveToServer: () => Promise<{ success: boolean; message?: string }>;
  exportContentJSON: () => string;
  importContentJSON: (jsonString: string) => boolean;
}

const LiveContentContext = createContext<LiveContentContextType | null>(null);

export function LiveContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<FullContentState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage and server
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setContent((prev) => ({
          ...prev,
          ...parsed,
          event: { ...prev.event, ...(parsed.event || {}) },
          hero: { ...prev.hero, ...(parsed.hero || {}) },
        }));
      }
    } catch (err) {
      console.error("Failed to load local content cache:", err);
    }

    // Attempt server sync
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.content) {
          setContent((prev) => ({
            ...prev,
            ...data.content,
            event: { ...prev.event, ...(data.content.event || {}) },
            hero: { ...prev.hero, ...(data.content.hero || {}) },
          }));
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.content));
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Save changes to localStorage whenever state changes
  const persistState = useCallback((newState: FullContentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("localStorage quota exceeded or unavailable:", e);
    }
  }, []);

  const updateEvent = useCallback((updated: Partial<EventData>) => {
    setContent((prev) => {
      const next = { ...prev, event: { ...prev.event, ...updated } };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateKeyNumbers = useCallback((numbers: KeyNumberItem[]) => {
    setContent((prev) => {
      const next = { ...prev, keyNumbers: numbers };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateHero = useCallback((updated: Partial<typeof defaultHero>) => {
    setContent((prev) => {
      const next = { ...prev, hero: { ...prev.hero, ...updated } };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateMissions = useCallback((missions: Mission[]) => {
    setContent((prev) => {
      const next = { ...prev, missions };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateWorkshops = useCallback((workshops: Workshop[]) => {
    setContent((prev) => {
      const next = { ...prev, workshops };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateMelaCompanies = useCallback((companies: Company[]) => {
    setContent((prev) => {
      const next = { ...prev, melaCompanies: companies };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateSchedule = useCallback((schedule: ScheduleItem[]) => {
    setContent((prev) => {
      const next = { ...prev, schedule };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updatePrizes = useCallback((prizes: Prize[]) => {
    setContent((prev) => {
      const next = { ...prev, prizes };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const resetToDefaults = useCallback(() => {
    setContent(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset: true }),
    }).catch(() => {});
  }, []);

  const saveToServer = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      return { success: data.success ?? true, message: data.message };
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message };
    }
  }, [content]);

  const exportContentJSON = useCallback(() => {
    return JSON.stringify(content, null, 2);
  }, [content]);

  const importContentJSON = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") return false;
      setContent((prev) => {
        const next = { ...prev, ...parsed };
        persistState(next);
        return next;
      });
      return true;
    } catch {
      return false;
    }
  }, [persistState]);

  return (
    <LiveContentContext.Provider
      value={{
        content,
        isLoaded,
        updateEvent,
        updateKeyNumbers,
        updateHero,
        updateMissions,
        updateWorkshops,
        updateMelaCompanies,
        updateSchedule,
        updatePrizes,
        resetToDefaults,
        saveToServer,
        exportContentJSON,
        importContentJSON,
      }}
    >
      {children}
    </LiveContentContext.Provider>
  );
}

export function useLiveContent() {
  const ctx = useContext(LiveContentContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      content: DEFAULT_STATE,
      isLoaded: true,
      updateEvent: () => {},
      updateKeyNumbers: () => {},
      updateHero: () => {},
      updateMissions: () => {},
      updateWorkshops: () => {},
      updateMelaCompanies: () => {},
      updateSchedule: () => {},
      updatePrizes: () => {},
      resetToDefaults: () => {},
      saveToServer: async () => ({ success: true }),
      exportContentJSON: () => JSON.stringify(DEFAULT_STATE, null, 2),
      importContentJSON: () => false,
    };
  }
  return ctx;
}
