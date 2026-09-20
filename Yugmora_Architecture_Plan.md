# YUGMORA: Immersive Landing Page: Architecture & Build Plan

> Paste this whole file into Antigravity as the first prompt, and also save it in the repo root as `ARCHITECTURE.md` so every agent run can re-read it.

---

## 0. Mission

Build the official landing page for **Yugmora**, a 40-hour campus hackathon where companies and startups contribute real problem statements, guest speakers run problem-aligned workshops, and an Internship Mela turns the best builders into interns.

The page must feel **immersive and retro-futuristic**: 3D elements, neon on dark, a showcase carousel, community features and a clear download CTA. It must also convert: **Register Now** is the primary goal, **Download Brochure** the secondary goal.

### Working rules for the agent
1. **Never invent content.** All copy lives in `/content/*.ts`, taken from the provided `Yugmora_Website_Content.docx`. Anything in `[square brackets]` is a placeholder and stays as-is until the organisers supply real data.
2. **Build in the phases listed in Section 12.** Finish and verify a phase before starting the next. Commit after each phase.
3. **Verify visually.** After each phase, open the running app in the browser and check widths 375, 768 and 1440 px, then fix problems before moving on.
4. **HTML first, 3D second.** All text, CTAs and content must be real DOM (good for LCP, SEO and accessibility). The 3D scene is enhancement only and must never block content.
5. **Every animation must respect `prefers-reduced-motion`** and have a low-power fallback (Section 7).

---

## 1. How the brief maps to the Yugmora content

The brief was written generically ("game showcase", "community", "download"). Yugmora is a hackathon, so each element is mapped as follows:

| Brief asks for | Yugmora implementation |
|---|---|
| Immersive 3D elements | Fixed full-page WebGL scene: 3D faceted **Y emblem** (from the logo), synthwave grid floor, retro sun, starfield, scroll-driven camera |
| Retro-futuristic style | Grid horizon, CRT scanlines, neon glow, chamfered HUD cards, monospace labels, boot-sequence preloader |
| **Game showcase carousel** | **"Mission Select" carousel**: each industry problem statement (YG-01, YG-02…) is an arcade-style mission card in a 3D coverflow. A second carousel, **"Player Select"**, shows guest speakers with the same component |
| **Community features** | Join WhatsApp/Discord, team-finder for solo registrants, cross-branch team encouragement, live-style counters, social links, mentor/speaker presence (all grounded in doc sections 5.5, 10.2, 14) |
| **Download CTA** | **Download Brochure** (from doc hero buttons) and **Partnership Brochure** (doc 11.3), in the hero, in the sticky nav, and in a dedicated closing section |
| Vibrant neon on dark | Brand blue→violet→magenta gradient from the logo, plus cyan and hot-pink accents on true black |

---

## 2. Brand tokens (sampled from the supplied logo)

The logo is a faceted, wireframe-style **Y** with a blue→violet→magenta gradient, a bold white geometric wordmark (Montserrat-style) and an indigo serif tagline "STARTS HERE", all on pure black.

```css
:root {
  /* Surfaces */
  --bg:            #000000;   /* logo background */
  --surface-1:     #07050f;   /* cards */
  --surface-2:     #0d0a1c;   /* raised */
  --line:          #2a2160;   /* borders, grid lines */

  /* Brand gradient (sampled from the Y) */
  --neon-blue:     #007bf4;
  --neon-indigo:   #461bef;
  --neon-violet:   #8312dc;
  --neon-magenta:  #a701ce;

  /* Extra retro accents (added for vibrancy) */
  --neon-cyan:     #22e1ff;
  --neon-pink:     #ff3ddb;

  /* Text */
  --text:          #ffffff;
  --text-muted:    #a9a6c8;
  --tagline:       #8f7dff;   /* brighter tint of logo's #4028b4, see note */

  --grad-brand: linear-gradient(135deg, #007bf4 0%, #461bef 45%, #a701ce 100%);
  --glow-blue:  0 0 12px #007bf4aa, 0 0 32px #007bf455;
  --glow-pink:  0 0 12px #ff3ddbaa, 0 0 32px #ff3ddb55;
}
```

