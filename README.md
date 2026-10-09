# Prismora ✦ AI-Native Creator Marketplace

> Connecting world-class Generative AI content creators (Runway, Midjourney, FLUX, Kling, ComfyUI) with forward-thinking brands and creative agencies.

---

## 1. Project Overview & Phase 01 Foundation

Prismora is built with a high-velocity full-stack architecture tailored for rapid hackathon execution:
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS (dark mode default)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Icons:** Lucide React

---

## 2. Directory Structure

```text
AI_CCMP/
├── DEVELOPMENT_PLAN.md      # Multi-phase hackathon roadmap
├── README.md                # Project documentation & setup guide
├── .env.example             # Safe environment variable template
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # Strict TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS theme configuration
├── next.config.ts           # Next.js runtime configuration
├── supabase/
│   ├── migrations/
│   │   └── 20261009000000_prismora_schema.sql  # Database schema & RLS policies
│   └── seed.sql             # Demo creator & brand seed records
└── src/
    ├── app/
    │   ├── globals.css      # Base dark-mode typography & styles
    │   ├── layout.tsx       # Root layout & metadata
    │   └── page.tsx         # Foundation placeholder screen
    ├── lib/
    │   ├── env.ts           # Safe environment validation
    │   └── supabase/
    │       ├── client.ts    # Browser-side typed Supabase client
    │       └── server.ts    # Server-side typed Supabase client
    └── types/
        ├── database.ts      # Generated database schema types
        └── index.ts         # Composite domain entities & tool taxonomies
```

---

## 3. Getting Started

### Prerequisites
- Node.js 20+ (Current environment: Node.js 24)
- npm or pnpm
- Git

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in your Supabase credentials.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. Run type verification:
   ```bash
   npm run type-check
   ```

5. Run test suites & requirements audit:
   ```bash
   npm run test:phase2       # Creator profiles & AI portfolios (28 tests)
   npm run test:phase3       # Brand & agency briefs (35 tests)
   npm run test:phase4       # Creator discovery & search filtering (23 tests)
   npm run test:verification # Verification signals: verified, pending, unverified, missing (23 tests)
   npm run audit             # Full official problem statement requirements audit (20 checks)
   ```

---

## 4. Application Routes

| Route | Page / Feature | Key Functionality |
| :--- | :--- | :--- |
| `/` | Marketplace Overview | Platform introduction, value props, creator/brief entry cards |
| `/creators` | Creator Discovery Directory | Keyword search, multi-filtering (tools, specializations, content types, availability), empty state handling |
| `/creators/[id]` | Creator Profile & AI Portfolio | Full creator bio, hardware/pipeline info, interactive portfolio cards with prompt/sampler workflow breakdowns |
| `/briefs` | Brand Campaign Board | List of open agency & brand briefs with budget ranges, content badges, and license tags |
| `/briefs/new` | Create Campaign Brief | Validated brief creation form (goals, styles, aspect ratios, budgets, commercial license terms) |
| `/briefs/[id]` | Brief Detail View | Complete campaign specification, license shield, required tools list, edit CTA |
| `/briefs/[id]/edit` | Edit Saved Brief | In-place editing of campaign objectives, budgets, and styles with input persistence |

---

## 5. Persistence Architecture & Resilience

Prismora employs a **dual-layer persistence strategy**:
1. **Production Mode (Supabase PostgreSQL):** When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided in `.env.local`, all operations query and mutate PostgreSQL with Row Level Security.
2. **Demo / Local Fallback Mode:** If Supabase credentials are not yet configured, Prismora automatically falls back to an in-memory transactional store initialized with realistic seed data. Brief creation, updates, and creator queries continue working seamlessly without runtime exceptions or loss of state during local demo evaluation.

---

## 6. Supabase Setup & Database Migration Instructions

### Step 1: Create a Supabase Project
1. Log into your account at [supabase.com](https://supabase.com).
2. Click **New Project** and name it `prismora`.
3. Choose your nearest region and set a database password.

### Step 2: Retrieve API Credentials
1. Go to **Project Settings** > **API**.
2. Copy the **Project URL** -> paste as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
3. Copy the **anon / public** key -> paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

### Step 3: Run Database Migrations
1. In the Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy and paste the entire contents of [20261009000000_prismora_schema.sql](file:///c:/Users/parth/OneDrive/Dokumen/AI_CCMP/supabase/migrations/20261009000000_prismora_schema.sql).
4. Click **Run**.
5. Verify in **Table Editor** that the following tables exist:
   - `profiles`
   - `creator_profiles`
   - `portfolio_items`
   - `brand_briefs`
   - `creator_verifications`
   - `engagements`

### Step 4: (Optional) Run Seed Data
1. In the Supabase **SQL Editor**, open another tab.
2. Copy and paste the contents of [seed.sql](file:///c:/Users/parth/OneDrive/Dokumen/AI_CCMP/supabase/seed.sql).
3. Click **Run** to populate initial creator profiles, portfolio works, and sample briefs.

---

## 7. Domain Models & Schema Summary

| Table | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `profiles` | Shared identity | `id`, `role`, `handle`, `display_name`, `bio`, `avatar_url`, `location`, `website_url` |
| `creator_profiles` | Creator capabilities | `specializations[]`, `primary_ai_tools[]`, `custom_workflow_summary`, `hardware_specs`, `commercial_terms`, `starting_rate_cents`, `verification_status`, `is_available` |
| `portfolio_items` | AI asset showcase | `content_type`, `media_url`, `thumbnail_url`, `aspect_ratio`, `ai_tools_used[]`, `workflow_breakdown`, `generation_parameters (jsonb)`, `commercial_rights_granted` |
| `brand_briefs` | Brand campaign requests | `company_name`, `title`, `description`, `campaign_goals`, `target_content_type`, `preferred_style`, `preferred_aspect_ratio`, `commercial_use_requirements`, `budget_min_cents`, `budget_max_cents`, `status` |
| `creator_verifications`| Anti-fraud verification | `creator_id`, `evidence_type`, `evidence_url`, `verified_tools[]`, `verification_notes`, `status` |
| `engagements` | Contract & collaboration | `brief_id`, `creator_id`, `brand_id`, `agreed_price_cents`, `deliverables_summary`, `revision_limit`, `commercial_license`, `status` |
