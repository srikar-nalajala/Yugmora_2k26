// app/srikar/page.tsx — Secret Administrative Command Center
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLiveContent } from "@/context/LiveContentContext";
import { YugmoraLogo } from "@/components/ui/YugmoraLogo";
import { Domain, Mission, Workshop, Company, ScheduleItem, Prize } from "@/content/types";
import { getCountdown, padTwo } from "@/lib/countdown";

const DOMAINS: Domain[] = [
  "AI/ML",
  "Web & Mobile",
  "Cybersecurity",
  "IoT & Embedded",
  "Data Analytics",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AgriTech",
  "Sustainability",
  "Open Innovation",
];

interface PartnerSubmission {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
  status: "new" | "contacted" | "approved" | "archived";
}

export default function SrikarAdminPage() {
  const {
    content,
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
  } = useLiveContent();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Active Tab
  type TabType =
    | "overview"
    | "event"
    | "missions"
    | "workshops"
    | "mela"
    | "schedule"
    | "prizes"
    | "partners"
    | "json";
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Notifications
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Partner submissions
  const [submissions, setSubmissions] = useState<PartnerSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Check existing session via server-side cookie validation
  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setSessionChecked(true));
  }, []);

  // Fetch partner submissions when tab is active
  useEffect(() => {
    if (activeTab === "partners" && isAuthenticated) {
      setLoadingSubmissions(true);
      fetch("/api/partner")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.submissions) {
            setSubmissions(data.submissions);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingSubmissions(false));
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setAuthError("RATE LIMITED: Too many attempts. Wait 60 seconds.");
      } else if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("ACCESS DENIED: Invalid Passcode.");
      }
    } catch {
      setAuthError("CONNECTION ERROR: Could not reach server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Logout even if the API call fails
    }
    setIsAuthenticated(false);
  };

  const handlePublish = async () => {
    setSaveStatus("Publishing changes to live environment...");
    const result = await saveToServer();
    if (result.success) {
      setSaveStatus("SAVED & PUBLISHED LIVE! All visitor sessions updated.");
    } else {
      setSaveStatus("Saved locally in browser cache.");
    }
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportContentJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yugmora_content_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Live countdown preview
  const countdown = useMemo(() => {
    return getCountdown(content.event.eventStartISO);
  }, [content.event.eventStartISO]);

  // ==========================================
  // PASSCODE LOCK SCREEN
  // ==========================================
  // Show loading state while checking session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="text-neon-cyan font-mono text-sm animate-pulse">Verifying session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#2a2160 1px, transparent 1px), linear-gradient(90deg, #2a2160 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-md w-full relative z-10 bg-[#080d1e]/90 border border-line p-8 rounded-xl shadow-[0_0_50px_rgba(0,123,244,0.2)] backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <YugmoraLogo size={36} />
            <div>
              <h1 className="font-display font-black text-xl tracking-wider text-white">
                SRIKAR // CONSOLE
              </h1>
              <p className="font-mono text-xs text-neon-cyan tracking-widest uppercase">
                RESTRICTED ACCESS
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-text-muted mb-2 uppercase tracking-wider">
                Enter Master Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode..."
                className="w-full bg-[#030611] border border-line focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan text-white px-4 py-3 rounded font-mono text-sm outline-none transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <p className="font-mono text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800/50">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full neon-btn neon-btn--primary py-3 text-sm font-mono uppercase tracking-wider disabled:opacity-50 disabled:cursor-wait"
            >
              {authLoading ? "Authenticating..." : "Authorize Access"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-line/40 text-center">
            <p className="font-mono text-[11px] text-text-muted/60">
              Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHORIZED COMMAND CENTER
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-body">
      {/* Top HUD Bar */}
      <header className="sticky top-0 z-50 bg-[#060a18]/95 backdrop-blur-xl border-b border-line px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <YugmoraLogo size={32} />
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="font-display font-black text-lg tracking-wider text-white">
                SRIKAR COMMAND CENTER
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan rounded">
                LIVE ADMIN
              </span>
            </div>
            <p className="font-mono text-[10px] text-text-muted">
              Active Target: {content.event.name} // {content.event.dates}
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-mono bg-surface-2 hover:bg-surface-1 border border-line rounded text-text-muted hover:text-white transition flex items-center gap-1.5"
          >
            <span>Public Site</span>
            <span>↗</span>
          </a>

          <button
            onClick={handleDownloadBackup}
            className="px-3 py-1.5 text-xs font-mono bg-surface-2 hover:bg-surface-1 border border-line rounded text-neon-cyan hover:border-neon-cyan transition"
            title="Download JSON copy of all current settings"
          >
            Backup JSON
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-neon-blue to-neon-indigo hover:brightness-110 text-white rounded shadow-[0_0_15px_rgba(0,123,244,0.5)] transition"
          >
            Publish Live
          </button>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded border border-transparent hover:border-red-900/50 transition"
            title="Lock Console"
          >
            Lock
          </button>
        </div>
      </header>

      {/* Save status alert */}
      {saveStatus && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-6 py-2 text-center font-mono text-xs text-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
          <span>✓</span>
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav Tabs */}
        <aside className="w-full md:w-64 bg-[#050816] border-r border-line p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0">
          {[
            { id: "overview", label: "Dashboard & Status", icon: "⚡" },
            { id: "event", label: "Event & Timers", icon: "⏱" },
            { id: "missions", label: "Problem Statements", icon: "🎯", badge: content.missions.length },
            { id: "workshops", label: "Workshops", icon: "🛠", badge: content.workshops.length },
            { id: "mela", label: "Internship Mela", icon: "💼", badge: content.melaCompanies.length },
            { id: "schedule", label: "Schedule (40 Hrs)", icon: "📅", badge: content.schedule.length },
            { id: "prizes", label: "Prizes & Rewards", icon: "🏆" },
            { id: "partners", label: "Partner Inquiries", icon: "📬" },
            { id: "json", label: "Raw JSON / Config", icon: "⚙" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono transition text-left whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? "bg-neon-blue/20 text-white border border-neon-cyan/50 font-bold shadow-[0_0_12px_rgba(34,225,255,0.15)]"
                    : "text-text-muted hover:text-white hover:bg-surface-1"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0b1026] text-text-muted border border-line">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="hidden md:block mt-auto pt-6 border-t border-line/50 p-2">
            <button
              onClick={() => {
                if (confirm("Reset ALL data back to default template? Unsaved edits will be lost.")) {
                  resetToDefaults();
                  setSaveStatus("Reset to default configuration.");
                  setTimeout(() => setSaveStatus(null), 3000);
                }
              }}
              className="w-full text-left font-mono text-[11px] text-text-muted/60 hover:text-red-400 p-1 transition"
            >
              ↺ Reset to Defaults
            </button>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl text-white mb-1">
                  SYSTEM OVERVIEW
                </h2>
                <p className="font-mono text-xs text-text-muted">
                  Live operational telemetry and landing page controls
                </p>
              </div>

              {/* Countdown Status Card */}
              <div className="hud-card p-6 rounded-xl bg-gradient-to-br from-surface-1 to-[#090e24] border border-line">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="mono-label text-[11px] text-neon-cyan">
                      [ LIVE COUNTDOWN STATUS ]
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-1">
                      Target: {content.event.eventStartISO || "NO START DATE CONFIGURED"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("event")}
                    className="px-3 py-1 text-xs font-mono text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/10 rounded transition"
                  >
                    Change Date & Time →
                  </button>
                </div>

                {content.event.eventStartISO ? (
                  <div className="flex items-center gap-4 font-mono">
                    {[
                      { val: padTwo(countdown.days), label: "DAYS" },
                      { val: padTwo(countdown.hours), label: "HOURS" },
                      { val: padTwo(countdown.minutes), label: "MIN" },
                      { val: padTwo(countdown.seconds), label: "SEC" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#030611] border border-line px-4 py-3 rounded-lg text-center min-w-[72px]"
                      >
                        <div className="text-2xl sm:text-3xl font-bold text-neon-cyan drop-shadow">
                          {item.val}
                        </div>
                        <div className="text-[9px] text-text-muted tracking-widest mt-1">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded text-xs font-mono text-amber-300">
                    ⚠ Countdown timer is currently inactive because no valid ISO date is set. Go to the{" "}
                    <strong>Event & Timers</strong> tab to select the start date and time.
                  </div>
                )}
              </div>

              {/* Metric Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Missions", count: content.missions.length, tab: "missions" },
                  { label: "Workshops", count: content.workshops.length, tab: "workshops" },
                  { label: "Mela Companies", count: content.melaCompanies.length, tab: "mela" },
                  { label: "Schedule Slots", count: content.schedule.length, tab: "schedule" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveTab(stat.tab as TabType)}
                    className="hud-card p-4 rounded-lg bg-surface-1 border border-line cursor-pointer hover:border-neon-cyan transition group"
                  >
                    <div className="text-3xl font-display font-black text-white group-hover:text-neon-cyan transition">
                      {stat.count}
                    </div>
                    <div className="font-mono text-xs text-text-muted mt-1 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions Panel */}
              <div className="border border-line rounded-xl p-6 bg-surface-1/50 space-y-4">
                <h3 className="font-display font-bold text-sm tracking-wider uppercase text-text-muted">
                  Quick Management Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab("missions")}
                    className="p-3 text-left border border-line hover:border-neon-cyan rounded bg-surface-2 transition text-xs font-mono"
                  >
                    <span className="block font-bold text-white mb-1">+ Add New Problem Statement</span>
                    <span className="text-text-muted text-[11px]">Upload challenges, difficulty, tracks</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("event")}
                    className="p-3 text-left border border-line hover:border-neon-cyan rounded bg-surface-2 transition text-xs font-mono"
                  >
                    <span className="block font-bold text-white mb-1">Update Event Metadata</span>
                    <span className="text-text-muted text-[11px]">College, venue, fee & deadlines</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("partners")}
                    className="p-3 text-left border border-line hover:border-neon-cyan rounded bg-surface-2 transition text-xs font-mono"
                  >
                    <span className="block font-bold text-white mb-1">Review Partner Leads</span>
                    <span className="text-text-muted text-[11px]">View incoming sponsorship enquiries</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVENT & TIMERS */}
          {activeTab === "event" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl text-white mb-1">
                  EVENT METADATA & TIMERS
                </h2>
                <p className="font-mono text-xs text-text-muted">
                  Configure countdown timer, college details, venue, dates, and registration settings
                </p>
              </div>

              {/* Countdown ISO Control */}
              <div className="hud-card p-5 rounded-xl border border-neon-cyan/40 bg-surface-1">
                <h3 className="font-display font-bold text-base text-neon-cyan mb-2">
                  Countdown Timer Start Date & Time
                </h3>
                <p className="font-mono text-xs text-text-muted mb-4">
                  Set the exact start time for the hackathon. The countdown on the Hero section updates instantly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1">
                      Pick Date & Time (Local)
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        content.event.eventStartISO
                          ? new Date(content.event.eventStartISO).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const iso = new Date(val).toISOString();
                          updateEvent({ eventStartISO: iso });
                        } else {
                          updateEvent({ eventStartISO: "" });
                        }
                      }}
                      className="w-full bg-[#030611] border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1">
                      Current ISO Value
                    </label>
                    <input
                      type="text"
                      value={content.event.eventStartISO || ""}
                      onChange={(e) => updateEvent({ eventStartISO: e.target.value })}
                      placeholder="e.g. 2026-10-15T09:00:00Z"
                      className="w-full bg-[#030611] border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Event Core Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Event Name</label>
                  <input
                    type="text"
                    value={content.event.name}
                    onChange={(e) => updateEvent({ name: e.target.value })}
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Tagline</label>
                  <input
                    type="text"
                    value={content.event.tagline}
                    onChange={(e) => updateEvent({ tagline: e.target.value })}
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">College / University Name</label>
                  <input
                    type="text"
                    value={content.event.college}
                    onChange={(e) => updateEvent({ college: e.target.value })}
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Campus Venue</label>
                  <input
                    type="text"
                    value={content.event.venue}
                    onChange={(e) => updateEvent({ venue: e.target.value })}
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Event Dates Text</label>
                  <input
                    type="text"
                    value={content.event.dates}
                    onChange={(e) => updateEvent({ dates: e.target.value })}
                    placeholder="e.g. October 15–17, 2026"
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Registration Fee</label>
                  <input
                    type="text"
                    value={content.event.fee}
                    onChange={(e) => updateEvent({ fee: e.target.value })}
                    placeholder="e.g. Free or Rs. 500 / Team"
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Team Size</label>
                  <input
                    type="text"
                    value={content.event.teamSize}
                    onChange={(e) => updateEvent({ teamSize: e.target.value })}
                    placeholder="e.g. 3–5 members"
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-text-muted mb-1">Registration URL</label>
                  <input
                    type="text"
                    value={content.event.urls.register}
                    onChange={(e) =>
                      updateEvent({
                        urls: { ...content.event.urls, register: e.target.value },
                        registerUrl: e.target.value,
                      })
                    }
                    className="w-full bg-surface-1 border border-line focus:border-neon-cyan text-white p-2.5 rounded font-mono text-xs outline-none"
                  />
                </div>
              </div>

              {/* Deadlines Strip */}
              <div className="border border-line rounded-xl p-5 bg-surface-1/60 space-y-4">
                <h3 className="font-display font-bold text-sm text-text-muted uppercase">
                  Deadlines & Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1">Registration Deadline</label>
                    <input
                      type="text"
                      value={content.event.deadlines.registration}
                      onChange={(e) =>
                        updateEvent({
                          deadlines: {
                            ...content.event.deadlines,
                            registration: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#030611] border border-line focus:border-neon-cyan text-white p-2 rounded font-mono text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1">Team Formation Deadline</label>
                    <input
                      type="text"
                      value={content.event.deadlines.teamFormation}
                      onChange={(e) =>
                        updateEvent({
                          deadlines: {
                            ...content.event.deadlines,
                            teamFormation: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#030611] border border-line focus:border-neon-cyan text-white p-2 rounded font-mono text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-text-muted mb-1">Project Submission</label>
                    <input
                      type="text"
                      value={content.event.deadlines.projectSubmission}
                      onChange={(e) =>
                        updateEvent({
                          deadlines: {
                            ...content.event.deadlines,
                            projectSubmission: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#030611] border border-line focus:border-neon-cyan text-white p-2 rounded font-mono text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Key Numbers Strip */}
              <div className="border border-line rounded-xl p-5 bg-surface-1/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-text-muted uppercase">
                    Key Metric Numbers (Hero Strip)
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {content.keyNumbers.map((kn, idx) => (
                    <div key={idx} className="bg-[#030611] border border-line p-3 rounded">
                      <input
                        type="text"
                        value={String(kn.value)}
                        onChange={(e) => {
                          const updated = [...content.keyNumbers];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          updateKeyNumbers(updated);
                        }}
                        className="w-full bg-surface-2 text-neon-cyan font-display font-black text-lg p-1 rounded text-center mb-1 outline-none"
                      />
                      <input
                        type="text"
                        value={kn.label}
                        onChange={(e) => {
                          const updated = [...content.keyNumbers];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          updateKeyNumbers(updated);
                        }}
                        className="w-full bg-transparent text-text-muted text-[10px] font-mono text-center outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROBLEM STATEMENTS (MISSIONS) */}
          {activeTab === "missions" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-white mb-1">
                    PROBLEM STATEMENTS (MISSIONS)
                  </h2>
                  <p className="font-mono text-xs text-text-muted">
                    Manage hackathon challenges, difficulty, tracks, and unlock schedules
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newId = `YG-${padTwo(content.missions.length + 1)}`;
                    const newMission: Mission = {
                      id: newId,
                      title: "New Challenge Title",
                      company: { name: "Partner Company" },
                      domain: "AI/ML",
                      difficulty: 3,
                      background: "Industry context and real-world problem background.",
                      challenge: "Core objective and problem requirement.",
                      deliverables: ["Functional Prototype", "Architecture Diagram", "Pitch Deck"],
                      mentors: ["Lead Mentor Name"],
                      locked: false,
                    };
                    updateMissions([newMission, ...content.missions]);
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 rounded transition flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>Add Problem Statement</span>
                </button>
              </div>

              {/* Missions List */}
              <div className="space-y-4">
                {content.missions.map((mission, idx) => (
                  <div
                    key={mission.id || idx}
                    className="border border-line rounded-xl p-5 bg-surface-1 hover:border-line/80 transition space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line/40">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/30">
                          {mission.id}
                        </span>
                        <input
                          type="text"
                          value={mission.title}
                          onChange={(e) => {
                            const updated = [...content.missions];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            updateMissions(updated);
                          }}
                          className="bg-transparent text-white font-display font-bold text-base outline-none focus:border-b border-neon-cyan"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs font-mono text-text-muted cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!mission.locked}
                            onChange={(e) => {
                              const updated = [...content.missions];
                              updated[idx] = { ...updated[idx], locked: e.target.checked };
                              updateMissions(updated);
                            }}
                            className="accent-neon-pink"
                          />
                          <span>Locked</span>
                        </label>

                        <button
                          onClick={() => {
                            if (confirm(`Delete mission ${mission.id}: "${mission.title}"?`)) {
                              updateMissions(content.missions.filter((_, i) => i !== idx));
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded border border-line"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-mono text-[10px] text-text-muted mb-1 uppercase">
                          Company Sponsor
                        </label>
                        <input
                          type="text"
                          value={mission.company.name}
                          onChange={(e) => {
                            const updated = [...content.missions];
                            updated[idx] = {
                              ...updated[idx],
                              company: { ...updated[idx].company, name: e.target.value },
                            };
                            updateMissions(updated);
                          }}
                          className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-white font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-text-muted mb-1 uppercase">
                          Track / Domain
                        </label>
                        <select
                          value={mission.domain}
                          onChange={(e) => {
                            const updated = [...content.missions];
                            updated[idx] = {
                              ...updated[idx],
                              domain: e.target.value as Domain,
                            };
                            updateMissions(updated);
                          }}
                          className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-white font-mono outline-none"
                        >
                          {DOMAINS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-text-muted mb-1 uppercase">
                          Difficulty (1 - 5)
                        </label>
                        <select
                          value={mission.difficulty || 3}
                          onChange={(e) => {
                            const updated = [...content.missions];
                            updated[idx] = {
                              ...updated[idx],
                              difficulty: Number(e.target.value) as 1 | 2 | 3 | 4 | 5,
                            };
                            updateMissions(updated);
                          }}
                          className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-white font-mono outline-none"
                        >
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <option key={lvl} value={lvl}>
                              Level {lvl} {"★".repeat(lvl)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-text-muted mb-1 uppercase">
                        Problem Challenge Description
                      </label>
                      <textarea
                        value={mission.challenge}
                        onChange={(e) => {
                          const updated = [...content.missions];
                          updated[idx] = { ...updated[idx], challenge: e.target.value };
                          updateMissions(updated);
                        }}
                        rows={2}
                        className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-text-muted font-body outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WORKSHOPS */}
          {activeTab === "workshops" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-white mb-1">
                    WORKSHOPS & MASTERCLASSES
                  </h2>
                  <p className="font-mono text-xs text-text-muted">
                    Manage speaker sessions, timings, and hands-on developer tracks
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newWorkshop: Workshop = {
                      id: `ws-${content.workshops.length + 1}`,
                      title: "New Workshop Session",
                      domain: "AI/ML",
                      speakerId: "speaker-1",
                      datetime: "Day 1, 02:00 PM",
                      duration: "90 mins",
                    };
                    updateWorkshops([...content.workshops, newWorkshop]);
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 rounded transition"
                >
                  + Add Workshop
                </button>
              </div>

              <div className="space-y-3">
                {content.workshops.map((ws, idx) => (
                  <div
                    key={ws.id || idx}
                    className="border border-line rounded-lg p-4 bg-surface-1 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-[240px] space-y-2">
                      <input
                        type="text"
                        value={ws.title}
                        onChange={(e) => {
                          const updated = [...content.workshops];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          updateWorkshops(updated);
                        }}
                        className="w-full bg-transparent text-white font-display font-bold text-sm outline-none border-b border-transparent focus:border-neon-cyan"
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={ws.domain}
                          onChange={(e) => {
                            const updated = [...content.workshops];
                            updated[idx] = { ...updated[idx], domain: e.target.value as Domain };
                            updateWorkshops(updated);
                          }}
                          className="bg-[#030611] border border-line text-[11px] font-mono text-neon-cyan px-2 py-1 rounded outline-none"
                        >
                          {DOMAINS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={ws.datetime}
                          onChange={(e) => {
                            const updated = [...content.workshops];
                            updated[idx] = { ...updated[idx], datetime: e.target.value };
                            updateWorkshops(updated);
                          }}
                          placeholder="Datetime (e.g. Day 1, 14:00)"
                          className="bg-[#030611] border border-line text-[11px] font-mono text-text-muted px-2 py-1 rounded outline-none"
                        />

                        <input
                          type="text"
                          value={ws.duration}
                          onChange={(e) => {
                            const updated = [...content.workshops];
                            updated[idx] = { ...updated[idx], duration: e.target.value };
                            updateWorkshops(updated);
                          }}
                          placeholder="Duration (e.g. 90 mins)"
                          className="bg-[#030611] border border-line text-[11px] font-mono text-text-muted px-2 py-1 rounded outline-none w-24"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        updateWorkshops(content.workshops.filter((_, i) => i !== idx));
                      }}
                      className="px-2.5 py-1 text-xs font-mono text-red-400 hover:text-red-300 border border-line rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INTERNSHIP MELA */}
          {activeTab === "mela" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-white mb-1">
                    INTERNSHIP MELA RECRUITERS
                  </h2>
                  <p className="font-mono text-xs text-text-muted">
                    Hiring partners, job profiles, stipends, and eligibility criteria
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newCompany: Company = {
                      name: "Tech Partner Company",
                      roles: ["Full Stack Intern", "AI Engineer"],
                      type: "Internship / PPO",
                      eligibility: "Open to 3rd & 4th year students",
                      stipend: "Rs. 25,000 - 45,000 / mo",
                    };
                    updateMelaCompanies([...content.melaCompanies, newCompany]);
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 rounded transition"
                >
                  + Add Recruiter
                </button>
              </div>

              <div className="space-y-4">
                {content.melaCompanies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="border border-line rounded-xl p-4 bg-surface-1 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => {
                          const updated = [...content.melaCompanies];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          updateMelaCompanies(updated);
                        }}
                        className="bg-transparent text-white font-display font-bold text-base outline-none focus:border-b border-neon-cyan"
                      />
                      <button
                        onClick={() => {
                          updateMelaCompanies(content.melaCompanies.filter((_, i) => i !== idx));
                        }}
                        className="px-2 py-1 text-xs font-mono text-red-400 hover:text-red-300 border border-line rounded"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-mono text-[10px] text-text-muted mb-1">Stipend Range</label>
                        <input
                          type="text"
                          value={comp.stipend}
                          onChange={(e) => {
                            const updated = [...content.melaCompanies];
                            updated[idx] = { ...updated[idx], stipend: e.target.value };
                            updateMelaCompanies(updated);
                          }}
                          className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-neon-cyan font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-text-muted mb-1">Opportunity Type</label>
                        <select
                          value={comp.type}
                          onChange={(e) => {
                            const updated = [...content.melaCompanies];
                            updated[idx] = {
                              ...updated[idx],
                              type: e.target.value as "Internship" | "PPO" | "Internship / PPO",
                            };
                            updateMelaCompanies(updated);
                          }}
                          className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-white font-mono outline-none"
                        >
                          <option value="Internship">Internship</option>
                          <option value="PPO">PPO</option>
                          <option value="Internship / PPO">Internship / PPO</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-text-muted mb-1">Eligibility Criteria</label>
                        <input
                          type="text"
                          value={comp.eligibility}
                          onChange={(e) => {
                            const updated = [...content.melaCompanies];
                            updated[idx] = { ...updated[idx], eligibility: e.target.value };
                            updateMelaCompanies(updated);
                          }}
                          className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-white font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-text-muted mb-1">
                        Hiring Roles (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={comp.roles.join(", ")}
                        onChange={(e) => {
                          const updated = [...content.melaCompanies];
                          updated[idx] = {
                            ...updated[idx],
                            roles: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                          };
                          updateMelaCompanies(updated);
                        }}
                        className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-text-muted font-mono outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SCHEDULE */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-white mb-1">
                    40-HOUR TIMELINE SCHEDULE
                  </h2>
                  <p className="font-mono text-xs text-text-muted">
                    Hour markers, ceremony dates, check-ins, pitching, and awards
                  </p>
                </div>
                <button
                  onClick={() => {
                    const nextHour = content.schedule.length ? content.schedule[content.schedule.length - 1].hourStart + 4 : 0;
                    const newSlot: ScheduleItem = {
                      hourLabel: `HOUR ${padTwo(nextHour)}`,
                      hourStart: nextHour,
                      time: "12:00 PM",
                      activity: "Milestone Activity Description",
                    };
                    updateSchedule([...content.schedule, newSlot]);
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 rounded transition"
                >
                  + Add Timeline Item
                </button>
              </div>

              <div className="space-y-2">
                {content.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-line rounded-lg p-3 bg-surface-1 flex flex-wrap items-center gap-3"
                  >
                    <input
                      type="text"
                      value={item.hourLabel}
                      onChange={(e) => {
                        const updated = [...content.schedule];
                        updated[idx] = { ...updated[idx], hourLabel: e.target.value };
                        updateSchedule(updated);
                      }}
                      className="w-24 bg-[#030611] border border-line p-1.5 rounded text-xs font-mono text-neon-cyan text-center outline-none"
                    />

                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => {
                        const updated = [...content.schedule];
                        updated[idx] = { ...updated[idx], time: e.target.value };
                        updateSchedule(updated);
                      }}
                      placeholder="Time (e.g. 10:00 AM)"
                      className="w-28 bg-[#030611] border border-line p-1.5 rounded text-xs font-mono text-text-muted text-center outline-none"
                    />

                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => {
                        const updated = [...content.schedule];
                        updated[idx] = { ...updated[idx], activity: e.target.value };
                        updateSchedule(updated);
                      }}
                      placeholder="Activity Description"
                      className="flex-1 min-w-[200px] bg-transparent border-b border-transparent focus:border-neon-cyan p-1.5 text-xs text-white outline-none"
                    />

                    <button
                      onClick={() => {
                        updateSchedule(content.schedule.filter((_, i) => i !== idx));
                      }}
                      className="text-red-400 hover:text-red-300 text-xs font-mono px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PRIZES */}
          {activeTab === "prizes" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl text-white mb-1">
                  PRIZES & BOUNTIES
                </h2>
                <p className="font-mono text-xs text-text-muted">
                  Prize pool awards, track bounties, and podium rewards
                </p>
              </div>

              <div className="space-y-3">
                {content.prizes.map((pz, idx) => (
                  <div
                    key={idx}
                    className="border border-line rounded-lg p-4 bg-surface-1 flex flex-wrap items-center gap-4"
                  >
                    <div className="w-48">
                      <label className="block font-mono text-[10px] text-text-muted mb-1 uppercase">Award Title</label>
                      <input
                        type="text"
                        value={pz.award}
                        onChange={(e) => {
                          const updated = [...content.prizes];
                          updated[idx] = { ...updated[idx], award: e.target.value };
                          updatePrizes(updated);
                        }}
                        className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-white font-mono outline-none"
                      />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <label className="block font-mono text-[10px] text-text-muted mb-1 uppercase">Reward Value / Description</label>
                      <input
                        type="text"
                        value={pz.reward}
                        onChange={(e) => {
                          const updated = [...content.prizes];
                          updated[idx] = { ...updated[idx], reward: e.target.value };
                          updatePrizes(updated);
                        }}
                        className="w-full bg-[#030611] border border-line p-2 rounded text-xs text-neon-cyan font-mono outline-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        updatePrizes(content.prizes.filter((_, i) => i !== idx));
                      }}
                      className="self-end px-2.5 py-2 text-xs font-mono text-red-400 hover:text-red-300 border border-line rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  updatePrizes([...content.prizes, { award: "New Award Category", reward: "Rs. 25,000 + Goodies" }]);
                }}
                className="px-4 py-2 text-xs font-mono font-bold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 rounded transition"
              >
                + Add Award Category
              </button>
            </div>
          )}

          {/* TAB 8: PARTNER INQUIRIES */}
          {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-white mb-1">
                    PARTNERSHIP INQUIRIES
                  </h2>
                  <p className="font-mono text-xs text-text-muted">
                    Submissions received via the public website's Partner With Us form
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLoadingSubmissions(true);
                    fetch("/api/partner")
                      .then((res) => res.json())
                      .then((data) => setSubmissions(data.submissions || []))
                      .finally(() => setLoadingSubmissions(false));
                  }}
                  className="px-3 py-1.5 text-xs font-mono bg-surface-2 border border-line rounded text-text-muted hover:text-white"
                >
                  Refresh Inquiries
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-12 font-mono text-xs text-text-muted">
                  Loading inquiries...
                </div>
              ) : submissions.length === 0 ? (
                <div className="border border-line rounded-xl p-12 text-center bg-surface-1">
                  <p className="font-mono text-sm text-text-muted">
                    No partnership submissions received yet.
                  </p>
                  <p className="font-mono text-xs text-text-muted/60 mt-2">
                    When visitors submit the form under #partner, inquiries will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-line rounded-xl p-5 bg-surface-1 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line/50">
                        <div>
                          <span className="font-mono text-xs text-neon-cyan font-bold mr-2">
                            {sub.company}
                          </span>
                          <span className="text-sm font-bold text-white">
                            ({sub.name} — {sub.role})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 border border-line text-text-muted">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                              sub.status === "new"
                                ? "bg-amber-950/40 text-amber-400 border-amber-800"
                                : sub.status === "approved"
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800"
                                : "bg-blue-950/40 text-blue-400 border-blue-800"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-text-muted">
                        <div>
                          Email: <a href={`mailto:${sub.email}`} className="text-white hover:underline">{sub.email}</a>
                        </div>
                        <div>
                          Phone: <a href={`tel:${sub.phone}`} className="text-white hover:underline">{sub.phone}</a>
                        </div>
                        <div>
                          Type: <span className="text-neon-pink font-bold">{sub.partnershipType}</span>
                        </div>
                      </div>

                      <div className="bg-[#030611] p-3 rounded text-xs text-text-muted font-body leading-relaxed">
                        {sub.message}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={async () => {
                            await fetch("/api/partner", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: sub.id, status: "contacted" }),
                            });
                            setSubmissions((prev) =>
                              prev.map((s) => (s.id === sub.id ? { ...s, status: "contacted" } : s))
                            );
                          }}
                          className="px-2.5 py-1 text-[11px] font-mono bg-surface-2 hover:bg-surface-1 border border-line rounded text-text-muted"
                        >
                          Mark Contacted
                        </button>
                        <button
                          onClick={async () => {
                            await fetch("/api/partner", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: sub.id, status: "approved" }),
                            });
                            setSubmissions((prev) =>
                              prev.map((s) => (s.id === sub.id ? { ...s, status: "approved" } : s))
                            );
                          }}
                          className="px-2.5 py-1 text-[11px] font-mono bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800 text-emerald-300 rounded"
                        >
                          Approve Partner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: RAW JSON / CONFIG */}
          {activeTab === "json" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl text-white mb-1">
                  RAW JSON CONFIGURATION
                </h2>
                <p className="font-mono text-xs text-text-muted">
                  Direct JSON payload for backup, migration, or external API integration
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={exportContentJSON()}
                  onChange={(e) => {
                    importContentJSON(e.target.value);
                  }}
                  rows={22}
                  className="w-full bg-[#030611] border border-line focus:border-neon-cyan p-4 rounded-xl font-mono text-xs text-slate-300 leading-relaxed outline-none"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(exportContentJSON());
                      setSaveStatus("JSON copied to clipboard!");
                      setTimeout(() => setSaveStatus(null), 2500);
                    }}
                    className="px-4 py-2 text-xs font-mono bg-surface-2 hover:bg-surface-1 border border-line rounded text-white"
                  >
                    Copy JSON to Clipboard
                  </button>
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 text-xs font-mono bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded"
                  >
                    Download JSON File
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