> **Note:** the logo's tagline color (~`#4028b4`) has only about 2.3:1 contrast on black and fails WCAG. In the UI, use `--tagline` (`#8f7dff`) for any small "STARTS HERE" text.

**Fonts** (via `next/font`): **Montserrat** 800/900 for display (matches the logo wordmark), **Space Grotesk** for body, **JetBrains Mono** for HUD labels and numerals.

**Retro-futuristic vocabulary** (use with restraint; no more than two glitch effects on screen at once):
- Perspective grid floor + striped retro sun on the horizon
- CRT scanline overlay (`repeating-linear-gradient`, about 3% opacity, `pointer-events:none`)
- Neon layered `text-shadow` on key headings; chromatic-aberration hover on the hero title
- Chamfered card corners via `clip-path`, HUD corner brackets, `[ MISSION YG-01 ]` mono labels
- Blinking cursor, marquee ticker, boot-sequence preloader
- **Signature idea:** the scroll progress bar reads **`HOUR 00 / 40`** and advances to `40` as the user scrolls, tying the UI to the 40-hour event.

---

## 3. Tech stack

| Concern | Choice |
|---|---|
| Framework | **Next.js (App Router) + TypeScript**, latest stable, static-export friendly |
| Styling | **Tailwind CSS** + CSS variables above; small `globals.css` for effects |
| 3D | **three + @react-three/fiber + @react-three/drei + @react-three/postprocessing** |
| Scroll | **Lenis** (smooth scroll) + **GSAP ScrollTrigger** (pinned/scrubbed sections) |
| UI motion | **Framer Motion** (reveals, modal, accordion) |
| Carousel | **embla-carousel-react** (headless) with custom 3D coverflow transforms |
| State | **zustand** (scroll progress, quality tier, active mission) |
| Forms | **react-hook-form + zod**; Partner enquiry posts to an API route (Formspree / Resend / Google Sheets webhook via env var) |
| Registration | Link-out to `NEXT_PUBLIC_REGISTER_URL` (Phase 1). In-app registration is Phase 3 |
| Deploy | Vercel |

Pin exact versions in `package.json` after install.

---

## 4. Site map

**Phase 1 delivers a single immersive landing page (`/`) with anchored sections.** The doc's site map (Section 15) is then added as routes in Phase 3.

```
/                       Immersive landing (all sections below)
/hackathon              Sections 5.1–5.10 (Phase 3)
/problem-statements     Full list + filters (Phase 3)
/problem-statements/[id]  Detail page per problem (Phase 3)
/workshops              Workshops + speakers (Phase 3)
/internship-mela        Section 8 (Phase 3)
/schedule               Timeline + important dates (Phase 3)
/register               Section 10 (Phase 3)
/partner                Section 11 + enquiry form (Phase 3)
/sponsors               Section 12 (Phase 3)
/faq                    Sections 13 + 14 (Phase 3)
```

### Landing page section order (`/`)
| # | Anchor | Section | Doc source |
|---|---|---|---|
| 0 | n/a | Boot preloader | n/a |
| 1 | `#top` | Hero + countdown + key numbers strip | §1 |
| 2 | `#about` | About + objectives | §2 |
| 3 | `#pillars` | Three Pillars | §4 |
| 4 | `#missions` | **Mission Select carousel** (problem statements) | §5.4 |
| 5 | `#how` | How the hackathon works (9 steps) | §5.3 |
| 6 | `#workshops` | Workshops + **Player Select carousel** (speakers) | §6, §7 |
| 7 | `#mela` | Internship Mela | §8 |
| 8 | `#schedule` | 40-hour timeline + important dates | §9, §10.3 |
| 9 | `#prizes` | Prizes + judging weights | §5.8, §5.9 |
| 10 | `#community` | **Community hub** | §5.5, §10.2, §14 |
| 11 | `#partner` | Partner With Us + enquiry form | §11 |
| 12 | `#sponsors` | Sponsor logo wall (tiered marquee) | §12 |
| 13 | `#download` | **Download CTA** + final Register CTA | §1, §11.3 |
| 14 | `#faq` | FAQ accordion (14 Qs) | §13 |
| 15 | `#contact` | Contact + footer | §14 |

