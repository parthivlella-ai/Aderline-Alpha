/**
 * Brand Briefs Data Access & Validation Service
 *
 * Implements persistent database operations with Supabase and transparent
 * fallback to in-memory state repository for demo/offline development.
 */

import { getClientEnv } from "../env";
import { createClient as createServerSupabase } from "../supabase/server";
import { SEED_BRIEFS } from "../data/seed-briefs";
import type {
  BrandBriefWithBrand,
  BrandBriefRow,
  ContentType,
  AspectRatio,
  CommercialLicenseType,
  BriefStatus,
} from "../../types";

export interface BriefInput {
  title: string;
  company_name: string;
  description: string;
  campaign_goals: string;
  target_content_type: ContentType;
  preferred_style?: string;
  preferred_aspect_ratio: AspectRatio;
  required_ai_tools?: string[];
  commercial_use_requirements: CommercialLicenseType;
  budget_min_cents: number;
  budget_max_cents: number;
  currency?: string;
  deadline?: string | null;
  status?: BriefStatus;
}

export interface BriefValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// In-memory working cache cloned from seed briefs for persistence during runtime
let inMemoryBriefs: BrandBriefWithBrand[] = [...SEED_BRIEFS];

/**
 * Validates brief input fields according to business constraints.
 */
export function validateBriefInput(input: Partial<BriefInput>): BriefValidationResult {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length < 3) {
    errors.title = "Campaign title is required (minimum 3 characters).";
  }

  if (!input.company_name || input.company_name.trim().length < 2) {
    errors.company_name = "Company / Agency name is required (minimum 2 characters).";
  }

  if (!input.description || input.description.trim().length < 10) {
    errors.description = "Brief description is required (minimum 10 characters).";
  }

  if (!input.campaign_goals || input.campaign_goals.trim().length < 5) {
    errors.campaign_goals = "Campaign objective & goals are required (minimum 5 characters).";
  }

  const validContentTypes: ContentType[] = ["video", "image", "audio", "3d", "multi_modal"];
  if (!input.target_content_type || !validContentTypes.includes(input.target_content_type)) {
    errors.target_content_type = "Valid content type selection is required.";
  }

  const validAspectRatios: AspectRatio[] = ["16:9", "9:16", "1:1", "4:5", "21:9"];
  if (!input.preferred_aspect_ratio || !validAspectRatios.includes(input.preferred_aspect_ratio)) {
    errors.preferred_aspect_ratio = "Valid aspect ratio selection is required.";
  }

  const validLicenses: CommercialLicenseType[] = [
    "full_buyout",
    "digital_only",
    "broadcast",
    "social_media_ads",
    "non_commercial",
  ];
  if (
    !input.commercial_use_requirements ||
    !validLicenses.includes(input.commercial_use_requirements)
  ) {
    errors.commercial_use_requirements = "Valid commercial licensing specification is required.";
  }

  if (input.budget_min_cents === undefined || input.budget_min_cents < 0) {
    errors.budget_min_cents = "Minimum budget must be a positive number.";
  }

  if (input.budget_max_cents === undefined || input.budget_max_cents < 0) {
    errors.budget_max_cents = "Maximum budget must be a positive number.";
  } else if (
    input.budget_min_cents !== undefined &&
    input.budget_max_cents < input.budget_min_cents
  ) {
    errors.budget_max_cents = "Maximum budget cannot be less than minimum budget.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Fetches all campaign briefs.
 */
export async function getBriefs(): Promise<{
  data: BrandBriefWithBrand[];
  isMock: boolean;
}> {
  const env = getClientEnv();

  if (env.isConfigured) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("brand_briefs")
        .select(`
          *,
          brand:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[Prismora] Supabase briefs query failed, using in-memory store:", error.message);
      } else if (data && data.length > 0) {
        return {
          data: data as unknown as BrandBriefWithBrand[],
          isMock: false,
        };
      }
    } catch (err) {
      console.warn("[Prismora] Supabase query exception:", err);
    }
  }

  return {
    data: inMemoryBriefs,
    isMock: true,
  };
}

/**
 * Fetches a single campaign brief by ID.
 */
export async function getBriefById(
  id: string
): Promise<{ data: BrandBriefWithBrand | null; isMock: boolean }> {
  const env = getClientEnv();

  if (env.isConfigured) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("brand_briefs")
        .select(`
          *,
          brand:profiles(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.warn("[Prismora] Supabase brief lookup error:", error.message);
      } else if (data) {
        return {
          data: data as unknown as BrandBriefWithBrand,
          isMock: false,
        };
      }
    } catch (err) {
      console.warn("[Prismora] Supabase brief lookup exception:", err);
    }
  }

  const found = inMemoryBriefs.find((b) => b.id.toLowerCase() === id.toLowerCase()) || null;
  return {
    data: found,
    isMock: true,
  };
}

/**
 * Creates a new campaign brief.
 */
