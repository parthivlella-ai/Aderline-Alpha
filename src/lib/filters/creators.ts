/**
 * Pure Client-Safe Filtering Engine for Creator Discovery
 * Contains no server-side or headers dependencies, safe for Client Components.
 */

import type { CreatorWithDetails } from "@/types";

export interface CreatorFilterCriteria {
  query?: string;
  specialization?: string;
  aiTool?: string;
  contentType?: string;
  skills?: string[];
  availabilityOnly?: boolean;
}

/**
 * Pure filter engine for creator discovery.
 * Filters across keywords, specializations, AI tools, and portfolio content types.
 * Safely handles missing fields and unexpected or malformed data.
 */
export function filterCreators(
  creators: CreatorWithDetails[],
  criteria: CreatorFilterCriteria
): CreatorWithDetails[] {
  if (!creators || !Array.isArray(creators)) return [];

  const normalizedQuery = criteria.query?.trim().toLowerCase() || "";
  const selectedSpec = criteria.specialization?.trim().toLowerCase() || "";
  const selectedTool = criteria.aiTool?.trim().toLowerCase() || "";
  const selectedContentType = criteria.contentType?.trim().toLowerCase() || "";
  const selectedSkills = criteria.skills?.map((s) => s.toLowerCase().trim()) || [];

  return creators.filter((creator) => {
    if (!creator) return false;

    const profile = creator.profile || ({} as any);
    const portfolioItems = Array.isArray(creator.portfolio_items)
      ? creator.portfolio_items
      : [];
    const specs = Array.isArray(creator.specializations)
      ? creator.specializations
      : [];
    const tools = Array.isArray(creator.primary_ai_tools)
      ? creator.primary_ai_tools
      : [];

    // 1. Keyword search (name, display name, handle, bio, tagline, workflow, location)
    if (normalizedQuery) {
      const nameMatch = (profile.full_name || "").toLowerCase().includes(normalizedQuery);
      const displayMatch = (profile.display_name || "").toLowerCase().includes(normalizedQuery);
      const handleMatch = (profile.handle || "").toLowerCase().includes(normalizedQuery);
      const bioMatch = (profile.bio || "").toLowerCase().includes(normalizedQuery);
      const taglineMatch = (creator.tagline || "").toLowerCase().includes(normalizedQuery);
      const workflowMatch = (creator.custom_workflow_summary || "").toLowerCase().includes(normalizedQuery);
      const locationMatch = (profile.location || "").toLowerCase().includes(normalizedQuery);
      const specMatch = specs.some(
        (s) =>
          s.toLowerCase().includes(normalizedQuery) ||
          s.toLowerCase().replace(/_/g, " ").includes(normalizedQuery)
      );
      const toolMatch = tools.some(
        (t) =>
          t.toLowerCase().includes(normalizedQuery) ||
          t.toLowerCase().replace(/_/g, " ").includes(normalizedQuery)
      );
      const portfolioMatch = portfolioItems.some(
        (item) =>
          (item.title || "").toLowerCase().includes(normalizedQuery) ||
          (item.description || "").toLowerCase().includes(normalizedQuery) ||
          (item.workflow_breakdown || "").toLowerCase().includes(normalizedQuery)
      );

      if (
        !nameMatch &&
        !displayMatch &&
        !handleMatch &&
        !bioMatch &&
        !taglineMatch &&
        !workflowMatch &&
        !locationMatch &&
        !specMatch &&
        !toolMatch &&
        !portfolioMatch
      ) {
        return false;
      }
    }

    // 2. Specialization filter
    if (selectedSpec && selectedSpec !== "all") {
      const hasSpec = specs.some(
        (s) =>
          s.toLowerCase() === selectedSpec ||
          s.toLowerCase().replace(/_/g, " ") === selectedSpec.replace(/_/g, " ")
      );
      if (!hasSpec) return false;
    }

    // 3. AI Tool / Model filter
    if (selectedTool && selectedTool !== "all") {
      const hasPrimaryTool = tools.some(
        (t) =>
          t.toLowerCase() === selectedTool ||
          t.toLowerCase().replace(/_/g, " ") === selectedTool.replace(/_/g, " ")
      );
      const hasPortfolioTool = portfolioItems.some((item) =>
        Array.isArray(item.ai_tools_used) &&
        item.ai_tools_used.some(
          (t) =>
            t.toLowerCase() === selectedTool ||
            t.toLowerCase().replace(/_/g, " ") === selectedTool.replace(/_/g, " ")
        )
      );
      if (!hasPrimaryTool && !hasPortfolioTool) return false;
    }

    // 4. Content Type filter (portfolio assets)
    if (selectedContentType && selectedContentType !== "all") {
      const hasContentType = portfolioItems.some(
        (item) => (item.content_type || "").toLowerCase() === selectedContentType
      );
      if (!hasContentType) return false;
    }

    // 5. Skills filter
    if (selectedSkills.length > 0) {
      const matchesSkill = selectedSkills.some((skill) =>
        specs.some((s) => s.toLowerCase().includes(skill)) ||
        tools.some((t) => t.toLowerCase().includes(skill))
      );
      if (!matchesSkill) return false;
    }

    // 6. Availability filter
    if (criteria.availabilityOnly && !creator.is_available) {
      return false;
    }

    return true;
  });
}
