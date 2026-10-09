/**
 * Prismora Creator Verification Signals Test Suite
 *
 * Verifies the 4 mandatory verification states:
 * 1. Verified Evidence Case
 * 2. Pending Evidence Case
 * 3. Unverified / Self-Declared Case
 * 4. Missing-Evidence Case
 *
 * Ensures truthful distinction between self-reported claims and reviewed evidence,
 * verifying that no fabricated third-party certifications occur.
 */

import { getCreators, getCreatorById } from "../src/lib/services/creators";
import type { CreatorWithDetails } from "../src/types";

async function runVerificationTests() {
  console.log("=================================================");
  console.log("   PRISMORA CREATOR VERIFICATION TEST SUITE     ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}${details ? ` -> ${details}` : ""}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
      failed++;
    }
  }

  const { data: creators } = await getCreators();

  // =========================================================================
  // CASE 1: Verified Evidence Case (Elena Rostova / Aetheris Studios)
  // =========================================================================
  console.log("--- Case 1: Verified Evidence Case ---");
  const verifiedCreator = creators.find((c) => c.profile.handle === "aetheris");

  assert(Boolean(verifiedCreator), "Verified creator exists in catalog");
  if (verifiedCreator) {
    assert(
      verifiedCreator.verification_status === "verified",
      "Creator status is strictly 'verified'",
      verifiedCreator.verification_status
    );

    const evidenceList = verifiedCreator.verifications || [];
    assert(
      evidenceList.length >= 2,
      `Contains multiple verified evidence records (Found: ${evidenceList.length})`
    );

    const hasWorkflowScreencast = evidenceList.some(
      (v) => v.evidence_type === "workflow_screen_recording" && v.status === "verified"
    );
    assert(
      hasWorkflowScreencast,
      "Includes verified workflow screencast evidence",
      "workflow_screen_recording status = verified"
    );

    const hasClientDelivery = evidenceList.some(
      (v) => v.evidence_type === "past_work_client_delivery" && v.status === "verified"
    );
    assert(
      hasClientDelivery,
      "Includes verified past-work client delivery master checksums",
      "past_work_client_delivery status = verified"
    );

    // Verify evidence coverage & review metadata
    const screencastEvidence = evidenceList.find((v) => v.evidence_type === "workflow_screen_recording");
    assert(
      Boolean(screencastEvidence?.notes && screencastEvidence?.reviewed_at && screencastEvidence?.evidence_url),
      "Verified evidence includes coverage description, reviewer timestamp, and proof URL",
      screencastEvidence?.notes?.slice(0, 60) + "..."
    );

    // Assert tools covered by evidence
    const notesLower = evidenceList.map((v) => v.notes?.toLowerCase() || "").join(" ");
    const coversComfyUi = notesLower.includes("comfyui");
    const coversFlux = notesLower.includes("flux");
    assert(
      coversComfyUi && coversFlux,
      "Evidence notes detail specific tools verified (ComfyUI & FLUX.1)",
      "FLUX.1 and ComfyUI covered"
    );
  }

  // =========================================================================
  // CASE 2: Pending Evidence Case (Maya Chen / SynthCraft Studio)
  // =========================================================================
  console.log("\n--- Case 2: Pending Evidence Case ---");
  const pendingCreator = creators.find((c) => c.profile.handle === "synthcraft");

  assert(Boolean(pendingCreator), "Pending creator exists in catalog");
  if (pendingCreator) {
    assert(
      pendingCreator.verification_status === "pending",
      "Creator status is strictly 'pending'",
      pendingCreator.verification_status
    );

    const evidenceList = pendingCreator.verifications || [];
    assert(
      evidenceList.length >= 1,
      `Pending evidence record is attached (Found: ${evidenceList.length})`
    );

    const pendingItem = evidenceList.find((v) => v.status === "pending");
    assert(Boolean(pendingItem), "Evidence record has status = 'pending'");
    assert(
      pendingItem?.evidence_type === "node_graph_snapshot",
      "Evidence type specifies 'node_graph_snapshot'",
      pendingItem?.evidence_type
    );

    // Ensure it does NOT claim verified status
    assert(
      pendingItem?.reviewed_at === null || pendingItem?.reviewed_at === undefined,
      "Evidence is NOT falsely marked reviewed (reviewed_at is null)"
    );
    assert(
      pendingCreator.verification_status !== "verified",
      "Pending creator is NOT falsely labeled verified"
    );
  }

  // =========================================================================
  // CASE 3: Unverified / Self-Declared Case (Leo Tanaka / VoxelSurge FX)
  // =========================================================================
  console.log("\n--- Case 3: Unverified / Self-Declared Case ---");
  const unverifiedCreator = creators.find((c) => c.profile.handle === "voxelsurge");

  assert(Boolean(unverifiedCreator), "Unverified creator exists in catalog");
  if (unverifiedCreator) {
    assert(
      unverifiedCreator.verification_status === "unverified",
      "Creator status is strictly 'unverified'",
      unverifiedCreator.verification_status
    );

    const evidenceList = unverifiedCreator.verifications || [];
    const hasAnyVerified = evidenceList.some((v) => v.status === "verified");
    assert(
      !hasAnyVerified,
      "No verified evidence records exist for unverified creator"
    );

    // Ensure evidence clearly states self-declared submission
    const selfDeclaredItem = evidenceList.find((v) => v.status === "unverified");
    if (selfDeclaredItem) {
      assert(
        selfDeclaredItem.evidence_type === "self_declared_submission",
        "Submission explicitly marked as 'self_declared_submission'"
      );
    }
  }

  // =========================================================================
  // CASE 4: Missing-Evidence Case (Marcus Finch / Finch Sound Design)
  // =========================================================================
  console.log("\n--- Case 4: Missing-Evidence Case ---");
  const missingEvidenceCreator = creators.find((c) => c.profile.handle === "finch_sound");

  assert(Boolean(missingEvidenceCreator), "Missing-evidence creator exists in catalog");
  if (missingEvidenceCreator) {
    const evidenceList = missingEvidenceCreator.verifications || [];
    assert(
      evidenceList.length === 0,
      `Verifications array is strictly empty (Length: ${evidenceList.length})`
    );

    assert(
      missingEvidenceCreator.verification_status === "unverified",
      "Status correctly defaults to 'unverified' when evidence is missing",
      missingEvidenceCreator.verification_status
    );

    // Test that detail lookup also returns empty verifications safely
    const { data: detailData } = await getCreatorById(missingEvidenceCreator.id);
    assert(
      Boolean(detailData),
      "Detail lookup resolves missing-evidence creator without throwing"
    );
    assert(
      (detailData?.verifications || []).length === 0,
      "Detail verifications safely handles empty array without undefined crash"
    );
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log("\n=================================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerificationTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