Persistent UI: **sticky nav** (logo, section links, Register button, Download icon), **HOUR 00/40 progress HUD**, **floating mobile Register button** that appears after the hero.

---

## 5. Section specs

### 1. Hero (`#top`)
- Full viewport. 3D Y emblem floats center-right (mouse-parallax, slow rotation, neon edge lines) above an infinite synthwave grid, with a retro sun on the horizon.
- DOM overlay (left-aligned on desktop, centered on mobile):
  - Eyebrow (mono): `[ 40-HOUR HACKATHON • INDUSTRY WORKSHOPS • INTERNSHIP MELA ]`
  - H1: **YUGMORA: 40 Hours. Real Problems. Real Impact.** (gradient text + glow)
  - Sub-headline from doc §1
  - Event line: `[College / University Name] • [Event Dates] • [Campus Venue]`
  - **Button hierarchy:** primary **Register Now** (neon gradient), secondary **View Problem Statements**, tertiary ghost **Partner With Us** and **Download Brochure**
  - **Countdown** (segment-display look): `DD : HH : MM : SS`, driven by `EVENT_START_ISO`. If unset, show `[Days : Hours : Minutes]` placeholder state.
- **Key numbers strip** below: 40 · [X]+ problem statements · [X]+ workshops · [X]+ companies · [X]+ internships · Rs. [X] prize pool. Count-up on enter; placeholders render as `[X]+` until real numbers are set.

### 2. About (`#about`)
Left: the paragraph copy from §2 inside a "terminal window" card. Right: the 5 objectives as a HUD checklist that lights up sequentially on scroll. Closing belief statement as a large pull-quote.

### 3. Three Pillars (`#pillars`)
Three holographic cards (Hackathon · Workshops & Guest Speakers · Internship Mela) with pointer-tilt (CSS 3D). In the shared 3D scene, three matching objects float behind them (cube / prism / ring). The camera glides between them as you scroll.

### 4. Mission Select carousel (`#missions`) — the "game showcase"
- Section title: **"SELECT YOUR MISSION"** with subtitle from §5.4.
- **`<ShowcaseCarousel>`** (generic, reused for speakers): Embla, center-focused, **3D coverflow** (side cards `rotateY(±35deg) scale(.85)` with blur/dim, center card glows). Drag, arrow keys, dots, autoplay paused on hover/focus.
- **Mission card:** `[ MISSION YG-01 ]` label, company logo, title, domain chip, difficulty pips, "Linked workshop" line, **Register for this** button, **Details** button.
- **Domain filter chips** above the carousel (AI/ML, Web & Mobile, Cybersecurity, IoT & Embedded, Data Analytics, FinTech, HealthTech, EdTech, AgriTech, Sustainability, Open Innovation).
- **Details modal:** Background · The challenge · Expected deliverables · Datasets/APIs/tools · Company mentor(s) · Linked workshop (fields from §5.4).
- Ships with the 5 template rows (YG-01…YG-05) as placeholder data plus a "More missions unlock on [Date]" locked card at the end.

### 5. How it works (`#how`)
The 9 steps from §5.3 as a vertical "quest log". Steps illuminate as scrolled past; on desktop, the step list is pinned beside a rotating 3D emblem.

### 6. Workshops & Speakers (`#workshops`)
- Workshop schedule table (§6.2) rendered as terminal-style rows, with "takeaways" list (§6.3).
- **"PLAYER SELECT" carousel** using the same `ShowcaseCarousel`. Speaker card: photo (with duotone neon filter), name, designation, company logo, 2–3 line bio, LinkedIn link, session, role badge (Keynote/Workshop/Mentor/Judge).

### 7. Internship Mela (`#mela`)
- Overview (§8.1), 6-step "student flow" (§8.2) as a stepper, "What to bring" checklist (§8.4), roles/domains as a scrolling marquee (§8.5).
- Participating companies grid (§8.6): logo, roles, type (Internship/PPO), eligibility, stipend.
- CTA: **Register for the Internship Mela**.

### 8. Schedule (`#schedule`)
- **Pinned horizontal timeline** (GSAP scrub) from `HOUR 0` to `HOUR 40`, using the 14 rows in §9. The active hour is highlighted and mirrors the HUD progress bar.
- Beside it: important dates table (§10.3) as milestone nodes.
- Mobile: becomes a vertical timeline (no pinning).

