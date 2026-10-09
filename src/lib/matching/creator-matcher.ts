/**
 * Explainable Creator Matching Engine for Prismora
 *
 * Implements deterministic scoring based on:
 * 1. Content Type Compatibility (Max 25 pts)
 * 2. AI Toolchain Overlap (Max 25 pts)
 * 3. Specialization & Creative Domain Match (Max 25 pts)
 * 4. Format & Aspect Ratio Evidence (Max 15 pts)
 * 5. Budget Feasibility & Availability (Max 10 pts)
 *
 * CRITICAL BUSINESS RULES:
 * - Commercial-use requirements are explicit constraints.
 * - Known licensing conflicts disqualify a creator from eligible rankings.
 * - Unknown/unverified rights require explicit brand confirmation.
 * - Zero AI hallucination: strictly uses actual creator profiles and portfolio items.
 * - Scoring is 100% deterministic arithmetic (no generative LLM in the scoring loop).
 */

import type {
  BrandBriefRow,
  CreatorWithDetails,
  ContentType,
  AspectRatio,
  CommercialLicenseType,
} from "@/types";

export interface MatchScoreBreakdown {
  contentType: {
    score: number;
    maxScore: number;
    matched: boolean;
    reason: string;
  };
  tools: {
    score: number;
    maxScore: number;
    matchedTools: string[];
    missingTools: string[];
    overlapPercentage: number;
  };
  specialization: {
    score: number;
    maxScore: number;
    matchedSpecializations: string[];
  };
  format: {
    score: number;
    maxScore: number;
    matchedRatio: boolean;
    adaptable: boolean;
    availableRatios: AspectRatio[];
  };
  budgetAndAvailability: {
    score: number;
    maxScore: number;
    withinBudget: boolean;
    isAvailable: boolean;
  };
}

export type CommercialRightsStatus =
  | "compatible"
  | "requires_confirmation"
  | "incompatible";

export interface CreatorMatchResult {
  creator: CreatorWithDetails;
  overallScore: number; // 0 to 100
  isEligible: boolean; // false if commercial rights conflict
  commercialRightsStatus: CommercialRightsStatus;
  commercialRightsReason: string;
  breakdown: MatchScoreBreakdown;
  matchedCriteria: string[];
  missingCriteria: string[];
  matchTier: "strong" | "moderate" | "weak" | "incompatible";
}

export interface BriefMatchingReport {
  briefId: string;
  totalCreatorsEvaluated: number;
  eligibleMatchesCount: number;
  rankedCreators: CreatorMatchResult[];
  disqualifiedCreators: CreatorMatchResult[];
  emptyStateAdvice?: string[];
}

/**
 * Evaluates commercial rights compatibility.
 * Commercial-use requirements are strict constraints.
 */
