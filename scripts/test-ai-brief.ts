/**
 * Prismora AI-Assisted Brief Builder Test Suite
 *
 * Acceptance Tests:
 * 1. Successful generation (structured draft containing all mandatory fields & conservative licensing).
 * 2. Invalid model output (strict schema validator rejecting malformed enums, missing fields, invalid budgets).
 * 3. API failure / timeout handling (graceful error return without crashing).
 * 4. Manual fallback (brief creation persists 100% reliably even when AI is uncontacted or offline).
 */

import {
  generateStructuredBrief,
  validateGeneratedDraft,
  generateHeuristicDraft,
} from "../src/lib/ai/brief-generator";
import { createBrief, getBriefById } from "../src/lib/services/briefs";

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
  console.log("  Prismora AI-Assisted Brief Builder Test Suite     ");
  console.log("====================================================\n");

  // ========================================================
  // TEST 1: Successful Generation & Conservative Rights Policy
  // ========================================================
  console.log("TEST 1: Successful Generation & Conservative Rights Policy");

  const prompt1 =
    "15-second cinematic cyberpunk teaser for an electric hypercar. Heavy neon reflections, synth soundtrack, high-energy cuts for Instagram reels.";
  const result1 = await generateStructuredBrief(prompt1);

  assert(result1.success === true, "1.1 Generator returns success");
  assert(!!result1.draft, "1.2 Generator provides structured draft");

  if (result1.draft) {
    assert(result1.draft.title.length >= 3, "1.3 Draft has descriptive title", result1.draft.title);
    assert(
      result1.draft.campaign_goals.length >= 5,
      "1.4 Draft has clear campaign goals",
      result1.draft.campaign_goals
    );
    assert(
      result1.draft.target_content_type === "video",
      "1.5 Draft detected content type as 'video'",
      result1.draft.target_content_type
    );
    assert(
      result1.draft.preferred_aspect_ratio === "9:16",
      "1.6 Draft set aspect ratio to '9:16' for reels",
      result1.draft.preferred_aspect_ratio
    );
    assert(
      result1.draft.preferred_style.toLowerCase().includes("cyberpunk") ||
        result1.draft.preferred_style.toLowerCase().includes("cinematic"),
      "1.7 Draft detected appropriate visual style",
      result1.draft.preferred_style
    );
    // CRITICAL: Conservative Licensing Protection Check
    assert(
      result1.draft.commercial_use_requirements === "social_media_ads",
      "1.8 Conservative safeguard: Defaulted to 'social_media_ads' without silently inventing full buyout",
      result1.draft.commercial_use_requirements
    );
    assert(
      result1.draft.licensing_reasoning.length > 10,
      "1.9 Draft includes explicit licensing rationale",
      result1.draft.licensing_reasoning
    );
    assert(
      result1.draft.suggested_budget_min_cents > 0 &&
        result1.draft.suggested_budget_max_cents >= result1.draft.suggested_budget_min_cents,
      "1.10 Suggested budgets are positive and max >= min"
    );
    assert(
      result1.draft.suggested_ai_tools.length >= 1,
      "1.11 Recommended AI toolchain is populated",
      result1.draft.suggested_ai_tools.join(", ")
    );
  }

  // Check explicit buyout when requested by user
  const promptBuyout = "Broadcast commercial for television with full buyout and perpetual exclusive rights.";
  const resultBuyout = await generateStructuredBrief(promptBuyout);
  assert(
    resultBuyout.draft?.commercial_use_requirements === "full_buyout",
    "1.12 Full buyout granted only when explicitly requested in prompt",
    resultBuyout.draft?.commercial_use_requirements
  );

  console.log("");

  // ========================================================
  // TEST 2: Invalid Model Output & Schema Rejection
  // ========================================================
  console.log("TEST 2: Invalid Model Output & Schema Validation");

  // 2.1 Rejection of non-object
  const invalidType = validateGeneratedDraft("not an object");
  assert(invalidType.valid === false, "2.1 Rejects non-object input");

  // 2.2 Rejection of invalid content type enum
  const invalidEnum = validateGeneratedDraft({
    title: "Valid Title Here",
    description: "Long enough description for the test brief.",
    campaign_goals: "Reach millions",
    target_content_type: "unsupported_format_xxx",
    preferred_style: "Cinematic",
    preferred_aspect_ratio: "16:9",
    commercial_use_requirements: "social_media_ads",
    suggested_budget_min_cents: 100000,
    suggested_budget_max_cents: 200000,
    suggested_ai_tools: ["runway_gen3"],
  });
  assert(invalidEnum.valid === false, "2.2 Rejects invalid content_type enum");
  assert(
    invalidEnum.errors.some((e) => e.includes("target_content_type")),
    "2.3 Error message identifies target_content_type"
  );

  // 2.3 Rejection of invalid aspect ratio enum
  const invalidAspect = validateGeneratedDraft({
    title: "Valid Title",
    description: "Long enough description for the test brief.",
    campaign_goals: "Reach millions",
    target_content_type: "video",
    preferred_style: "Cinematic",
    preferred_aspect_ratio: "99:99",
    commercial_use_requirements: "social_media_ads",
    suggested_budget_min_cents: 100000,
    suggested_budget_max_cents: 200000,
    suggested_ai_tools: ["runway_gen3"],
  });
  assert(invalidAspect.valid === false, "2.4 Rejects invalid preferred_aspect_ratio");

  // 2.4 Rejection of inverted or negative budget
  const invalidBudget = validateGeneratedDraft({
    title: "Valid Title",
    description: "Long enough description for the test brief.",
    campaign_goals: "Reach millions",
    target_content_type: "video",
    preferred_style: "Cinematic",
    preferred_aspect_ratio: "16:9",
    commercial_use_requirements: "social_media_ads",
    suggested_budget_min_cents: 500000,
    suggested_budget_max_cents: 200000, // max < min
    suggested_ai_tools: ["runway_gen3"],
  });
  assert(invalidBudget.valid === false, "2.5 Rejects max budget less than min budget");

  // 2.5 Generator simulation of invalid schema
  const simInvalidResult = await generateStructuredBrief(prompt1, {
    simulationMode: "invalid_schema",
  });
  assert(
    simInvalidResult.success === false,
    "2.6 Generator simulation handles invalid schema gracefully"
  );
  assert(
    (simInvalidResult.errors?.length || 0) > 0,
    "2.7 Validation errors returned on invalid schema"
  );

  console.log("");

  // ========================================================
  // TEST 3: API Failure & Timeout Recovery
  // ========================================================
  console.log("TEST 3: API Failure & Timeout Recovery");

  const simApiErrorResult = await generateStructuredBrief(prompt1, {
    simulationMode: "api_error",
  });
  assert(
    simApiErrorResult.success === false,
    "3.1 Generator handles API error safely"
  );
  assert(
    !!simApiErrorResult.error && simApiErrorResult.error.includes("503"),
    "3.2 Error message reflects upstream failure and fallback availability",
    simApiErrorResult.error
  );

  // Short prompt rejection
  const shortPromptResult = await generateStructuredBrief("hey");
  assert(
    shortPromptResult.success === false,
    "3.3 Rejects empty or excessively brief prompt (< 5 chars)"
  );

  console.log("");

  // ========================================================
  // TEST 4: Manual Fallback Workflow Persistence
  // ========================================================
  console.log("TEST 4: Manual Fallback Workflow Persistence");

  const manualPayload = {
    title: "Manual Fallback Autumn Apparel Spot",
    company_name: "Artisan Studio Collective",
    description:
      "A completely manually authored brief created without AI assistance during service outage.",
    campaign_goals: "Demonstrate independent fallback resilience.",
    target_content_type: "image" as const,
    preferred_style: "Warm Earthy Photorealism",
    preferred_aspect_ratio: "4:5" as const,
    commercial_use_requirements: "digital_only" as const,
    budget_min_cents: 180000,
    budget_max_cents: 360000,
    required_ai_tools: ["midjourney_v6", "flux_1"],
    status: "open" as const,
  };

  const createRes = await createBrief(manualPayload);
  assert(createRes.success === true, "4.1 Manual brief saves successfully without AI");
  assert(!!createRes.brief?.id, "4.2 Manual brief assigned stable ID", createRes.brief?.id);

  if (createRes.brief) {
    const fetchedLookup = await getBriefById(createRes.brief.id);
    const fetched = fetchedLookup.data;
    assert(!!fetched, "4.3 Manual brief successfully retrieved from database");
    assert(
      fetched?.title === manualPayload.title,
      "4.4 Title retained perfectly"
    );
    assert(
      fetched?.target_content_type === "image",
      "4.5 Content type retained perfectly"
    );
    assert(
      fetched?.preferred_style === manualPayload.preferred_style,
      "4.6 Preferred style retained perfectly"
    );
    assert(
      fetched?.preferred_aspect_ratio === "4:5",
      "4.7 Aspect ratio retained perfectly"
    );
    assert(
      fetched?.commercial_use_requirements === "digital_only",
      "4.8 Commercial use requirements retained perfectly"
    );
  }

  console.log("");
  console.log("====================================================");
  console.log(`  AI-Assisted Brief Builder Suite Summary           `);
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