### 9. Prizes & judging (`#prizes`)
- **Podium:** 3D-styled bars (Winner / First Runner-up / Second Runner-up) with `Rs. [X]`, plus rows for per-problem partner awards, special awards, and Internship fast-track.
- **Judging criteria:** 6 animated neon bars (Problem fit 20 · Innovation 20 · Technical 25 · Impact 15 · Design 10 · Presentation 10 = 100%), with judge-looks-for text on hover/tap.

### 10. Community hub (`#community`) — community features
Grounded in the doc (no invented programs):
1. **Join the community:** big **WhatsApp / Discord** join buttons (`[WhatsApp / Discord]` per §10.2), with QR code.
2. **Find your squad:** explains solo registration and the team-formation session (§5.5, §10.2). Phase 1 = info card + link. **Phase 2 = Squad Finder board** (see Section 10).
3. **Cross-branch, cross-year teams** callout ("Beginners welcome").
4. **Mentors & speakers on campus** avatar strip (from speaker data).
5. **Live counters** (teams registered, colleges, companies): manual values in Phase 1, API-driven in Phase 2.
6. **Social links:** Instagram, LinkedIn, X/Twitter, YouTube (§14), as neon icon buttons.

### 11. Partner With Us (`#partner`)
- 4 partnership cards (§11.2): Problem Statement · Workshop/Speaker · Internship Mela · Prize/Sponsorship, each with "What you do" / "What you get".
- "Why partner" list (§11.1) and "What we need from problem-statement partners" checklist (§11.3).
- **Enquiry form:** name, company, role, email, phone, partnership type (select), message. Validated with zod, submitted to `/api/partner`.
- **Download Partnership Brochure** button.

### 12. Sponsors (`#sponsors`)
Tiered logo wall (Title, Problem Statement, Workshop, Internship Mela, Community & Media). Marquee for larger tiers. Placeholder tiles use a dashed neon "Your logo here" border.

### 13. Download CTA (`#download`)
A full-width "cartridge" panel:
- Headline: **"Take Yugmora with you."**
- Primary: **Download Brochure** (PDF) with file size and a `DOWNLOAD.EXE`-style hover animation.
- Secondary: **Download Partnership Brochure**.
- Beneath: a final **Register Now** button and the countdown repeated.
- Files served from `/public/downloads/`. Track clicks via an analytics event.

### 14. FAQ (`#faq`)
Accordion with the 14 questions from §13. Emit **FAQPage JSON-LD**.

### 15. Contact & footer (`#contact`)
Contact table (§14) as a card grid, venue address with Google Maps link, socials, footer nav, "© Yugmora [Year]".

---

## 6. Component architecture

```
components/
  layout/      Nav, Footer, ScrollProgressHUD (HOUR 00/40), MobileRegisterFab,
               Preloader, CRTOverlay, SmoothScrollProvider
  three/       SceneRoot, ScrollCameraRig, YEmblem, GridFloor, RetroSun,
               Starfield, PillarObjects, Effects, useQualityTier
  ui/          NeonButton, GlowText, HudCard (chamfered), ChipFilter, Countdown,
               CountUp, Marquee, Accordion, Modal, SectionHeading, Ph (placeholder marker)
  showcase/    ShowcaseCarousel<T>, MissionCard, MissionModal, SpeakerCard
  sections/    Hero, KeyNumbers, About, Pillars, Missions, HowItWorks, Workshops,
               Mela, Schedule, Prizes, Community, Partner, Sponsors,
               DownloadCTA, Faq, Contact
  forms/       PartnerForm, (Phase 2) SquadFinderForm
```

**Rule:** sections are dumb. They read typed data from `/content` and never hard-code copy.

---

## 7. 3D architecture

### One persistent canvas
A single `<Canvas>` is mounted in `SceneRoot` (fixed, `inset-0`, `z-0`, `aria-hidden`), loaded with `next/dynamic({ ssr:false })`. Page sections sit above it (`z-10`) on transparent or semi-transparent backgrounds. Use `eventSource={document.body}` so pointer parallax works through the DOM.

