/**
 * Prismora Explainable Creator Matching Test Suite
 *
 * Acceptance Tests:
 * 1. Strong Match Case (high score, full toolchain overlap, direct portfolio evidence, compatible rights).
 * 2. Weak Match Case (low score, capabilities gap, missing medium evidence, explicit missing criteria).
 * 3. Incompatible Licensing Terms Case (hard constraint violation, creator strictly disqualified from ranking).
 * 4. Unknown Rights Case (requires confirmation, flagged with explicit contractual notice).
 * 5. No-Match Case (sensible empty state with actionable suggestions for brand).
 */

import {
  scoreCreatorMatch,
  matchCreatorsForBrief,
  evaluateCommercialRights,
  type CreatorMatchResult,
} from "../src/lib/matching/creator-matcher";
import { SEED_CREATORS } from "../src/lib/data/seed-creators";
import type { BrandBriefRow, CreatorWithDetails } from "../src/types";

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ""}`);
    failCount++;
  }
}

async function runTests() {
  console.log("====================================================");
  console.log("  Prismora Explainable Creator Matching Test Suite  ");
  console.log("====================================================\n");

  const [elena, maya, leo, marcus] = SEED_CREATORS;

  // Mock standard video campaign brief
  const videoBrief: BrandBriefRow = {
    id: "b-test-video-001",
    brand_id: "00000000-0000-0000-0000-000000000099",
    title: "Apex Horizon: Cinematic Automotive Launch Film",
    company_name: "Apex Motors",
    description: "A 16:9 widescreen cinematic commercial featuring photorealistic reflections and VFX.",
    campaign_goals: "Drive 5M impressions across YouTube pre-roll and premium display networks.",
    target_content_type: "video",
    preferred_style: "Futuristic photorealistic VFX",
    preferred_aspect_ratio: "16:9",
    commercial_use_requirements: "social_media_ads",
    budget_min_cents: 250000,
    budget_max_cents: 600000,
    currency: "USD",
    required_ai_tools: ["runway_gen3", "flux_1", "comfy_ui"],
    deadline: "2026-11-30T00:00:00Z",
    status: "open",
    created_at: "2026-10-09T00:00:00Z",
    updated_at: "2026-10-09T00:00:00Z",
  };

  // ========================================================
  // TEST 1: Strong Match Case
  // ========================================================
  console.log("TEST 1: Strong Match Evaluation (Elena Rostova / Aetheris Studios)");

  const elenaMatch = scoreCreatorMatch(videoBrief, elena);

  assert(elenaMatch.isEligible === true, "1.1 Creator is marked as eligible");
  assert(elenaMatch.overallScore >= 80, `1.2 Overall score indicates strong match (Score: ${elenaMatch.overallScore})`);
  assert(elenaMatch.matchTier === "strong", "1.3 Match tier classified as 'strong'");
  assert(elenaMatch.breakdown.contentType.score === 25, "1.4 Content type awarded max 25 pts (direct video portfolio)");
  assert(elenaMatch.breakdown.contentType.matched === true, "1.5 Content type matched flag is true");
  assert(elenaMatch.breakdown.tools.score === 25, "1.6 AI Toolchain awarded max 25 pts (100% overlap with Runway, FLUX, ComfyUI)");
  assert(elenaMatch.breakdown.format.matchedRatio === true, "1.7 Preferred format 16:9 matched in portfolio");
  assert(elenaMatch.breakdown.format.score === 15, "1.8 Format compatibility awarded max 15 pts");
  assert(elenaMatch.commercialRightsStatus === "compatible", "1.9 Commercial rights status is 'compatible'");
  assert(elenaMatch.matchedCriteria.length >= 4, "1.10 At least 4 matched criteria items generated for explainability");

  console.log("");

  // ========================================================
  // TEST 2: Weak Match Case & Capabilities Gap
  // ========================================================
  console.log("TEST 2: Weak Match Evaluation (Marcus Finch on Video Brief)");

  const marcusMatch = scoreCreatorMatch(videoBrief, marcus);

  assert(marcusMatch.overallScore < 50, `2.1 Overall score reflects weak match for divergent medium (Score: ${marcusMatch.overallScore})`);
  assert(marcusMatch.breakdown.contentType.score === 0, "2.2 Content type score is 0 (audio creator lacks video portfolio & specialization)");
  assert(marcusMatch.breakdown.format.score === 0, "2.3 Format score is 0 (empty portfolio)");
  assert(marcusMatch.missingCriteria.some(c => c.toLowerCase().includes("video")), "2.4 Missing criteria explicitly identifies lack of video experience");
  assert(marcusMatch.missingCriteria.some(c => c.toLowerCase().includes("unavailable") || c.toLowerCase().includes("budget")), "2.5 Missing criteria notes creator availability / feasibility");

  console.log("");

  // ========================================================
  // TEST 3: Incompatible Licensing Terms (Hard Constraint Violation)
  // ========================================================
  console.log("TEST 3: Incompatible Licensing Terms (Strict Disqualification)");

  // Brief demanding full commercial buyout
  const buyoutBrief: BrandBriefRow = {
    ...videoBrief,
    id: "b-test-buyout-002",
    commercial_use_requirements: "full_buyout",
  };

  // Creator with explicit restrictive terms (non-commercial only)
  const nonCommercialCreator: CreatorWithDetails = {
    ...marcus,
    id: "c-restricted-001",
    commercial_terms: "Non-commercial only. Personal and educational showcase use only. No commercial exploitation.",
    portfolio_items: [
      {
        id: "p-nc-1",
        creator_id: "c-restricted-001",
        title: "Experimental Audio Art",
        description: "Student sound design piece",
        content_type: "video",
        media_url: "https://example.com/audio.mp4",
        thumbnail_url: null,
        aspect_ratio: "16:9",
        ai_tools_used: ["eleven_labs"],
        generation_parameters: {},
        workflow_breakdown: null,
        commercial_rights_granted: "non_commercial",
        is_featured: false,
        view_count: 10,
        created_at: "2026-10-01T00:00:00Z",
        updated_at: "2026-10-01T00:00:00Z",
      },
    ],
  };

  const restrictedMatch = scoreCreatorMatch(buyoutBrief, nonCommercialCreator);

  assert(restrictedMatch.isEligible === false, "3.1 Conflicting creator is marked isEligible = false");
  assert(restrictedMatch.commercialRightsStatus === "incompatible", "3.2 Commercial rights status is 'incompatible'");
  assert(restrictedMatch.matchTier === "incompatible", "3.3 Match tier classified as 'incompatible'");
  assert(
    restrictedMatch.commercialRightsReason.toLowerCase().includes("conflict") ||
      restrictedMatch.commercialRightsReason.toLowerCase().includes("strictly limit"),
    "3.4 Reason explains explicit conflict with brief requirements",
    restrictedMatch.commercialRightsReason
  );

  // Verify ranker excludes incompatible creator from eligible list
  const multiReport = matchCreatorsForBrief(buyoutBrief, [elena, nonCommercialCreator]);
  assert(
    !multiReport.rankedCreators.some(m => m.creator.id === nonCommercialCreator.id),
    "3.5 Disqualified creator is NOT ranked in eligible list"
  );
  assert(
    multiReport.disqualifiedCreators.some(m => m.creator.id === nonCommercialCreator.id),
    "3.6 Disqualified creator is placed in disqualified list with transparency notice"
  );

  console.log("");

  // ========================================================
  // TEST 4: Unknown Rights Require Confirmation
  // ========================================================
  console.log("TEST 4: Unknown Rights Requiring Brand Confirmation");

  const unstatedRightsCreator: CreatorWithDetails = {
    ...elena,
    id: "c-unstated-002",
    commercial_terms: "Standard commercial production services.",
    portfolio_items: [
      {
        ...elena.portfolio_items[0],
        commercial_rights_granted: "social_media_ads",
      },
    ],
  };

  const unconfirmedEval = evaluateCommercialRights("full_buyout", unstatedRightsCreator);
  assert(
    unconfirmedEval.status === "requires_confirmation",
    "4.1 Status is 'requires_confirmation' when buyout rights are unstated"
  );
  assert(
    unconfirmedEval.isEligible === true,
    "4.2 Creator remains eligible to be ranked with warning badge"
  );
  assert(
    unconfirmedEval.reason.toLowerCase().includes("confirmation required"),
    "4.3 Reason explicitly notes contractual confirmation requirement"
  );

  console.log("");

  // ========================================================
  // TEST 5: No-Match Case & Sensible Empty State
  // ========================================================
  console.log("TEST 5: No-Match Empty State & Brand Guidance");

  // Brief with impossible budget and restrictive licensing
  const impossibleBrief: BrandBriefRow = {
    ...videoBrief,
    id: "b-impossible-003",
    budget_max_cents: 10000, // $100 budget
    commercial_use_requirements: "full_buyout",
  };

  // Run match against only non-commercial creator
  const emptyReport = matchCreatorsForBrief(impossibleBrief, [nonCommercialCreator]);

  assert(emptyReport.eligibleMatchesCount === 0, "5.1 Reports 0 eligible matches");
  assert(emptyReport.rankedCreators.length === 0, "5.2 Ranked creators array is empty");
  assert(
    Array.isArray(emptyReport.emptyStateAdvice) && emptyReport.emptyStateAdvice.length > 0,
    "5.3 Empty state advice contains actionable recommendations for brand"
  );
  assert(
    !!emptyReport.emptyStateAdvice &&
      emptyReport.emptyStateAdvice.some(a => a.toLowerCase().includes("licensing") || a.toLowerCase().includes("budget")),
    "5.4 Advice identifies licensing or budget as root constraint",
    emptyReport.emptyStateAdvice?.join(" | ")
  );

  console.log("");
  console.log("====================================================");
  console.log(`  Matching Suite Summary                            `);
  console.log(`  Passed: ${passCount} | Failed: ${failCount}       `);
  console.log("====================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