export async function createBrief(
  input: BriefInput,
  brandId: string = "00000000-0000-0000-0000-000000000002"
): Promise<{ success: boolean; brief?: BrandBriefWithBrand; errors?: Record<string, string> }> {
  const validation = validateBriefInput(input);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const env = getClientEnv();

  if (env.isConfigured) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await (supabase.from("brand_briefs") as any)
        .insert({
          brand_id: brandId,
          title: input.title.trim(),
          company_name: input.company_name.trim(),
          description: input.description.trim(),
          campaign_goals: input.campaign_goals.trim(),
          target_content_type: input.target_content_type,
          preferred_style: input.preferred_style?.trim() || null,
          preferred_aspect_ratio: input.preferred_aspect_ratio,
          required_ai_tools: input.required_ai_tools || [],
          commercial_use_requirements: input.commercial_use_requirements,
          budget_min_cents: input.budget_min_cents,
          budget_max_cents: input.budget_max_cents,
          currency: input.currency || "USD",
          deadline: input.deadline || null,
          status: input.status || "open",
        })
        .select(`*, brand:profiles(*)`)
        .single();

      if (error) {
        console.warn("[Prismora] Supabase brief insert failed:", error.message);
      } else if (data) {
        return { success: true, brief: data as unknown as BrandBriefWithBrand };
      }
    } catch (err) {
      console.warn("[Prismora] Supabase insert exception:", err);
    }
  }

  // Create new brief in local persistent memory
  const newId = `b${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const newBrief: BrandBriefWithBrand = {
    id: newId,
    brand_id: brandId,
    title: input.title.trim(),
    company_name: input.company_name.trim(),
    description: input.description.trim(),
    campaign_goals: input.campaign_goals.trim(),
    target_content_type: input.target_content_type,
    preferred_style: input.preferred_style?.trim() || null,
    preferred_aspect_ratio: input.preferred_aspect_ratio,
    required_ai_tools: input.required_ai_tools || [],
    commercial_use_requirements: input.commercial_use_requirements,
    budget_min_cents: input.budget_min_cents,
    budget_max_cents: input.budget_max_cents,
    currency: input.currency || "USD",
    deadline: input.deadline || null,
    status: input.status || "open",
    created_at: now,
    updated_at: now,
    brand: {
      id: brandId,
      role: "brand_agency",
      full_name: "Marcus Vance",
      display_name: input.company_name.trim(),
      handle: input.company_name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_"),
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Brand and campaign commissioner on Prismora.",
      location: "San Francisco, CA",
      website_url: null,
      created_at: now,
      updated_at: now,
    },
    engagements_count: 0,
  };

  inMemoryBriefs = [newBrief, ...inMemoryBriefs];
  return { success: true, brief: newBrief };
}

/**
 * Updates an existing campaign brief.
 */
export async function updateBrief(
  id: string,
  input: Partial<BriefInput>
): Promise<{ success: boolean; brief?: BrandBriefWithBrand; errors?: Record<string, string> }> {
  const existing = await getBriefById(id);
  if (!existing.data) {
    return { success: false, errors: { form: "Brief not found." } };
  }

  const mergedInput: BriefInput = {
    title: input.title ?? existing.data.title,
    company_name: input.company_name ?? existing.data.company_name,
    description: input.description ?? existing.data.description,
    campaign_goals: input.campaign_goals ?? existing.data.campaign_goals,
    target_content_type: input.target_content_type ?? existing.data.target_content_type,
    preferred_style: input.preferred_style ?? (existing.data.preferred_style || undefined),
    preferred_aspect_ratio: input.preferred_aspect_ratio ?? existing.data.preferred_aspect_ratio,
    required_ai_tools: input.required_ai_tools ?? existing.data.required_ai_tools,
    commercial_use_requirements:
      input.commercial_use_requirements ?? existing.data.commercial_use_requirements,
    budget_min_cents: input.budget_min_cents ?? existing.data.budget_min_cents,
    budget_max_cents: input.budget_max_cents ?? existing.data.budget_max_cents,
    currency: input.currency ?? existing.data.currency,
    deadline: input.deadline ?? existing.data.deadline,
    status: input.status ?? existing.data.status,
  };

  const validation = validateBriefInput(mergedInput);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const env = getClientEnv();

  if (env.isConfigured) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await (supabase.from("brand_briefs") as any)
        .update({
          title: mergedInput.title.trim(),
          company_name: mergedInput.company_name.trim(),
          description: mergedInput.description.trim(),
          campaign_goals: mergedInput.campaign_goals.trim(),
          target_content_type: mergedInput.target_content_type,
          preferred_style: mergedInput.preferred_style?.trim() || null,
          preferred_aspect_ratio: mergedInput.preferred_aspect_ratio,
          required_ai_tools: mergedInput.required_ai_tools,
          commercial_use_requirements: mergedInput.commercial_use_requirements,
          budget_min_cents: mergedInput.budget_min_cents,
          budget_max_cents: mergedInput.budget_max_cents,
          currency: mergedInput.currency || "USD",
          deadline: mergedInput.deadline || null,
          status: mergedInput.status || "open",
        })
        .eq("id", id)
        .select(`*, brand:profiles(*)`)
        .single();

      if (error) {
        console.warn("[Prismora] Supabase brief update failed:", error.message);
      } else if (data) {
        return { success: true, brief: data as unknown as BrandBriefWithBrand };
      }
    } catch (err) {
      console.warn("[Prismora] Supabase update exception:", err);
    }
  }

  // Update in local memory
  const updatedBrief: BrandBriefWithBrand = {
    ...existing.data,
    ...mergedInput,
    updated_at: new Date().toISOString(),
  };

  inMemoryBriefs = inMemoryBriefs.map((b) => (b.id === id ? updatedBrief : b));
  return { success: true, brief: updatedBrief };
}
