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

### Phase 1: Environment & Project Foundation (COMPLETED & VERIFIED)
- [x] Workspace inspection and environment verification.
- [x] Initialize Git repository (`git init`).
- [x] Scaffold Next.js 15 with TypeScript, Tailwind CSS, ESLint.
- [x] Install essential runtime dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `clsx`, `tailwind-merge`.
- [x] Setup base layout, navigation bar, typography, and dark-mode brand theme.

### Phase 2: Creator Profiles & AI Portfolios (COMPLETED & VERIFIED)
- [x] Creator profile types and domain entities (`types/index.ts`, `types/database.ts`).
- [x] Creator profile detail view (`/creators/[id]`) with bios, rates, locations, and verification status.
- [x] Interactive AI portfolio showcases (`PortfolioCard.tsx`) with workflow breakdown accordions and generation parameters.
- [x] Verified test suite: 28/28 tests passing (`npm run test:phase2`).

### Phase 3: Brand & Agency Briefs (COMPLETED & VERIFIED)
- [x] Full campaign brief lifecycle (creation, view, edit) with validation constraints.
- [x] Support for objectives, content type, style, aspect ratio (16:9, 9:16, etc.), commercial-use licenses, and budget ranges.
- [x] Dual-layer persistence (Supabase PostgreSQL with automatic in-memory fallback).
- [x] Verified test suite: 35/35 tests passing (`npm run test:phase3`).

### Phase 4: Creator Search & Filtering (COMPLETED & VERIFIED)
- [x] Client-safe keyword search matching creator names, taglines, bios, locations, and portfolio content.
- [x] Multi-criteria filtering by creative specialization, AI tools/models, portfolio content types, and availability.
- [x] Combined conjunction filtering (AND logic) and empty results handling with one-click reset.
- [x] Verified test suite: 23/23 tests passing (`npm run test:phase4`).

### Phase 5: Creator Verification Signals (COMPLETED & VERIFIED)
- [x] Full Official Problem Statement Requirements Audit (`npm run audit` — 20/20 PASS).
- [x] Verification badge indicators for tools, workflows, and past-work evidence (`CreatorVerificationSignals.tsx`, `VerificationBadge.tsx`).
- [x] Clear visual distinction between self-declared claims and reviewer-audited claims.
- [x] Strict anti-hallucination policy: no fabricated reviews or implied third-party validation.
- [x] Verified test suite covering verified, pending, unverified, and missing evidence (`npm run test:verification` — 23/23 PASS).

### Phase 6: Figma Design Translation (COMPLETED & VERIFIED)
- [x] Extracted nocturnal plum & lilac design tokens from Figma template (`#0b0914`, `#140f26`, `#271f43`, `#9d7bf5`, coral `#f7845f`, gold `#fdb750`).
- [x] **Screen 01 · Cinematic Login / Intro:** Implemented hero statement ("Make the impossible. marketable."), glowing orbital artwork, and floating featured creative glass card.
- [x] **Screen 02 · Discover Creators Dashboard:** Implemented left workspace sidebar, capsule search bar, specialization pill bar, summary status row, and redesigned 3-column creator cards with artistic banners and direct portfolio links.
- [x] **Screen 03 · AI-Assisted Brief Builder:** Implemented 2-column layout with left brief progress stepper & rights guidance, and right idea builder with prompt textarea, content type pills, visual direction pills, and aspect ratios.
- [x] Preserved 100% of existing database models, validation constraints, and search/filtering engines.

### Phase 7: AI-Assisted Brief Builder (COMPLETED & VERIFIED)
- [x] Server-side AI generator integration (`src/lib/ai/brief-generator.ts`, `src/app/api/briefs/generate/route.ts`).
- [x] Secret safety: Server-side environment keys only (`GEMINI_API_KEY` / `GOOGLE_API_KEY`), never exposed to client bundles or Git.
- [x] Strict schema validation rejecting malformed enums, negative budgets, inverted budget bounds, or missing fields.
- [x] **Conservative licensing safeguard:** Never silently escalates or invents full IP buyout permissions; defaults safely to social media ads or digital organic with explicit transparency reasoning.
- [x] Interactive UI draft population with review banner, maintaining 100% editable fields before approval and submission.
- [x] Resilient error handling and manual fallback: users can draft and publish briefs manually without interruption even when AI services time out or fail.
- [x] Verified test suite (`npm run test:ai-brief` — 30/30 PASS covering successful generation, invalid schema rejection, API error simulation, and manual fallback).

### Phase 8: Explainable Creator Matching (COMPLETED & VERIFIED)
- [x] Pure deterministic scoring formula (0–100 pts) evaluating content type (25), AI tools overlap (25), specialization (25), format compatibility (15), and budget/availability (10) (`src/lib/matching/creator-matcher.ts`).
- [x] Scoring is 100% independent of generative LLM text in the calculation loop.
- [x] Strict commercial licensing constraints: creators with conflicting terms are disqualified from eligible rankings; unstated rights require explicit confirmation.
- [x] Transparent explainability UI: collapsible granular score breakdown, matched criteria checklists, and missing capabilities warnings (`src/components/ExplainableCreatorMatches.tsx`).
- [x] Integrated into campaign brief detail view (`/briefs/[id]`) with direct profile navigation links.
- [x] Documented formula, weights, and limitations (`docs/MATCHING_ALGORITHM.md`).
- [x] Verified test suite (`npm run test:matching` — 28/28 PASS covering strong match, weak match, licensing conflicts, unconfirmed rights, and no-match cases).

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
