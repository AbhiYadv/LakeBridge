# LakeBridge SaaS Landing Page — PRD

## Overview
LakeBridge is a Postgres-native lakehouse access platform. This is its SaaS marketing/demo website.

**Current phase**: Static marketing website. No backend, database, or email service required.
**Deployment target**: Vercel (static)

## Architecture
- **Frontend**: React 19, Tailwind CSS, Framer Motion, next-themes
- **Backend**: FastAPI + MongoDB (kept in repo, optional — not required for the static site)
- **Deployment**: Vercel (frontend-only, `frontend/` root directory)
- **Frontend URL**: https://query-bridge-2.preview.emergentagent.com

## Core Requirements (Static)
- Dark, developer-tool SaaS landing page (Cursor.com inspired)
- Single-page with anchor navigation
- Postgres-native value prop: one endpoint for Postgres + S3/lake data
- Target audience: CTOs, data engineers, backend engineers at Postgres-first companies

## Pages & Sections
1. **Navbar** — sticky, glass blur, LakeBridge logo, nav links, theme toggle, CTA
2. **Hero** — Headline + SQL code block + CTAs + stats bar
3. **Logo Bar** — "Built for teams like those at" + company names
4. **Problem Section** — 3 pain point cards
5. **Architecture Section** — flow diagram + 4-step explanation
6. **Features Section** — Bento grid (6 features)
7. **Use Cases Section** — 4 tabbed SQL demo panels
8. **Comparison Table** — LakeBridge vs 5 competitors
9. **Pricing Section** — 3 tiers (Open Source, Cloud, Enterprise)
10. **Waitlist Section** — Frontend-only email capture (success message, no API)
11. **Footer** — Links, social icons
12. **Docs Page** (`/docs`) — Architecture, quickstart, configure storage, extension reference, FAQ
13. **Blog Page** (`/blog`) — 4 posts, filter by type, single-post view

## What's Been Implemented

### Phase 1 — MVP (Jan 2025)
- Full landing page with all sections above
- Backend: `/api/waitlist` POST + `/api/waitlist/count` (optional, not required)
- MongoDB storage for waitlist emails (optional)
- Dark theme with Space Grotesk + IBM Plex Sans + JetBrains Mono fonts
- SQL syntax highlighting, architecture flow diagram
- Comparison table, responsive mobile menu

### Phase 2 — Enhancements (Feb 2025)
- Scroll-triggered fade-in animations (Framer Motion — `AnimatedSection.js`)
- Dark / Light theme toggle (next-themes, persistent)
- SEO meta tags + Open Graph + Twitter Card (`public/index.html`)
- `/docs` page — 5-layer architecture, 9-step query lifecycle, quickstart, extension reference, FAQ
- `/blog` page — 4 posts, filter by type, single-post view
- `vercel.json` — SPA rewrite rule for `/docs`, `/blog`, and all deep links
- **Waitlist form made frontend-only** — shows success message with setTimeout, no API dependency

## Vercel Deployment
- Root directory: `frontend`
- Build command: `yarn build`
- Output: `build/`
- No environment variables required
- `vercel.json` in `frontend/` handles SPA routing

## Prioritized Backlog

### P1 (Next)
- [ ] Admin dashboard to view waitlist signups (requires backend re-enable)
- [ ] Connect Resend API key for actual confirmation emails (optional)

### P2 (Nice to have)
- [ ] GitHub star count badge (live API)
- [ ] Demo video embed
- [ ] Analytics integration (PostHog already partially wired)
- [ ] Typed-text animation on hero SQL block

## Key Files
| File | Purpose |
|------|---------|
| `frontend/src/components/WaitlistSection.js` | Frontend-only waitlist form |
| `frontend/src/components/AnimatedSection.js` | Framer Motion scroll wrappers |
| `frontend/src/components/Navbar.js` | Sticky nav + dark/light toggle |
| `frontend/src/pages/DocsPage.js` | Full docs with sidebar |
| `frontend/src/pages/BlogPage.js` | Blog with filters |
| `frontend/src/App.js` | ThemeProvider + routing |
| `frontend/public/index.html` | SEO / OG / Twitter meta tags |
| `frontend/vercel.json` | SPA rewrite rule |
| `README.md` | Vercel deployment instructions |
