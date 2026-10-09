# Prismora — Hackathon Development Plan

> **Project Name:** Prismora  
> **Concept:** AI-Native Marketplace connecting AI Content Creators with Brands & Creative Agencies  
> **Timeline Target:** 24-Hour Hackathon Delivery  
> **Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Supabase (PostgreSQL, Auth, Storage)

---

## 1. Executive Summary & Architecture Strategy

For a 24-hour hackathon, simplicity, visual polish, and high-reliability take precedence over over-engineering. We use a **monolithic full-stack Next.js** architecture:
- **Frontend & Full-stack Framework:** Next.js (App Router) + TypeScript + Tailwind CSS.
- **Backend & Database:** Supabase PostgreSQL with `@supabase/supabase-js` and `@supabase/ssr`.
- **Media Asset Storage:** Supabase Storage (for AI video demos, prompt sample images, creator portfolios).
- **Styling & Components:** Tailwind CSS + modern dark-mode aesthetic with glassmorphic accents and rich typography.

---

## 2. Development Phases & Implementation Order

### Phase 1: Environment & Project Foundation (Current)
- [x] Workspace inspection and environment verification.
- [ ] Initialize Git repository (`git init`).
- [ ] Scaffold Next.js with TypeScript, Tailwind CSS, ESLint (`npx create-next-app`).
- [ ] Install essential runtime dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `clsx`, `tailwind-merge`.
- [ ] Setup base layout, navigation bar, typography, and dark-mode brand theme.

### Phase 2: Domain Architecture & Database Schema
- [ ] Finalize Core Data Models:
  - `profiles` (Creators & Brands: name, handle, role, bio, AI tool stack like Midjourney/Runway/ComfyUI, portfolio links).
  - `listings_or_gigs` (Brand briefs or Creator service offerings with deliverables, budget range, deadline).
  - `proposals_or_orders` (Applications, project milestones, collaboration status: pending, accepted, completed).
  - `showcases` (Creator asset portfolio: media URL, AI tools used, sample prompt/workflow).
- [ ] Supabase project setup, migration SQL script execution, and Row Level Security (RLS) policies.
- [ ] Supabase client helper setup (browser client, server client).

### Phase 3: Core UI & Marketplace Experience
- [ ] **Landing Page:** Hero section, curated AI showcase grid, value proposition for both Creators and Brands, quick CTA.
- [ ] **Creator Directory & Showcase:** Filter by AI tooling (e.g., Runway, Kling, Sora, Midjourney, Flux, ElevenLabs), style, and rating.
- [ ] **Creator Portfolio Page:** Creator profile, AI tool badges, high-impact media gallery, rate card, and "Hire Creator" action.
- [ ] **Brand Brief / Job Board:** Brands post briefs; Creators view requirements, budget, and submit proposals.

### Phase 4: Workflow & Interaction (The Hackathon "Wow" Factor)
- [ ] **Interactive Proposal / Direct Inquiry Flow:** Brand creates an inquiry/milestone contract with a Creator.
- [ ] **AI-Native Feature Demo:** "AI Matchmaker" or "Prompt/Spec Generator" (quick assistant turning brand concepts into structured creative briefs).
- [ ] **Order / Collaboration Tracker:** Status kanban/tracker from Brief -> Draft Review -> Final Delivery.

### Phase 5: Polish, Seed Data & Demo Readiness
- [ ] High-fidelity seed data (6-8 realistic AI creator profiles with stunning real AI-generated visuals and authentic briefs).
- [ ] Mobile responsiveness & micro-animations.
- [ ] Demo video / pitch walk-through recording readiness.

---

## 3. Key Decisions Required Before Database Creation

Before running database migrations, we must align on:
1. **Marketplace Model:**
   - *Option A (Recommended for Hackathons):* Hybrid — Creators showcase profiles/services + Brands post creative briefs.
   - *Option B:* Creator Portfolio first (Brand reaches out directly for custom jobs).
2. **User Roles & Auth Scope:**
   - Should a user choose a fixed role (`creator` vs `brand`) at sign-up, or can any account operate in both modes?
3. **Escrow / Payment Scope for Demo:**
   - Mock simulated escrow flow (Recommended: instant status transitions without live Stripe keys) vs real Stripe Checkout integration.
4. **Media Handling:**
   - Supabase Storage bucket uploads vs hosted CDN / URL embedding (Unsplash, Cloudinary, or Supabase public buckets).
