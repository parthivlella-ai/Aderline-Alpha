/**
 * Automated Acceptance Test Suite for Prismora Phase 04: Creator Search & Filtering
 */

import { getCreators, getCreatorById, filterCreators } from "../src/lib/services/creators";

async function runTests() {
  console.log("=================================================");
  console.log("   PRISMORA PHASE 04: ACCEPTANCE TEST SUITE      ");
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

  // Retrieve base creators
  const { data: allCreators } = await getCreators();
  assert(
    allCreators.length >= 4,
    `Initial talent pool loaded successfully (Total: ${allCreators.length})`
  );

  // -------------------------------------------------------------
  // Test 1: Search Creators by Name & Relevant Keywords
  // -------------------------------------------------------------
  console.log("\n--- Test 1: Search Creators by Name & Keywords ---");

  // Search by exact name snippet
  const searchByName = filterCreators(allCreators, { query: "Elena" });
  assert(
    searchByName.length === 1 && searchByName[0].profile.handle === "aetheris",
    "Searching 'Elena' returns Elena Rostova (aetheris)"
  );

  // Search by handle
  const searchByHandle = filterCreators(allCreators, { query: "synthcraft" });
  assert(
    searchByHandle.length === 1 && searchByHandle[0].profile.handle === "synthcraft",
    "Searching handle 'synthcraft' returns Maya Chen"
  );

  // Search by bio keyword (e.g. 'cinematography' or 'architectural')
  const searchByBio = filterCreators(allCreators, { query: "kinetic" });
  assert(
    searchByBio.some((c) => c.profile.handle === "voxelsurge"),
    "Searching keyword 'kinetic' in tagline/workflow returns Leo Tanaka (voxelsurge)"
  );

  // Search by location
  const searchByLocation = filterCreators(allCreators, { query: "Tokyo" });
  assert(
    searchByLocation.length === 1 && searchByLocation[0].profile.handle === "voxelsurge",
    "Searching location 'Tokyo' returns Leo Tanaka"
  );

  // -------------------------------------------------------------
  // Test 2: Filter Creators by Specialization
  // -------------------------------------------------------------
  console.log("\n--- Test 2: Filter by Specialization ---");

  const filterByVideoSpec = filterCreators(allCreators, {
    specialization: "cinematic_video",
  });
  assert(
    filterByVideoSpec.length >= 1 &&
      filterByVideoSpec.every((c) => c.specializations.includes("cinematic_video")),
    "Specialization filter 'cinematic_video' only returns creators possessing that specialization"
  );

  const filterByCharacterSpec = filterCreators(allCreators, {
    specialization: "character_design",
  });
  assert(
    filterByCharacterSpec.length >= 1 &&
      filterByCharacterSpec.some((c) => c.profile.handle === "synthcraft"),
    "Specialization filter 'character_design' returns Maya Chen (synthcraft)"
  );

  // -------------------------------------------------------------
  // Test 3: Filter Creators by AI Tools / Models
  // -------------------------------------------------------------
  console.log("\n--- Test 3: Filter by AI Tools & Models ---");

  const filterByRunway = filterCreators(allCreators, { aiTool: "runway_gen3" });
  assert(
    filterByRunway.length >= 2,
    `AI tool filter 'runway_gen3' returns matching directors (Found: ${filterByRunway.length})`
  );
  assert(
    filterByRunway.every(
      (c) =>
        c.primary_ai_tools.includes("runway_gen3") ||
        c.portfolio_items.some((item) => item.ai_tools_used.includes("runway_gen3"))
    ),
    "All returned creators actively utilize Runway Gen-3 in stack or portfolio"
  );

  const filterByElevenLabs = filterCreators(allCreators, { aiTool: "eleven_labs" });
  assert(
    filterByElevenLabs.length === 1 &&
      filterByElevenLabs[0].profile.handle === "finch_sound",
    "AI tool filter 'eleven_labs' uniquely identifies Marcus Finch (finch_sound)"
  );

  // -------------------------------------------------------------
  // Test 4: Filter Creators by Portfolio Content Type
  // -------------------------------------------------------------
  console.log("\n--- Test 4: Filter by Portfolio Content Type ---");

  const filterByImageContent = filterCreators(allCreators, { contentType: "image" });
  assert(
    filterByImageContent.length >= 2,
    `Content type filter 'image' returns creators with still image portfolios (Found: ${filterByImageContent.length})`
  );
  assert(
    filterByImageContent.every((c) =>
      c.portfolio_items.some((item) => item.content_type === "image")
    ),
    "Every returned creator possesses at least 1 image portfolio showcase"
  );

  // Creator with 0 portfolio items (Marcus Finch) should NOT appear in video/image/3d content type filters
  assert(
    !filterByImageContent.some((c) => c.profile.handle === "finch_sound"),
    "Creator with empty portfolio (Marcus Finch) is correctly excluded from content type filters"
  );

  // -------------------------------------------------------------
  // Test 5: Multiple Filters Working Together (Compound Logic)
  // -------------------------------------------------------------
  console.log("\n--- Test 5: Compound Multi-Filters ---");

  // Filter: Tool = runway_gen3 AND Specialization = cinematic_video AND Content Type = video
  const compoundMatch = filterCreators(allCreators, {
    aiTool: "runway_gen3",
    specialization: "cinematic_video",
    contentType: "video",
  });
  assert(
    compoundMatch.length === 1 && compoundMatch[0].profile.handle === "aetheris",
    "Compound filter (Runway + Cinematic Video + Video Content) uniquely narrows to Elena Rostova"
  );

  // Filter: Tool = flux_1 AND Specialization = character_design
  const characterFluxMatch = filterCreators(allCreators, {
    aiTool: "flux_1",
    specialization: "character_design",
  });
  assert(
    characterFluxMatch.length === 1 &&
      characterFluxMatch[0].profile.handle === "synthcraft",
    "Compound filter (FLUX.1 + Character Design) returns Maya Chen"
  );

  // -------------------------------------------------------------
  // Test 6: Clearing Filters Restores the Full Result Set
  // -------------------------------------------------------------
  console.log("\n--- Test 6: Reset / Clear All Filters ---");

  const cleared = filterCreators(allCreators, {
    query: "",
    specialization: "all",
    aiTool: "all",
    contentType: "all",
    availabilityOnly: false,
  });
  assert(
    cleared.length === allCreators.length,
    `Clearing filters restores all original creators (Expected: ${allCreators.length}, Got: ${cleared.length})`
  );

  // -------------------------------------------------------------
  // Test 7: Nonexistent Query Displays Empty State (0 Results)
  // -------------------------------------------------------------
  console.log("\n--- Test 7: Nonexistent Query Empty State ---");

  const nonexistentQuery = filterCreators(allCreators, {
    query: "xyz-nonexistent-search-term-12345",
  });
  assert(
    nonexistentQuery.length === 0,
    "Nonexistent search query safely returns 0 results for empty state rendering"
  );

  const impossibleCompound = filterCreators(allCreators, {
    aiTool: "eleven_labs",
    contentType: "video", // ElevenLabs user has no video portfolio
  });
  assert(
    impossibleCompound.length === 0,
    "Conflicting compound filter (ElevenLabs + Video) returns 0 results"
  );

  // -------------------------------------------------------------
  // Test 8: Navigation Integrity to Creator Profiles
  // -------------------------------------------------------------
  console.log("\n--- Test 8: Result Navigation Integrity ---");

  for (const creator of allCreators) {
    const detailLookup = await getCreatorById(creator.id);
    assert(
      detailLookup.data !== null && detailLookup.data.id === creator.id,
      `Creator ${creator.profile.display_name} has valid resolvable profile route (/creators/${creator.id})`
    );
  }

  // -------------------------------------------------------------
  // Test 9: Safe Handling of Malformed / Partial Data
  // -------------------------------------------------------------
  console.log("\n--- Test 9: Safe Handling of Missing Fields ---");

  const malformedCreators: any[] = [
    {
      id: "malformed-1",
      profile: { display_name: "Test Missing Fields" }, // missing bio, location, handle
      specializations: null,
      primary_ai_tools: undefined,
      portfolio_items: null,
    },
    null,
    undefined,
  ];

  const safeResults = filterCreators(malformedCreators as any, { query: "Test" });
  assert(
    safeResults.length === 1,
    "Filter engine safely handles null, undefined, and missing attributes without throwing"
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
