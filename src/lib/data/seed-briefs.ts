/**
 * Demonstration Seed Brand Briefs
 *
 * NOTE: All briefs, company identities, and budgets in this file are provided
 * strictly for demonstration and testing purposes.
 */

import type { BrandBriefWithBrand } from "@/types";

export const SEED_BRIEFS: BrandBriefWithBrand[] = [
  {
    id: "b0000000-0000-0000-0000-000000000001",
    brand_id: "00000000-0000-0000-0000-000000000002",
    title: "Aura Cyber-Sedan: 30s Brand Launch Teaser Commercial",
    company_name: "Aura Automotive Labs",
    description:
      "We require an innovative 30-second cinematic teaser commercial unveiling our luxury electric vehicle. The visual should portray dynamic aerodynamic light trails moving along coastal curves at twilight with an anamorphic cinema aesthetic.",
    campaign_goals:
      "Drive global viral awareness on YouTube pre-roll, X, and Instagram ahead of the 2027 Tokyo Mobility Show.",
    target_content_type: "video",
    preferred_style: "Futuristic automotive photorealism, anamorphic flare, moody twilight palette",
    preferred_aspect_ratio: "16:9",
    required_ai_tools: ["runway_gen3", "kling_ai", "flux_1"],
    commercial_use_requirements: "full_buyout",
    budget_min_cents: 300000, // $3,000
    budget_max_cents: 500000, // $5,000
    currency: "USD",
    deadline: "2026-11-15T00:00:00Z",
    status: "open",
    created_at: "2026-10-04T10:00:00Z",
    updated_at: "2026-10-04T10:00:00Z",
    brand: {
      id: "00000000-0000-0000-0000-000000000002",
      role: "brand_agency",
      full_name: "Marcus Vance",
      display_name: "Vanguard Creative Labs",
      handle: "vanguard_creative",
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Global creative agency sourcing premier generative AI directors for tier-1 client campaigns.",
      location: "New York, NY",
      website_url: "https://vanguardcreative.agency",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-08T12:00:00Z",
    },
    engagements_count: 2,
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    brand_id: "00000000-0000-0000-0000-000000000002",
    title: "Aethelgard RPG: Mythic Character Keyframes & Vignettes",
    company_name: "Mythic Forge Games",
    description:
      "Seeking a concept art specialist to create 6 character reveal keyframes for an upcoming dark fantasy RPG title. Each hero requires consistent armor embroidery and environmental lighting.",
    campaign_goals:
      "Create high-impact promotional art assets for Kickstarter campaign and Steam store capsules.",
    target_content_type: "image",
    preferred_style: "Grimdark fantasy, painterly oil brushwork, dramatic chiaroscuro lighting",
    preferred_aspect_ratio: "16:9",
    required_ai_tools: ["midjourney_v6", "flux_1", "comfy_ui"],
    commercial_use_requirements: "full_buyout",
    budget_min_cents: 150000, // $1,500
    budget_max_cents: 250000, // $2,500
    currency: "USD",
    deadline: "2026-10-30T00:00:00Z",
    status: "open",
    created_at: "2026-10-05T14:30:00Z",
    updated_at: "2026-10-05T14:30:00Z",
    brand: {
      id: "00000000-0000-0000-0000-000000000002",
      role: "brand_agency",
      full_name: "Marcus Vance",
      display_name: "Vanguard Creative Labs",
      handle: "vanguard_creative",
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Global creative agency sourcing premier generative AI directors for tier-1 client campaigns.",
      location: "New York, NY",
      website_url: "https://vanguardcreative.agency",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-08T12:00:00Z",
    },
    engagements_count: 0,
  },
  {
    id: "b0000000-0000-0000-0000-000000000003",
    brand_id: "00000000-0000-0000-0000-000000000002",
    title: "Velocita Activewear: 9:16 High-Energy Social Media Ad Series",
    company_name: "Velocita Apparel",
    description:
      "Produce three 15-second vertical video ads featuring runners navigating neon-lit architectural bridges. High framerate with responsive sound design and synthetic voiceover.",
    campaign_goals:
      "Drive Direct-to-Consumer e-commerce conversion across TikTok, Instagram Reels, and YouTube Shorts.",
    target_content_type: "video",
    preferred_style: "High-octane urban street style, fast motion cuts, hyper-saturated stadium floodlights",
    preferred_aspect_ratio: "9:16",
    required_ai_tools: ["runway_gen3", "comfy_ui", "eleven_labs"],
    commercial_use_requirements: "social_media_ads",
    budget_min_cents: 80000, // $800
    budget_max_cents: 150000, // $1,500
    currency: "USD",
    deadline: "2026-11-01T00:00:00Z",
    status: "in_review",
    created_at: "2026-10-06T09:00:00Z",
    updated_at: "2026-10-06T09:00:00Z",
    brand: {
      id: "00000000-0000-0000-0000-000000000002",
      role: "brand_agency",
      full_name: "Marcus Vance",
      display_name: "Vanguard Creative Labs",
      handle: "vanguard_creative",
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Global creative agency sourcing premier generative AI directors for tier-1 client campaigns.",
      location: "New York, NY",
      website_url: "https://vanguardcreative.agency",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-08T12:00:00Z",
    },
    engagements_count: 1,
  },
];