### Scene graph
| Object | Details |
|---|---|
| `GridFloor` | Large plane with a custom shader (`fract()` grid lines in `--neon-violet/blue`, distance fade to black, UV scrolls toward camera) |
| `RetroSun` | Circle with a shader that cuts horizontal stripes growing toward the bottom; gradient magenta→pink |
| `Starfield` | `Points`, 1,500 desktop / 500 mobile, subtle twinkle |
| `YEmblem` | The logo Y as 3D (see below), slow float/rotate, mouse parallax |
| `PillarObjects` | Cube / prism / ring, visible only in the `#pillars` range |
| `Effects` | Bloom (mild), Noise, Scanline, ChromaticAberration (hover-reactive). **Disabled on the low tier** |

### Building the Y emblem (in order of preference)
1. **Best:** the organisers supply `logo.svg` → load via `SVGLoader` → `ExtrudeGeometry` (depth ≈ 0.35, small bevel). Apply a **vertex-color gradient** (blue at the left arm → indigo at the stem → magenta at the right arm), emissive material, and overlay `EdgesGeometry` white lines to reproduce the faceted wireframe look.
2. **If only the PNG exists:** vectorize it (e.g. potrace / Illustrator Image Trace) to `logo.svg` first.
3. **Fallback:** hand-build a faceted Y from three extruded polygons with the same gradient and edge lines.

Also export the same logo as `public/brand/logo.svg` and `logo-poster.png` for nav, favicon, OG image and the no-WebGL fallback.

### Scroll-driven camera
`useScrollStore` (zustand) receives normalized progress 0–1 from Lenis. `ScrollCameraRig` maps ranges to camera keyframes and eases with `damp`.

| Progress | Section | Camera / scene |
|---|---|---|
| 0.00–0.10 | Hero | Front-on emblem, grid, sun |
| 0.10–0.25 | About / Pillars | Pull back, emblem drifts to the right, pillar objects fade in |
| 0.25–0.55 | Missions / How / Workshops | Low, slow glide along the grid; emblem dims to a backdrop |
| 0.55–0.85 | Mela / Schedule / Prizes | Gentle orbit; accent color shifts pink |
| 0.85–1.00 | Community → Download | Camera returns to the emblem, glow intensifies for the CTA |

### Quality tiers (`useQualityTier`)
| Tier | Condition | Behavior |
|---|---|---|
| **high** | Desktop, ≥ 8 cores, no reduced-motion | DPR up to 1.75, full effects |
| **medium** | Mobile or ≤ 4 cores | DPR 1, Bloom only, fewer stars |
| **low** | `PerformanceMonitor` declines twice, or Save-Data | No postprocessing, static emblem, CSS grid |
| **off** | No WebGL, or `prefers-reduced-motion` | **No canvas.** Show `logo-poster.png` + CSS animated grid background |

Budgets: initial JS ≤ 200 KB gzipped **excluding** the lazy 3D chunk. Hero text is the LCP element, not the canvas. Dispose geometries/materials on unmount. Pause rendering (`frameloop="demand"`) when the tab is hidden or the canvas is off-screen.

---

## 8. Data model (`/content`)

All copy typed and stored in TS files. Preserve placeholders as strings.

```ts
// content/types.ts
export type Mission = {
  id: string;               // "YG-01"
  company: { name: string; logo?: string };
  title: string;
  domain: Domain;
  difficulty: 1 | 2 | 3 | 4 | 5 | null;
  background: string;
  challenge: string;
  deliverables: string[];
  resources?: string[];     // datasets, APIs, tools
  mentors: string[];
  linkedWorkshopId?: string;
  locked?: boolean;         // for "unlocks on [Date]" card
};

export type Workshop = {
  id: string; title: string; domain: Domain;
  speakerId: string; datetime: string; duration: string;
};

export type Speaker = {
  id: string; name: string; designation: string;
  company: { name: string; logo?: string };
  bio: string; photo?: string; linkedin?: string;
  session: string; roles: ("Keynote" | "Workshop" | "Mentor" | "Judge" | "Talk")[];
};

export type Company = {
  name: string; logo?: string; roles: string[];
  type: "Internship" | "PPO" | "Internship / PPO";
  eligibility: string; stipend: string;
};

export type ScheduleItem = { hourLabel: string; hourStart: number; time: string; activity: string };
export type Prize = { award: string; reward: string };
export type JudgingCriterion = { name: string; description: string; weight: string }; // "[20%]"
export type Faq = { q: string; a: string };
export type Partnership = { name: string; youDo: string; youGet: string };
```