export function evaluateCommercialRights(
  briefLicense: CommercialLicenseType,
  creator: CreatorWithDetails
): {
  status: CommercialRightsStatus;
  isEligible: boolean;
  reason: string;
} {
  const termsText = (creator.commercial_terms || "").toLowerCase();
  const portfolioLicenses = creator.portfolio_items.map(
    (p) => p.commercial_rights_granted
  );

  // Check for explicit known negative restriction
  const isExplicitlyNonCommercial =
    termsText.includes("non-commercial only") ||
    termsText.includes("personal use only") ||
    (portfolioLicenses.length > 0 &&
      portfolioLicenses.every((l) => l === "non_commercial"));

  const isExplicitlyDigitalOrganicOnly =
    (termsText.includes("organic only") ||
      termsText.includes("digital organic only") ||
      termsText.includes("no paid ads")) &&
    !termsText.includes("buyout") &&
    !termsText.includes("broadcast");

  // Rule 1: Non-commercial restriction conflicts with any commercial brief
  if (briefLicense !== "non_commercial" && isExplicitlyNonCommercial) {
    return {
      status: "incompatible",
      isEligible: false,
      reason:
        "Licensing conflict: Brief requires commercial rights, but creator's published terms strictly limit usage to non-commercial / portfolio use.",
    };
  }

  // Rule 2: Full Buyout requested
  if (briefLicense === "full_buyout") {
    if (
      termsText.includes("full commercial buyout") ||
      termsText.includes("full buyout") ||
      termsText.includes("total ownership") ||
      portfolioLicenses.includes("full_buyout")
    ) {
      return {
        status: "compatible",
        isEligible: true,
        reason:
          "Full commercial buyout rights confirmed in creator profile and portfolio records.",
      };
    }

    if (isExplicitlyDigitalOrganicOnly) {
      return {
        status: "incompatible",
        isEligible: false,
        reason:
          "Licensing conflict: Brief demands full buyout & resale, but creator's terms explicitly restrict licensing to organic digital only.",
      };
    }

    // Rights are unknown / unstated for full buyout
    return {
      status: "requires_confirmation",
      isEligible: true,
      reason:
        "Commercial rights unconfirmed: Creator offers commercial work but has not explicitly published perpetual buyout terms. Contractual confirmation required before agreement.",
    };
  }

  // Rule 3: Broadcast requested
  if (briefLicense === "broadcast") {
    if (
      termsText.includes("broadcast") ||
      termsText.includes("tv") ||
      termsText.includes("streaming") ||
      termsText.includes("full buyout") ||
      portfolioLicenses.includes("broadcast") ||
      portfolioLicenses.includes("full_buyout")
    ) {
      return {
        status: "compatible",
        isEligible: true,
        reason:
          "Broadcast & streaming distribution rights supported by creator profile.",
      };
    }

    if (isExplicitlyDigitalOrganicOnly) {
      return {
        status: "incompatible",
        isEligible: false,
        reason:
          "Licensing conflict: Brief requires broadcast / television rights, but creator explicitly offers organic digital only.",
      };
    }

    return {
      status: "requires_confirmation",
      isEligible: true,
      reason:
        "Broadcast rights unconfirmed: Requires formal confirmation before campaign production.",
    };
  }

  // Rule 4: Social Media Paid Ads requested
  if (briefLicense === "social_media_ads") {
    if (
      termsText.includes("buyout") ||
      termsText.includes("broadcast") ||
      termsText.includes("social") ||
      termsText.includes("marketing") ||
      termsText.includes("advertising") ||
      portfolioLicenses.some(
        (l) => l === "full_buyout" || l === "broadcast" || l === "social_media_ads"
      )
    ) {
      return {
        status: "compatible",
        isEligible: true,
        reason:
          "Paid social media & ad campaign rights fully supported by creator.",
      };
    }

    if (isExplicitlyDigitalOrganicOnly) {
      return {
        status: "incompatible",
        isEligible: false,
        reason:
          "Licensing conflict: Brief requires paid advertising rights, but creator's known terms restrict to organic non-paid channels.",
      };
    }

    return {
      status: "requires_confirmation",
      isEligible: true,
      reason:
        "Standard commercial rights: Creator has not specified paid ad terms. Confirmation required.",
    };
  }

  // Rule 5: Digital Only (Organic)
  if (briefLicense === "digital_only") {
    return {
      status: "compatible",
      isEligible: true,
      reason: "Organic digital marketing usage is supported.",
    };
  }

  // Default non-commercial
  return {
    status: "compatible",
    isEligible: true,
    reason: "Non-commercial licensing matches creator requirements.",
  };
}

/**
 * Match a single creator against a brand brief.
 */
