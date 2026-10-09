/**
 * Automated Acceptance Test Suite for Prismora Phase 03: Brand and Agency Briefs
 */

import {
  getBriefs,
  getBriefById,
  createBrief,
  updateBrief,
  validateBriefInput,
  type BriefInput,
} from "../src/lib/services/briefs";

async function runTests() {
  console.log("=================================================");
  console.log("   PRISMORA PHASE 03: ACCEPTANCE TEST SUITE      ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Test 1: Fetch Existing Campaign Briefs
  // -------------------------------------------------------------
  console.log("--- Test 1: Retrieve Initial Campaign Briefs ---");
  const { data: initialBriefs, isMock } = await getBriefs();
  assert(
    Array.isArray(initialBriefs) && initialBriefs.length >= 3,
    `Briefs listing returns array with at least 3 records (Found: ${initialBriefs.length})`
  );
  assert(
    isMock === true,
    "Correctly identifies mock/in-memory store when Supabase credentials are not in .env.local"
  );

  // -------------------------------------------------------------
  // Test 2: Validation of Required Fields (Reject Invalid / Incomplete)
  // -------------------------------------------------------------
  console.log("\n--- Test 2: Reject Invalid & Incomplete Required Inputs ---");

  // Subtest 2a: Empty payload
  const emptyValidation = validateBriefInput({});
  assert(
    emptyValidation.isValid === false,
    "Empty input payload is cleanly rejected"
  );
  assert(Boolean(emptyValidation.errors.title), "Identified missing 'title'");
  assert(Boolean(emptyValidation.errors.company_name), "Identified missing 'company_name'");
  assert(Boolean(emptyValidation.errors.description), "Identified missing 'description'");
  assert(Boolean(emptyValidation.errors.campaign_goals), "Identified missing 'campaign_goals'");
  assert(Boolean(emptyValidation.errors.target_content_type), "Identified missing 'target_content_type'");
  assert(Boolean(emptyValidation.errors.preferred_aspect_ratio), "Identified missing 'preferred_aspect_ratio'");
  assert(Boolean(emptyValidation.errors.commercial_use_requirements), "Identified missing 'commercial_use_requirements'");

  // Subtest 2b: Invalid budget relations (budget_max < budget_min)
  const budgetValidation = validateBriefInput({
    title: "Valid Campaign Title",
    company_name: "Acme Corp",
    description: "Detailed description of minimum length required.",
    campaign_goals: "Valid campaign goals.",
    target_content_type: "video",
    preferred_aspect_ratio: "16:9",
    commercial_use_requirements: "full_buyout",
    budget_min_cents: 500000,
    budget_max_cents: 300000, // Invalid: max < min
  });
  assert(
    budgetValidation.isValid === false,
    "Rejected invalid budget range where max < min"
  );
  assert(
    Boolean(budgetValidation.errors.budget_max_cents),
    "Error explicitly flags invalid budget_max_cents constraint"
  );

  // -------------------------------------------------------------
  // Test 3: Create Brief With Every Required Field
  // -------------------------------------------------------------
  console.log("\n--- Test 3: Create Brief With Every Required Field ---");
  const newBriefInput: BriefInput = {
    title: "Nebula Zero: 60s Cinematic AI Beverage Launch",
    company_name: "Omni Beverage Global",
    description:
      "Full generative video commercial highlighting quantum carbonation and cosmic floating fruit droplets with anamorphic lighting.",
    campaign_goals:
      "Drive high virality across Instagram Reels and YouTube ahead of Summer 2027 product release.",
    target_content_type: "video",
    preferred_style: "Hyper-stylized beverage cinematography, macroscopic liquid caustics, vibrant neon accents",
    preferred_aspect_ratio: "9:16",
    commercial_use_requirements: "full_buyout",
    budget_min_cents: 400000, // $4,000
    budget_max_cents: 600000, // $6,000
    required_ai_tools: ["runway_gen3", "flux_1", "comfy_ui"],
    deadline: "2026-12-01T00:00:00Z",
    status: "open",
    currency: "USD",
  };

  const createResult = await createBrief(newBriefInput);
  assert(createResult.success === true, "Brief creation succeeded without errors");
  assert(Boolean(createResult.brief && createResult.brief.id), `Brief generated with stable ID: ${createResult.brief?.id}`);

  const createdId = createResult.brief!.id;

  // -------------------------------------------------------------
  // Test 4: Save & Reopen — Verify All Fields Retain Values
  // -------------------------------------------------------------
  console.log("\n--- Test 4: Save and Reopen — Verify Value Retention ---");
  const reopenedResult = await getBriefById(createdId);
  assert(reopenedResult.data !== null, "Successfully reopened saved brief from database/store");

  const b = reopenedResult.data!;
  assert(b.title === newBriefInput.title, `Title retained: '${b.title}'`);
  assert(b.company_name === newBriefInput.company_name, `Company name retained: '${b.company_name}'`);
  assert(b.description === newBriefInput.description, "Description retained");
  assert(b.campaign_goals === newBriefInput.campaign_goals, "Campaign goals retained");
  assert(b.target_content_type === "video", "Content type retained: 'video'");
  assert(b.preferred_style === newBriefInput.preferred_style, "Desired style retained");
  assert(b.preferred_aspect_ratio === "9:16", "Aspect ratio retained: '9:16'");
  assert(b.commercial_use_requirements === "full_buyout", "Commercial-use license retained: 'full_buyout'");
  assert(b.budget_min_cents === 400000, `Budget min retained: $${b.budget_min_cents / 100}`);
  assert(b.budget_max_cents === 600000, `Budget max retained: $${b.budget_max_cents / 100}`);
  assert(
    Array.isArray(b.required_ai_tools) && b.required_ai_tools.includes("runway_gen3"),
    "Required AI tools array retained with 'runway_gen3'"
  );
  assert(b.deadline === newBriefInput.deadline, `Deadline retained: '${b.deadline}'`);
  assert(b.status === "open", "Status retained: 'open'");

  // -------------------------------------------------------------
  // Test 5: Edit Saved Brief
  // -------------------------------------------------------------
  console.log("\n--- Test 5: Edit Saved Brief ---");
  const updateResult = await updateBrief(createdId, {
    budget_max_cents: 750000, // Raised budget to $7,500
    preferred_style: "Updated Cyberpunk Organic Splash Simulation",
    status: "in_review",
  });

  assert(updateResult.success === true, "Brief update succeeded without errors");

  // Re-fetch to confirm update persisted
  const updatedLookup = await getBriefById(createdId);
  const updatedBrief = updatedLookup.data!;
  assert(
    updatedBrief.budget_max_cents === 750000,
    `Budget max updated to $7,500 (Found: $${updatedBrief.budget_max_cents / 100})`
  );
  assert(
    updatedBrief.preferred_style === "Updated Cyberpunk Organic Splash Simulation",
    "Preferred style updated"
  );
  assert(updatedBrief.status === "in_review", "Status updated to 'in_review'");
  assert(
    updatedBrief.title === newBriefInput.title,
    "Unmodified fields (title) remain intact after partial update"
  );

  // -------------------------------------------------------------
  // Test 6: Verify Rejection of Invalid Edit
  // -------------------------------------------------------------
  console.log("\n--- Test 6: Reject Invalid Edit Updates ---");
  const invalidUpdate = await updateBrief(createdId, {
    budget_max_cents: 10000, // $100 < $4,000 min
  });
  assert(
    invalidUpdate.success === false,
    "Rejected invalid update where max budget is below min budget"
  );

  // -------------------------------------------------------------
  // Test 7: Error Recovery Simulation (Input Preservation)
  // -------------------------------------------------------------
  console.log("\n--- Test 7: Error Recovery State (Preserves User Input) ---");
  const failedInput = {
    ...newBriefInput,
    title: "AB", // Too short
  };
  const validationCheck = validateBriefInput(failedInput);
  assert(
    validationCheck.isValid === false && Boolean(validationCheck.errors.title),
    "Validation identifies error while entire failedInput payload remains accessible for form state restoration"
  );

  console.log("\n=================================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