Files: `event.ts` (name, dates, venue, team size, fee, deadlines, contacts, socials, env-driven URLs), `hero.ts`, `about.ts`, `missions.ts`, `workshops.ts`, `speakers.ts`, `mela.ts`, `schedule.ts`, `prizes.ts`, `judging.ts`, `partners.ts`, `sponsors.ts`, `faq.ts`.

### Placeholder handling
- `<Ph>` component renders any `[bracketed]` text with a subtle dashed underline **in development only**.
- Script `npm run check:placeholders` greps `/content` for `[` and prints what is still unfilled. Run it before launch.
- `.env.example`:
  ```
  NEXT_PUBLIC_EVENT_START_ISO=
  NEXT_PUBLIC_REGISTER_URL=
  NEXT_PUBLIC_COMMUNITY_URL=
  NEXT_PUBLIC_BROCHURE_URL=/downloads/yugmora-brochure.pdf
  NEXT_PUBLIC_PARTNER_BROCHURE_URL=/downloads/yugmora-partnership-brochure.pdf
  PARTNER_FORM_ENDPOINT=
  ```

---

## 9. Folder structure

```
yugmora/
├─ ARCHITECTURE.md
├─ .env.example
├─ app/
│  ├─ layout.tsx            # fonts, metadata, providers, CRTOverlay, Nav, HUD
│  ├─ page.tsx              # composes all landing sections
│  ├─ globals.css           # tokens, scanlines, neon utilities
│  ├─ api/partner/route.ts  # enquiry form handler
│  ├─ (pages)/…             # Phase 3 routes
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx
├─ components/  (see Section 6)
├─ content/     (see Section 8)
├─ lib/         (countdown.ts, analytics.ts, cn.ts, motion.ts)
├─ hooks/       (useScrollStore.ts, useQualityTier.ts, useReducedMotion.ts)
├─ public/
│  ├─ brand/    logo.svg, logo-poster.png, favicon
│  ├─ downloads/ yugmora-brochure.pdf, yugmora-partnership-brochure.pdf (placeholders)
│  └─ partners/ speakers/ (logos, photos)
└─ scripts/check-placeholders.ts
```

---

## 10. Community features (phased)

| Phase | Feature | Implementation |
|---|---|---|
| 1 | WhatsApp/Discord join, socials, "beginners welcome", team-formation info | Static + env URLs |
| 2 | **Squad Finder board:** solo registrants post skills (tags), interests (domains), year/branch, contact preference; others can browse and "Invite" | **Supabase** (Postgres + Row Level Security), simple email-link auth or no-auth with moderation flag. Rate-limit and honeypot the form |
| 2 | Live counters (teams, participants, colleges) | Supabase view or edge function, cached 60 s |
| 2 | Mission interest count ("42 teams eyeing YG-03") | Optional; requires registration data |

Privacy: collect the minimum, show first name + college + skills only, never publish phone/email.

---

## 11. Quality, accessibility, SEO

**Accessibility**
- Real headings hierarchy, landmarks, skip link, visible focus rings (neon cyan, 2 px).
- Carousel: keyboard arrows, `aria-roledescription="carousel"`, live-region for slide changes, pause on focus/hover, dots are buttons.
- Canvas is `aria-hidden`. All meaningful info exists in DOM.
- `prefers-reduced-motion`: no parallax, no autoplay, no scroll-scrub pinning, canvas off.
- Contrast ≥ 4.5:1 for body text (use `--text-muted` on `--bg`, never the raw logo indigo for text).

**SEO**
- `metadata` per page, OG image (logo on black with gradient glow), canonical URL.
- JSON-LD: `Event` (name, dates, location, organizer), `FAQPage`.
- `sitemap.xml`, `robots.txt`.

**Targets (mobile, throttled):** Lighthouse Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95, CLS < 0.05, no horizontal scroll at any width.

