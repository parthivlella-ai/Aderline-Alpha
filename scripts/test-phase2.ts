/**
 * Automated Verification Script for Prismora Phase 02 Acceptance Tests
 */

import { getCreators, getCreatorById } from "../src/lib/services/creators";

async function runTests() {
  console.log("=================================================");
  console.log("   PRISMORA PHASE 02: ACCEPTANCE TEST SUITE      ");
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

  // Test 1: Fetch Creators Directory
  console.log("--- Test 1: Fetch Creators Directory ---");
  const { data: creators, isMock } = await getCreators();
  assert(
    Array.isArray(creators) && creators.length >= 3,
    `Creators listing returns array with count >= 3 (Found: ${creators.length})`
  );
  assert(
    isMock === true,
    "Correctly identifies mock demonstration data when Supabase is not connected"
  );

  // Test 2: Verify Creator Fields (Elena Rostova / Aetheris)
  console.log("\n--- Test 2: Verify Creator Profile Fields ---");
  const elena = creators.find((c) => c.profile.handle === "aetheris")!;
  assert(Boolean(elena), "Elena Rostova (aetheris) is present in directory");
  assert(
    elena.profile.full_name === "Elena Rostova",
    `Name matches: ${elena.profile.full_name}`
  );
  assert(Boolean(elena.profile.bio), "Bio is present");
  assert(
    elena.specializations.includes("cinematic_video"),
    "Specialization includes 'cinematic_video'"
  );
  assert(
    elena.primary_ai_tools.includes("runway_gen3"),
    "Primary tools include 'runway_gen3'"
  );
  assert(
    Boolean(elena.custom_workflow_summary),
    "Custom workflow summary is present"
  );
  assert(Boolean(elena.hardware_specs), "Hardware specs are present");
  assert(Boolean(elena.commercial_terms), "Commercial terms are present");
  assert(
    elena.starting_rate_cents === 120000,
    `Starting rate is $1,200 (Found: $${elena.starting_rate_cents / 100})`
  );

  // Test 3: Multiple Portfolio Items Associated with Creator
  console.log("\n--- Test 3: Associated Portfolio Items ---");
  assert(
    elena.portfolio_items.length === 3,
    `Elena has 3 associated portfolio items (Found: ${elena.portfolio_items.length})`
  );

  const videoItem = elena.portfolio_items.find((p) => p.content_type === "video")!;
  assert(Boolean(videoItem), "Portfolio includes video item");
  assert(
    Boolean(videoItem.media_url),
    `Video item media URL present: ${videoItem.media_url}`
  );
  assert(videoItem.aspect_ratio === "16:9", "Aspect ratio is 16:9");
  assert(
    videoItem.ai_tools_used.includes("runway_gen3"),
    "AI tools used includes Runway Gen-3"
  );
  assert(
    Boolean(videoItem.workflow_breakdown),
    "Workflow breakdown is present on item"
  );
  assert(
    videoItem.commercial_rights_granted === "full_buyout",
    "Commercial rights granted: full_buyout"
  );
  assert(
    videoItem.generation_parameters !== null &&
      typeof videoItem.generation_parameters === "object" &&
      Object.keys(videoItem.generation_parameters).length > 0,
    "Generation parameters metadata present"
  );

  const imageItem = elena.portfolio_items.find((p) => p.content_type === "image")!;
  assert(Boolean(imageItem), "Portfolio includes graphic/image render");
  assert(imageItem.aspect_ratio === "21:9", "Image aspect ratio is 21:9");

  // Test 4: Detail Lookup Resolution
  console.log("\n--- Test 4: Detail Lookup Resolution ---");
  const byId = await getCreatorById(elena.id);
  assert(
    byId.data !== null && byId.data.id === elena.id,
    `Resolved creator by UUID: ${elena.id}`
  );

  const byHandle = await getCreatorById("aetheris");
  assert(
    byHandle.data !== null && byHandle.data.id === elena.id,
    "Resolved creator by handle: 'aetheris'"
  );

  // Test 5: Empty Portfolio State Handling
  console.log("\n--- Test 5: Empty Portfolio State Handling ---");
  const emptyCreator = creators.find((c) => c.profile.handle === "finch_sound")!;
  assert(
    Boolean(emptyCreator),
    "Found creator with 0 portfolio items (Marcus Finch)"
  );
  assert(
    emptyCreator.portfolio_items.length === 0,
    "Creator portfolio length is exactly 0 (empty state test)"
  );

  // Test 6: Missing / Invalid Creator ID Handling
  console.log("\n--- Test 6: Missing / Invalid Creator ID ---");
  const missingResult = await getCreatorById("non-existent-uuid-or-handle");
  assert(
    missingResult.data === null,
    "Invalid creator ID cleanly returns null for 404 routing"
  );

  // Test 7: Persistence Simulation (Re-fetching data)
  console.log("\n--- Test 7: Data Persistence After Reload ---");
  const reload1 = await getCreatorById(elena.id);
  const reload2 = await getCreatorById(elena.id);
  assert(
    reload1.data!.id === reload2.data!.id,
    "Data persistence verified: identical ID across reloads"
  );
  assert(
    reload1.data!.portfolio_items.length === reload2.data!.portfolio_items.length,
    "Portfolio consistency preserved across reloads"
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
