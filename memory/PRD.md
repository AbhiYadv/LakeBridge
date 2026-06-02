# LakeBridge SaaS Landing Page — PRD

## Overview
LakeBridge is a Postgres-native lakehouse access platform. This is its SaaS marketing/landing website.

## Architecture
- **Frontend**: React (CRA) + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor)
- **Deployment**: Kubernetes (Emergent platform)
- **Frontend URL**: https://query-bridge-2.preview.emergentagent.com
- **Backend Port**: 8001 (internal), proxied via /api prefix

## Core Requirements (Static)
- Dark, developer-tool SaaS landing page (Cursor.com inspired)
- Single-page with anchor navigation
- Postgres-native value prop: one endpoint for Postgres + S3/lake data
- Target audience: CTOs, data engineers, backend engineers at Postgres-first companies

## Pages & Sections
1. **Navbar** — sticky, glass blur, LakeBridge logo, nav links, CTA
2. **Hero** — Headline + SQL code block + CTAs + stats bar
3. **Logo Bar** — "Built for teams like those at" + company names
4. **Problem Section** — 3 pain point cards
5. **Architecture Section** — flow diagram + 4-step explanation
6. **Features Section** — Bento grid (6 features)
7. **Use Cases Section** — 4 tabbed SQL demo panels
8. **Comparison Table** — LakeBridge vs 5 competitors
9. **Pricing Section** — 3 tiers (Open Source, Cloud, Enterprise)
10. **Waitlist Section** — Email capture + social proof
11. **Footer** — Links, social icons

## What's Been Implemented (2025-01)
- Full landing page with all sections above
- Backend: `/api/waitlist` POST (email capture, duplicate check) + `/api/waitlist/count`
- MongoDB storage for waitlist emails
- Dark theme with Space Grotesk + IBM Plex Sans + JetBrains Mono fonts
- SQL syntax highlighting (inline colored spans)
- Architecture flow diagram (pure HTML/Tailwind)
- Comparison table (LakeBridge vs Snowflake, Athena, Databricks, Trino, FDW)
- Responsive mobile menu

## Prioritized Backlog
### P0 (Critical for launch)
- [x] Hero section with SQL demo
- [x] Problem / solution / architecture sections
- [x] Features, use cases, comparison, pricing
- [x] Waitlist email capture

### P1 (Implemented 2025-01)
- [x] Docs page (/docs) — full quickstart guide with sidebar, code blocks, copy buttons
- [x] Scroll-triggered fade-in animations (framer-motion useInView + stagger)
- [x] SEO meta tags (og:title, og:description, og:image, twitter:card, canonical)
- [x] Dark/light theme toggle (next-themes, Sun/Moon button in Navbar)
- [x] Resend email integration (graceful fallback when RESEND_API_KEY not set)

### P1 (Remaining)
- [ ] Blog/Changelog page
- [ ] Admin dashboard to view waitlist signups
- [ ] Connect Resend API key to actually send emails

### P2 (Nice to have)
- [ ] Dark/light mode toggle
- [ ] Demo video embed
- [ ] GitHub star count badge (live API)
- [ ] Analytics integration

## Next Tasks
1. Add scroll-triggered animations (Intersection Observer / framer-motion)
2. Add SEO meta tags in public/index.html
3. Build /docs placeholder page
4. Add SendGrid/Resend integration for waitlist confirmation emails