export function scoreCreatorMatch(
  brief: BrandBriefRow,
  creator: CreatorWithDetails
): CreatorMatchResult {
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];

  // ==========================================
  // 1. Content Type Compatibility (Max: 25)
  // ==========================================
  let contentTypeScore = 0;
  let contentTypeMatched = false;
  let contentTypeReason = "";

  const matchingPortfolioItems = creator.portfolio_items.filter(
    (p) => p.content_type === brief.target_content_type
  );

  if (matchingPortfolioItems.length > 0) {
    contentTypeScore = 25;
    contentTypeMatched = true;
    contentTypeReason = `Verified portfolio evidence: ${matchingPortfolioItems.length} ${brief.target_content_type} showcase item(s).`;
    matchedCriteria.push(
      `Direct ${brief.target_content_type} portfolio evidence (${matchingPortfolioItems.length} project${matchingPortfolioItems.length > 1 ? "s" : ""})`
    );
  } else {
    // Check if creator specialization implies competence
    const specMap: Record<ContentType, string[]> = {
      video: ["cinematic_video", "motion_graphics", "vfx_composite"],
      image: ["character_design", "product_render", "virtual_influencer", "concept_art"],
      "3d": ["3d", "motion_graphics", "vfx_composite"],
      multi_modal: ["motion_graphics", "concept_art"],
      audio: ["voice_audio"],
    };

    const relevantSpecs = specMap[brief.target_content_type] || [];
    const hasSpec = creator.specializations.some((s) => relevantSpecs.includes(s));

    if (hasSpec) {
      contentTypeScore = 15;
      contentTypeMatched = true;
      contentTypeReason = `Specialization matches ${brief.target_content_type}, though direct portfolio showcase has not yet been uploaded.`;
      matchedCriteria.push(
        `Specialization aligns with ${brief.target_content_type}`
      );
      missingCriteria.push(
        `No dedicated ${brief.target_content_type} showcase currently in portfolio`
      );
    } else {
      contentTypeScore = 0;
      contentTypeMatched = false;
      contentTypeReason = `No portfolio work or primary specialization found for ${brief.target_content_type}.`;
      missingCriteria.push(
        `Lacks ${brief.target_content_type} portfolio examples and direct specialization`
      );
    }
  }

  // ==========================================
  // 2. AI Toolchain Overlap (Max: 25)
  // ==========================================
  const requiredTools = brief.required_ai_tools || [];
  const creatorToolsPool = Array.from(
    new Set([
      ...creator.primary_ai_tools,
      ...creator.portfolio_items.flatMap((p) => p.ai_tools_used || []),
    ])
  );

  let toolsScore = 0;
  let matchedTools: string[] = [];
  let missingTools: string[] = [];
  let overlapPercentage = 0;

  if (requiredTools.length === 0) {
    // If no specific tools required, evaluate if creator tools match the content type
    toolsScore = 20;
    overlapPercentage = 100;
    matchedCriteria.push(
      `Active AI toolchain with ${creatorToolsPool.length} production models`
    );
  } else {
    matchedTools = requiredTools.filter((tool) =>
      creatorToolsPool.some((ct) => ct.toLowerCase() === tool.toLowerCase())
    );
    missingTools = requiredTools.filter(
      (tool) =>
        !creatorToolsPool.some((ct) => ct.toLowerCase() === tool.toLowerCase())
    );

    overlapPercentage = Math.round(
      (matchedTools.length / requiredTools.length) * 100
    );
    toolsScore = Math.round((matchedTools.length / requiredTools.length) * 25);

    if (matchedTools.length > 0) {
      matchedCriteria.push(
        `Matches required AI tools: ${matchedTools.map((t) => t.replace(/_/g, " ")).join(", ")} (${matchedTools.length}/${requiredTools.length})`
      );
    }

    if (missingTools.length > 0) {
      missingCriteria.push(
        `Missing preferred tool(s): ${missingTools.map((t) => t.replace(/_/g, " ")).join(", ")}`
      );
    }
  }

  // ==========================================
  // 3. Specialization & Skills Alignment (Max: 25)
  // ==========================================
  let specScore = 0;
  const targetSpecializations: string[] = [];

  // Infer target specializations from brief content type, style, and goals
  const textCorpus = `${brief.target_content_type} ${brief.preferred_style || ""} ${brief.campaign_goals} ${brief.title}`.toLowerCase();

  if (textCorpus.includes("cinematic") || textCorpus.includes("film") || brief.target_content_type === "video") {
    targetSpecializations.push("cinematic_video");
  }
  if (textCorpus.includes("vfx") || textCorpus.includes("composite") || textCorpus.includes("liquid") || textCorpus.includes("effects")) {
    targetSpecializations.push("vfx_composite");
  }
  if (textCorpus.includes("character") || textCorpus.includes("influencer") || textCorpus.includes("model")) {
    targetSpecializations.push("character_design", "virtual_influencer");
  }
  if (textCorpus.includes("product") || textCorpus.includes("sneaker") || textCorpus.includes("car") || textCorpus.includes("watch")) {
    targetSpecializations.push("product_render");
  }
  if (textCorpus.includes("3d") || textCorpus.includes("kinetic") || textCorpus.includes("simulation")) {
    targetSpecializations.push("3d", "motion_graphics");
  }
  if (textCorpus.includes("audio") || textCorpus.includes("sound") || textCorpus.includes("voice")) {
    targetSpecializations.push("voice_audio");
  }

  const matchedSpecializations = creator.specializations.filter((s) =>
    targetSpecializations.includes(s)
  );

  if (matchedSpecializations.length >= 2) {
    specScore = 25;
    matchedCriteria.push(
      `Strong specialization alignment: ${matchedSpecializations.map((s) => s.replace(/_/g, " ")).join(", ")}`
    );
  } else if (matchedSpecializations.length === 1) {
    specScore = 18;
    matchedCriteria.push(
      `Specialization alignment: ${matchedSpecializations[0].replace(/_/g, " ")}`
    );
  } else if (creator.specializations.length > 0) {
    specScore = 8;
    missingCriteria.push(
      `Primary specializations (${creator.specializations.join(", ")}) diverge from target creative style`
    );
  }

  // ==========================================
  // 4. Format & Aspect Ratio Evidence (Max: 15)
  // ==========================================
  let formatScore = 0;
  const availableRatios = creator.portfolio_items.map((p) => p.aspect_ratio);
  const matchedRatio = availableRatios.includes(brief.preferred_aspect_ratio);
  const adaptable = creator.portfolio_items.length > 0;

  if (matchedRatio) {
    formatScore = 15;
    matchedCriteria.push(
      `Demonstrated ${brief.preferred_aspect_ratio} format portfolio evidence`
    );
  } else if (adaptable) {
    formatScore = 7;
    missingCriteria.push(
      `No direct ${brief.preferred_aspect_ratio} sample in portfolio (adaptable from existing formats: ${availableRatios.join(", ")})`
    );
  } else {
    formatScore = 0;
    missingCriteria.push(
      `No format portfolio evidence on record`
    );
  }

  // ==========================================
  // 5. Budget & Availability Feasibility (Max: 10)
  // ==========================================
  let budgetScore = 0;
  const withinBudget = creator.starting_rate_cents <= brief.budget_max_cents;
  const isAvailable = creator.is_available;

  if (withinBudget) {
    budgetScore += 7;
    matchedCriteria.push(
      `Starting rate ($${creator.starting_rate_cents / 100}) fits within brief budget ($${brief.budget_max_cents / 100} max)`
    );
  } else {
    const overage = (creator.starting_rate_cents - brief.budget_max_cents) / 100;
    missingCriteria.push(
      `Starting rate ($${creator.starting_rate_cents / 100}) exceeds maximum budget by $${overage}`
    );
  }

  if (isAvailable) {
    budgetScore += 3;
    matchedCriteria.push("Currently available for new engagements");
  } else {
    missingCriteria.push("Creator is currently marked as unavailable");
  }

  // ==========================================
  // 6. Commercial Rights Evaluation (Constraint)
  // ==========================================
  const rightsEval = evaluateCommercialRights(
    brief.commercial_use_requirements,
    creator
  );

  if (rightsEval.status === "compatible") {
    matchedCriteria.push(rightsEval.reason);
  } else if (rightsEval.status === "requires_confirmation") {
    missingCriteria.push(rightsEval.reason);
  } else {
    // Incompatible
    missingCriteria.push(rightsEval.reason);
  }

  // Overall Score Calculation (Clamped 0 to 100)
  const rawScore =
    contentTypeScore +
    toolsScore +
    specScore +
    formatScore +
    budgetScore;
  const overallScore = Math.min(100, Math.max(0, rawScore));

  // Determine Match Tier
  let matchTier: CreatorMatchResult["matchTier"] = "weak";
  if (!rightsEval.isEligible) {
    matchTier = "incompatible";
  } else if (overallScore >= 75) {
    matchTier = "strong";
  } else if (overallScore >= 50) {
    matchTier = "moderate";
  }

  return {
    creator,
    overallScore,
    isEligible: rightsEval.isEligible,
    commercialRightsStatus: rightsEval.status,
    commercialRightsReason: rightsEval.reason,
    breakdown: {
      contentType: {
        score: contentTypeScore,
        maxScore: 25,
        matched: contentTypeMatched,
        reason: contentTypeReason,
      },
      tools: {
        score: toolsScore,
        maxScore: 25,
        matchedTools,
        missingTools,
        overlapPercentage,
      },
      specialization: {
        score: specScore,
        maxScore: 25,
        matchedSpecializations,
      },
      format: {
        score: formatScore,
        maxScore: 15,
        matchedRatio,
        adaptable,
        availableRatios,
      },
      budgetAndAvailability: {
        score: budgetScore,
        maxScore: 10,
        withinBudget,
        isAvailable,
      },
    },
    matchedCriteria,
    missingCriteria,
    matchTier,
  };
}

