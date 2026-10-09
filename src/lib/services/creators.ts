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
  const creator =
    SEED_CREATORS.find(
      (c) =>
        c.id.toLowerCase() === idOrHandle.toLowerCase() ||
        c.profile.handle.toLowerCase() === idOrHandle.toLowerCase()
    ) || null;

  return {
    data: creator,
    isMock: true,
  };
}
