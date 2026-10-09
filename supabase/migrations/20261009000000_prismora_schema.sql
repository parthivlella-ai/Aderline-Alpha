-- =============================================================================
-- Prismora: PostgreSQL Schema Migration
-- AI-Native Marketplace for AI Content Creators, Brands & Creative Agencies
-- Migration: 20261009000000_prismora_schema.sql
-- =============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enum Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('creator', 'brand_agency', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('video', 'image', 'audio', '3d', 'multi_modal');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE aspect_ratio AS ENUM ('16:9', '9:16', '1:1', '4:5', '21:9');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE commercial_license_type AS ENUM (
    'full_buyout',
    'digital_only',
    'broadcast',
    'social_media_ads',
    'non_commercial'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE brief_status AS ENUM (
    'draft',
    'open',
    'in_review',
    'assigned',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE engagement_status AS ENUM (
    'proposed',
    'accepted',
    'in_progress',
    'submitted',
    'revision_requested',
    'approved',
    'completed',
    'declined'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Function: Automatic updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. User Profiles Table (extends Supabase auth.users or standalone mock)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'creator',
  full_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Creator Detailed Profiles Table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  tagline TEXT,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  primary_ai_tools TEXT[] NOT NULL DEFAULT '{}',
  custom_workflow_summary TEXT,
  hardware_specs TEXT,
  commercial_terms TEXT,
  starting_rate_cents INTEGER NOT NULL DEFAULT 0 CHECK (starting_rate_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AI Portfolio Items Table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type NOT NULL DEFAULT 'video',
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  aspect_ratio aspect_ratio NOT NULL DEFAULT '16:9',
  ai_tools_used TEXT[] NOT NULL DEFAULT '{}',
  generation_parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  workflow_breakdown TEXT,
  commercial_rights_granted commercial_license_type NOT NULL DEFAULT 'full_buyout',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Brand and Agency Campaign Briefs Table
CREATE TABLE IF NOT EXISTS public.brand_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  campaign_goals TEXT NOT NULL,
  target_content_type content_type NOT NULL DEFAULT 'video',
  preferred_style TEXT,
  preferred_aspect_ratio aspect_ratio NOT NULL DEFAULT '16:9',
  required_ai_tools TEXT[] NOT NULL DEFAULT '{}',
  commercial_use_requirements commercial_license_type NOT NULL DEFAULT 'full_buyout',
  budget_min_cents INTEGER NOT NULL CHECK (budget_min_cents >= 0),
  budget_max_cents INTEGER NOT NULL CHECK (budget_max_cents >= budget_min_cents),
  currency TEXT NOT NULL DEFAULT 'USD',
  deadline TIMESTAMPTZ,
  status brief_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Creator Verification Evidence Table
CREATE TABLE IF NOT EXISTS public.creator_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  status verification_status NOT NULL DEFAULT 'pending',
  evidence_type TEXT NOT NULL,
  evidence_url TEXT NOT NULL,
  notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Engagements & Project Milestones Table
CREATE TABLE IF NOT EXISTS public.engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES public.brand_briefs(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  status engagement_status NOT NULL DEFAULT 'proposed',
  agreed_price_cents INTEGER NOT NULL CHECK (agreed_price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  deliverables_summary TEXT NOT NULL,
  revision_limit INTEGER NOT NULL DEFAULT 2 CHECK (revision_limit >= 0),
  commercial_license commercial_license_type NOT NULL DEFAULT 'full_buyout',
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Triggers for updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_creator_profiles_updated_at ON public.creator_profiles;
CREATE TRIGGER trg_creator_profiles_updated_at
  BEFORE UPDATE ON public.creator_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_portfolio_items_updated_at ON public.portfolio_items;
CREATE TRIGGER trg_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_brand_briefs_updated_at ON public.brand_briefs;
CREATE TRIGGER trg_brand_briefs_updated_at
  BEFORE UPDATE ON public.brand_briefs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_creator_verifications_updated_at ON public.creator_verifications;
CREATE TRIGGER trg_creator_verifications_updated_at
  BEFORE UPDATE ON public.creator_verifications
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_engagements_updated_at ON public.engagements;
CREATE TRIGGER trg_engagements_updated_at
  BEFORE UPDATE ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 11. Performance & Query Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON public.profiles(handle);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_tools ON public.creator_profiles USING GIN (primary_ai_tools);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_specs ON public.creator_profiles USING GIN (specializations);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_creator ON public.portfolio_items(creator_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_content_type ON public.portfolio_items(content_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_featured ON public.portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_brand_briefs_brand ON public.brand_briefs(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_briefs_status ON public.brand_briefs(status);
CREATE INDEX IF NOT EXISTS idx_engagements_parties ON public.engagements(brand_id, creator_id);

-- 12. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view, owner can update
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Creator Profiles: Public can view, owner can update
CREATE POLICY "Creator profiles are viewable by everyone"
  ON public.creator_profiles FOR SELECT
  USING (true);

CREATE POLICY "Creators can update own creator profile"
  ON public.creator_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Portfolio Items: Public can view, creators manage their own
CREATE POLICY "Portfolio items are viewable by everyone"
  ON public.portfolio_items FOR SELECT
  USING (true);

CREATE POLICY "Creators can insert own portfolio items"
  ON public.portfolio_items FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own portfolio items"
  ON public.portfolio_items FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own portfolio items"
  ON public.portfolio_items FOR DELETE
  USING (auth.uid() = creator_id);

-- Brand Briefs: Open briefs viewable by all, brands manage their own
CREATE POLICY "Active briefs are viewable by everyone"
  ON public.brand_briefs FOR SELECT
  USING (status != 'draft' OR auth.uid() = brand_id);

CREATE POLICY "Brands can insert briefs"
  ON public.brand_briefs FOR INSERT
  WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Brands can update own briefs"
  ON public.brand_briefs FOR UPDATE
  USING (auth.uid() = brand_id);

-- Creator Verifications: Creator views their own; admins view all
CREATE POLICY "Creators can view own verifications"
  ON public.creator_verifications FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can submit verification evidence"
  ON public.creator_verifications FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Engagements: Only participating parties can view and update
CREATE POLICY "Parties can view their engagements"
  ON public.engagements FOR SELECT
  USING (auth.uid() = brand_id OR auth.uid() = creator_id);

CREATE POLICY "Brands can create engagements"
  ON public.engagements FOR INSERT
  WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Parties can update their engagements"
  ON public.engagements FOR UPDATE
  USING (auth.uid() = brand_id OR auth.uid() = creator_id);