/**
 * Matches a list of candidate creators against a brand brief.
 * Sorts eligible creators deterministically by score descending.
 * Separates disqualified (licensing-conflicted) creators into disqualifiedCreators.
 */
export function matchCreatorsForBrief(
  brief: BrandBriefRow,
  creators: CreatorWithDetails[]
): BriefMatchingReport {
  const evaluated = creators.map((c) => scoreCreatorMatch(brief, c));

  // Filter eligible vs disqualified
  const eligibleMatches = evaluated
    .filter((res) => res.isEligible)
    .sort((a, b) => b.overallScore - a.overallScore);

  const disqualifiedCreators = evaluated
    .filter((res) => !res.isEligible)
    .sort((a, b) => b.overallScore - a.overallScore);

  const emptyStateAdvice: string[] = [];

  if (eligibleMatches.length === 0) {
    if (disqualifiedCreators.length > 0) {
      emptyStateAdvice.push(
        `Creators were found but disqualified due to strict commercial licensing constraints (${brief.commercial_use_requirements.replace(/_/g, " ")}). Consider adjusting to Paid Campaign & Ads or confirming terms directly.`
      );
    }
    if (brief.required_ai_tools && brief.required_ai_tools.length > 2) {
      emptyStateAdvice.push(
        "Try relaxing toolchain requirements; some creators specialize in alternative generative models."
      );
    }
    if (brief.budget_max_cents < 50000) {
      emptyStateAdvice.push(
        "The current maximum budget is below market average for commercial AI directors. Consider increasing the budget range."
      );
    }
    if (emptyStateAdvice.length === 0) {
      emptyStateAdvice.push(
        "No creators currently match this combination of creative specifications. Broaden aspect ratios or content style requirements."
      );
    }
  }

  return {
    briefId: brief.id,
    totalCreatorsEvaluated: creators.length,
    eligibleMatchesCount: eligibleMatches.length,
    rankedCreators: eligibleMatches,
    disqualifiedCreators,
    emptyStateAdvice: emptyStateAdvice.length > 0 ? emptyStateAdvice : undefined,
  };
}