---

## 12. Build phases (agent checklist)

### Phase 1: Foundation
- Scaffold Next.js + TS + Tailwind; install deps; set up fonts, tokens, `globals.css`, CRT overlay.
- Create `/content` files from the docx with placeholders intact; create `.env.example`, `<Ph>`, `check:placeholders`.
- Nav, Footer, ScrollProgressHUD (`HOUR 00/40`), Lenis provider.
- **Accept when:** empty page shell renders with brand colors, fonts, sticky nav and working HUD; no console errors.

### Phase 2: Static sections (no 3D yet)
- Build all 15 sections from Section 5 with real DOM, responsive, tokens only, data from `/content`.
- Countdown, CountUp, Accordion, Marquee, Modal, PartnerForm (+ `/api/partner`).
- **Accept when:** every doc section's content is visible and correct at 375/768/1440; forms validate; all CTAs link to env URLs.

### Phase 3: Showcase carousel
- `ShowcaseCarousel<T>` with 3D coverflow; `MissionCard`, `MissionModal`, domain filters; reuse for `SpeakerCard`.
- **Accept when:** drag, arrows, keyboard, touch, filter and modal all work; focus is trapped in modal; no layout shift.

### Phase 4: 3D scene
- `SceneRoot` (dynamic, no SSR), `GridFloor`, `RetroSun`, `Starfield`, `YEmblem` (per Section 7), `Effects`.
- `useQualityTier`, fallbacks, scroll-driven `ScrollCameraRig`, `PillarObjects`.
- **Accept when:** 60 fps on a mid laptop at high tier; low/off tiers show a polished fallback; reduced-motion disables the canvas; the LCP element is the H1.

### Phase 5: Motion & polish
- Preloader boot sequence (≤ 1.5 s, skippable, shown once per session), GSAP scroll effects (schedule pin, quest log), hover micro-interactions, chromatic-aberration title.
- **Accept when:** motion feels cohesive, never blocks reading, and is fully disabled under reduced-motion.

### Phase 6: Community & routes
- Squad Finder + live counters (Supabase); Phase-3 routes from the site map; per-problem detail pages.
- **Accept when:** a solo user can post to the Squad Finder and see it appear; all routes share the same design system.

### Phase 7: Launch hardening
- SEO/JSON-LD/OG, analytics events (`register_click`, `brochure_download`, `partner_submit`, `mission_open`), Lighthouse pass, cross-browser check (Chrome, Safari, Firefox, mobile Safari/Chrome), run `check:placeholders`, deploy to Vercel.

---

## 13. Inputs still needed from the organisers

1. **Logo as SVG** (or high-res PNG with transparent background) for the 3D emblem
2. College/University name and logo, event dates, venue, city
3. Registration URL, WhatsApp/Discord link, contact names/emails/phones, social handles
4. Team size, eligibility, registration fee, deadlines
5. Confirmed companies with logos and problem statements (title, background, challenge, deliverables, mentors)
6. Guest speakers: photos, bios, session titles
7. Prize amounts and sponsor awards; judging weights (doc suggests 20/20/25/15/10/10 = 100%)
8. Brochure PDFs (participant + partnership)
9. Internship Mela companies, roles, eligibility, stipend ranges

---

## 14. Open questions found while reviewing the content

1. **What starts the 40-hour clock?** The schedule has "Hacking begins" at Hour 3, but results and closing are at Hour 40, so actual building time would be about 35 hours. Confirm whether the 40 hours counts from registration or from hacking start, and label the timeline accordingly.
2. **Logo tagline contrast.** "STARTS HERE" in `#4028b4` on black is too dim for accessibility. The plan uses a brighter tint (`#8f7dff`) in the UI. Confirm this is acceptable.
3. **Internship Mela timing.** "Same day / next day" is undecided, which affects the timeline's final node and the countdown copy.
4. **Registration model.** Link-out (Google Form / Devfolio / Unstop) or in-site? The plan assumes link-out in Phase 1.
5. **Open Innovation track.** The FAQ says teams must pick a listed problem "[Include an Open Innovation track if you have one]". Decide, since it changes the Mission Select carousel (add an "Open Innovation" card or not).
