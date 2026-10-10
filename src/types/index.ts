/**
 * Prismora Domain Types & Entity Relationships
 */

import type { Database } from "./database";

// Re-export primitive types & enums
export * from "./database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CreatorProfileRow = Database["public"]["Tables"]["creator_profiles"]["Row"];
export type PortfolioItemRow = Database["public"]["Tables"]["portfolio_items"]["Row"];
export type BrandBriefRow = Database["public"]["Tables"]["brand_briefs"]["Row"];
export type CreatorVerificationRow = Database["public"]["Tables"]["creator_verifications"]["Row"];
export type EngagementRow = Database["public"]["Tables"]["engagements"]["Row"];

/**
 * Composite Creator Entity: Combines core user identity, creator metadata,
 * portfolio works, and verification records.
 */
export interface CreatorWithDetails extends CreatorProfileRow {
  profile: ProfileRow;
  portfolio_items: PortfolioItemRow[];
  verifications?: CreatorVerificationRow[];
}

/**
 * Composite Portfolio Item Entity: Includes creator attribution and profile.
 */
export interface PortfolioItemWithCreator extends PortfolioItemRow {
  creator: CreatorProfileRow & {
    profile: ProfileRow;
  };
}

/**
 * Composite Brand Brief Entity: Includes requesting brand/agency profile details.
 */
export interface BrandBriefWithBrand extends BrandBriefRow {
  brand: ProfileRow;
  engagements_count?: number;
}

/**
 * Composite Engagement Entity: Connects brand, creator, and optional brief context.
 */
export interface EngagementWithParties extends EngagementRow {
  brand: ProfileRow;
  creator: CreatorProfileRow & {
    profile: ProfileRow;
  };
  brief?: BrandBriefRow | null;
}

/**
 * Supported AI Tools & Pipeline Taxonomies
 */
export interface AIToolMetadata {
  id: string;
  name: string;
  category: "video" | "image" | "audio" | "3d" | "upscale_vfx";
  icon?: string;
  popularModels: string[];
}

export const SUPPORTED_AI_TOOLS: AIToolMetadata[] = [
  {
    id: "runway_gen3",
    name: "Runway Gen-3 Alpha",
    category: "video",
    popularModels: ["Gen-3 Alpha Turbo", "Gen-3 Alpha"],
  },
  {
    id: "kling_ai",
    name: "Kling AI",
    category: "video",
    popularModels: ["Kling 1.5 Pro", "Kling 1.0"],
  },
  {
    id: "luma_dream_machine",
    name: "Luma Dream Machine",
    category: "video",
    popularModels: ["Dream Machine 1.5"],
  },
  {
    id: "midjourney_v6",
    name: "Midjourney",
    category: "image",
    popularModels: ["v6.1", "Niji 6"],
  },
  {
    id: "flux_1",
    name: "FLUX.1",
    category: "image",
    popularModels: ["FLUX.1 [dev]", "FLUX.1 [schnell]", "FLUX.1 [pro]"],
  },
  {
    id: "comfy_ui",
    name: "ComfyUI",
    category: "upscale_vfx",
    popularModels: ["Custom Node Workflows", "SDXL LoRA Stacks", "ControlNet"],
  },
  {
    id: "eleven_labs",
    name: "ElevenLabs",
    category: "audio",
    popularModels: ["Multilingual v2", "Voice Isolator"],
  },
];

export type AccountRole = "client" | "freelancer" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  role: AccountRole;
  full_name: string;
  display_name: string;
  handle: string;
  avatar_url?: string;
  company_name?: string;
  business_category?: string;
  bio?: string;
  website_url?: string;
  skills?: string[];
  primary_ai_tools?: string[];
  created_at: string;
}

export type PostMediaType = "video" | "image";

export interface MarketplacePost {
  id: string;
  creator_id: string;
  creator?: {
    id: string;
    display_name: string;
    handle: string;
    avatar_url?: string;
    bio?: string;
    rating?: number;
  };
  title: string;
  description: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: PostMediaType;
  price_cents: number;
  currency: string;
  category: string;
  hashtags: string[];
  ai_tools: string[];
  commercial_license?: string;
  aspect_ratio?: string;
  resolution?: string;
  workflow?: string;
  likes_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  last_message_at: string;
  created_at: string;
  other_party?: {
    id: string;
    display_name: string;
    handle: string;
    avatar_url?: string;
    role: AccountRole;
  };
  last_message?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const MARKETPLACE_CATEGORIES = [
  "All",
  "Food & Beverage",
  "Fashion & Apparel",
  "Fitness & Sports",
  "Advertising & Commercials",
  "Travel & Hospitality",
  "Product Promotion",
  "Entertainment & Gaming",
  "Tech & Future",
] as const;

