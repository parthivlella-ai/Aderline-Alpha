-- =============================================================================
-- Prismora: Seed Data for Testing & Hackathon Demo Preparation
-- File: supabase/seed.sql
-- =============================================================================

-- Note: When running directly in Supabase SQL editor without auth.users pre-populated,
-- we insert test UUIDs into auth.users (if accessible) or create mock profile records.

-- Test Creator 1: Aetheris Motion (Runway / Kling cinematic specialist)
DO $$
DECLARE
  creator_user_id UUID := '00000000-0000-0000-0000-000000000001';
  brand_user_id UUID := '00000000-0000-0000-0000-000000000002';
  brief_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Insert into profiles if not already present
  INSERT INTO public.profiles (id, role, full_name, display_name, handle, bio, location, website_url)
  VALUES (
    creator_user_id,
    'creator',
    'Elena Rostova',
    'Aetheris Studios',
    'aetheris',
    'Cinematic AI director specializing in photorealistic Runway Gen-3 and Kling 1.5 commercial spots.',
    'San Francisco, CA',
    'https://aetheris.ai'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.creator_profiles (
    id, tagline, specializations, primary_ai_tools, custom_workflow_summary,
    hardware_specs, commercial_terms, starting_rate_cents, currency, verification_status, is_available
  ) VALUES (
    creator_user_id,
    'Next-generation cinematic AI commercials & VFX',
    ARRAY['cinematic_video', 'product_render', 'vfx_composite'],
    ARRAY['runway_gen3', 'kling_ai', 'flux_1', 'comfy_ui'],
    'ComfyUI FLUX base character keyframes -> Kling 1.5 camera motion -> Runway Gen-3 upscale & color grading',
    'Dual NVIDIA RTX 4090 24GB',
    'Full commercial buyout included. Raw 4K master delivery with project seed metadata.',
    120000, -- $1,200
    'USD',
    'verified',
    true
  ) ON CONFLICT (id) DO NOTHING;

  -- Portfolio Item for Aetheris
  INSERT INTO public.portfolio_items (
    creator_id, title, description, content_type, media_url, aspect_ratio,
    ai_tools_used, generation_parameters, workflow_breakdown, commercial_rights_granted, is_featured
  ) VALUES (
    creator_user_id,
    'Obsidian Zenith: Luxury Timepiece Spec',
    'High-energy luxury chronometer commercial demonstrating micro-lens light refractions and liquid chronometry.',
    'video',
    'https://assets.prismora.ai/samples/zenith_watch_spec.mp4',
    '16:9',
    ARRAY['runway_gen3', 'flux_1', 'comfy_ui'],
    '{"sampler": "dpmpp_2m", "steps": 35, "cfg": 6.5, "motion_bucket": 180}'::jsonb,
    'Rendered product chassis in FLUX.1 [dev], animated rotation via Runway Gen-3 Alpha Turbo camera pan, graded in DaVinci Resolve.',
    'full_buyout',
    true
  );

  -- Brand User Profile
  INSERT INTO public.profiles (id, role, full_name, display_name, handle, bio, location, website_url)
  VALUES (
    brand_user_id,
    'brand_agency',
    'Marcus Vance',
    'Vanguard Creative Labs',
    'vanguard_creative',
    'Global creative agency sourcing premier generative AI directors for tier-1 client campaigns.',
    'New York, NY',
    'https://vanguardcreative.agency'
  ) ON CONFLICT (id) DO NOTHING;

  -- Brand Brief
  INSERT INTO public.brand_briefs (
    id, brand_id, title, company_name, description, campaign_goals,
    target_content_type, preferred_style, preferred_aspect_ratio,
    required_ai_tools, commercial_use_requirements, budget_min_cents, budget_max_cents,
    status
  ) VALUES (
    brief_id,
    brand_user_id,
    'Aura Cyber-Sedan: 30s Brand Launch Teaser',
    'Aura Automotive',
    'Seeking an AI video director to produce a 30-second futuristic electric vehicle teaser featuring twilight mountain curves and aerodynamic light trails.',
    'Drive pre-order signups across YouTube Pre-roll and Instagram Reels.',
    'video',
    'Futuristic automotive realism, anamorphic lens flare, moody twilight palette',
    '16:9',
    ARRAY['runway_gen3', 'kling_ai', 'flux_1'],
    'full_buyout',
    300000, -- $3,000
    500000, -- $5,000
    'open'
  ) ON CONFLICT (id) DO NOTHING;

END $$;
