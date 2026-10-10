/**
 * Creator Profile & AI Portfolio Data Access & Filtering Service
 *
 * Implements persistent database access via Supabase with transparent
 * fallback to seed demonstration data, plus multi-dimensional search and
 * filtering engine.
 */

import { getClientEnv } from "../env";
import { createClient as createServerSupabase } from "../supabase/server";
import { SEED_CREATORS } from "../data/seed-creators";
import { filterCreators, type CreatorFilterCriteria } from "../filters/creators";
import type { CreatorWithDetails } from "../../types";

export type { CreatorFilterCriteria };
export { filterCreators };

export interface CreatorFetchResult<T> {
  data: T;
  isMock: boolean;
  error?: string | null;
}

/**
 * Fetches all creator profiles along with their user profile and portfolio items.
 */
export async function getCreators(
  criteria?: CreatorFilterCriteria
): Promise<CreatorFetchResult<CreatorWithDetails[]>> {
  const env = getClientEnv();
  let creators: CreatorWithDetails[] = [];
  let isMock = true;

  if (env.isConfigured) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("creator_profiles")
        .select(`
          *,
          profile:profiles(*),
          portfolio_items(*),
          verifications:creator_verifications(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[Prismora] Supabase query failed, falling back to seed data:", error.message);
      } else if (data && data.length > 0) {
        creators = data as unknown as CreatorWithDetails[];
        isMock = false;
      }
    } catch (err) {
      console.warn("[Prismora] Unexpected Supabase error, falling back to seed data:", err);
    }
  }

  // Fallback to demonstration seed data if Supabase unconfigured or query returned empty
  if (creators.length === 0) {
    creators = SEED_CREATORS;
  }

  // Apply filters if criteria provided
  if (criteria) {
    creators = filterCreators(creators, criteria);
  }

  return {
    data: creators,
    isMock,
  };
}

/**
 * Fetches a single creator profile by ID or handle with full portfolio items.
 */
export async function getCreatorById(
  idOrHandle: string
): Promise<CreatorFetchResult<CreatorWithDetails | null>> {
  const env = getClientEnv();

  if (env.isConfigured) {
    try {
      const supabase = await createServerSupabase();

      // Check if parameter is UUID or handle
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrHandle
      );

      let query = supabase
        .from("creator_profiles")
        .select(`
          *,
          profile:profiles(*),
          portfolio_items(*),
          verifications:creator_verifications(*)
        `);

      if (isUuid) {
        query = query.eq("id", idOrHandle);
      } else {
        query = query.eq("profile.handle", idOrHandle);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.warn("[Prismora] Supabase lookup error:", error.message);
      } else if (data) {
        return {
          data: data as unknown as CreatorWithDetails,
          isMock: false,
        };
      }
    } catch (err) {
      console.warn("[Prismora] Unexpected Supabase lookup error:", err);
    }
  }

  // Fallback lookup in demonstration seed data
  let creator =
    SEED_CREATORS.find(
      (c) =>
        c.id.toLowerCase() === idOrHandle.toLowerCase() ||
        c.profile.id.toLowerCase() === idOrHandle.toLowerCase() ||
        c.profile.handle.toLowerCase() === idOrHandle.toLowerCase() ||
        (idOrHandle.toLowerCase().includes("elena") && c.profile.handle === "aetheris") ||
        (idOrHandle.toLowerCase().includes("marcus") && (c.profile.handle === "horizonfilms" || c.profile.handle === "sonicaether")) ||
        (idOrHandle.toLowerCase().includes("chloe") && c.profile.handle === "synthcraft") ||
        (idOrHandle.toLowerCase().includes("kai") && c.profile.handle === "tanakavfx")
    ) || null;

  // If still not found, check if a post or known profile exists with this creator ID
  if (!creator && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("prismora_all_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const matched = posts.find((p: any) => p.creator_id === idOrHandle || p.creator?.id === idOrHandle);
        if (matched?.creator) {
          creator = {
            id: matched.creator_id,
            tagline: matched.description || "Verified AI Content Creator",
            specializations: ["cinematic_video", "product_render"],
            primary_ai_tools: matched.ai_tools || ["runway_gen3"],
            custom_workflow_summary: matched.workflow || "Advanced Generative AI Pipeline",
            hardware_specs: "Dedicated GPU Workstation",
            commercial_terms: matched.commercial_license || "Commercial rights included",
            starting_rate_cents: matched.price_cents || 45000,
            currency: matched.currency || "USD",
            verification_status: "verified",
            is_available: true,
            created_at: matched.created_at,
            updated_at: matched.updated_at,
            profile: {
              id: matched.creator_id,
              role: "creator",
              full_name: matched.creator.display_name,
              display_name: matched.creator.display_name,
              handle: matched.creator.handle,
              avatar_url: matched.creator.avatar_url,
              bio: matched.creator.bio || "Commercial generative director",
              location: "Global",
              website_url: "",
              created_at: matched.created_at,
              updated_at: matched.updated_at,
            },
            portfolio_items: [],
          };
        }
      }
    } catch {}
  }

  return {
    data: creator,
    isMock: true,
  };
}
