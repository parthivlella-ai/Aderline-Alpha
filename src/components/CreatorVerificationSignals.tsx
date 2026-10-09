import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  XCircle,
  FileCheck,
  Video,
  FileText,
  AlertTriangle,
  ExternalLink,
  Layers,
  Wrench,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import type { CreatorWithDetails, CreatorVerificationRow } from "@/types";
import { VerificationBadge } from "@/components/VerificationBadge";

interface CreatorVerificationSignalsProps {
  creator: CreatorWithDetails;
  isMock?: boolean;
}

// Map evidence types to human-readable names and icons
function getEvidenceTypeMeta(type: string) {
  switch (type) {
    case "workflow_screen_recording":
      return {
        label: "Workflow Screen Recording",
        icon: Video,
        description: "Uncut video screencast demonstrating live generative execution and terminal output.",
      };
    case "node_graph_snapshot":
      return {
        label: "ComfyUI Node Graph",
        icon: Layers,
        description: "Exported workflow JSON and node graph snapshot with custom LoRA hashes.",
      };
    case "past_work_client_delivery":
    case "project_source_delivery":
      return {
        label: "Client Master Delivery Receipt",
        icon: FileCheck,
        description: "Commercial master deliverable checksums and client delivery verification signoff.",
      };
    default:
      return {
        label: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: FileText,
        description: "Self-submitted portfolio documentation.",
      };
  }
}

export function CreatorVerificationSignals({
  creator,
  isMock = false,
}: CreatorVerificationSignalsProps) {
  const verifications = creator.verifications || [];
  const hasEvidence = verifications.length > 0;

  // Filter evidence by status
  const verifiedEvidence = verifications.filter((v) => v.status === "verified");
  const pendingEvidence = verifications.filter((v) => v.status === "pending");
  const unverifiedEvidence = verifications.filter((v) => v.status === "unverified");

  // Determine tool verification coverage
  const verifiedNotesLower = verifiedEvidence
    .map((v) => (v.notes || "").toLowerCase())
    .join(" ");

  return (
    <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-6 space-y-6 shadow-xl shadow-black/40">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#211938]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-widest text-[#8c82ab] uppercase font-semibold">
              TRUST & VERIFICATION AUDIT
            </span>
            <VerificationBadge status={creator.verification_status} isMock={isMock} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Evidence Signals & Capability Audit
          </h2>
          <p className="text-xs text-[#9b92b6] mt-1 max-w-2xl leading-relaxed">
            Prismora distinguishes between <span className="text-[#c4b5fd] font-medium">self-declared claims</span> and <span className="text-emerald-300 font-medium">independently reviewed evidence</span>. Review what this creator has submitted below before commissioning.
          </p>
        </div>
      </div>

      {/* 3-Dimensional Verification Signal Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Tools & Models Verification */}
        <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase font-semibold text-[#8c82ab] mb-2">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#9d7bf5]" />
                Tools & Models
              </span>
              {verifiedEvidence.length > 0 ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              ) : pendingEvidence.length > 0 ? (
                <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  In Review
                </span>
              ) : (
                <span className="text-[10px] text-[#8c82ab] font-mono">
                  Self-Declared
                </span>
              )}
            </div>

            <p className="text-xs text-white font-medium mb-3">
              Primary AI Tool Stack ({creator.primary_ai_tools.length})
            </p>

            {/* Individual Tool Signal Tags */}
            <div className="space-y-1.5">
              {creator.primary_ai_tools.map((tool) => {
                const isToolVerified =
                  verifiedNotesLower.includes(tool.toLowerCase()) ||
                  verifiedNotesLower.includes(tool.replace(/_/g, " "));

                return (
                  <div
                    key={tool}
                    className="flex items-center justify-between px-2.5 py-1 rounded-md bg-[#161028] border border-[#2d224d] text-xs"
                  >
                    <span className="font-mono text-[11px] text-[#e0d9f7]">
                      {tool.replace(/_/g, " ")}
                    </span>
                    {isToolVerified ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                        Evidence Verified
                      </span>
                    ) : pendingEvidence.length > 0 ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-500/40 text-sky-300">
                        Pending Review
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#20183b] text-[#8c82ab]">
                        Self-Declared
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Workflow Pipeline Verification */}
        <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase font-semibold text-[#8c82ab] mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#9d7bf5]" />
                Workflow Pipeline
              </span>
              {verifiedEvidence.some((v) => v.evidence_type.includes("workflow")) ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Screencast Verified
                </span>
              ) : pendingEvidence.some((v) => v.evidence_type.includes("graph")) ? (
                <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Graph Submitted
                </span>
              ) : (
                <span className="text-[10px] text-[#8c82ab] font-mono">
                  Self-Reported
                </span>
              )}
            </div>

            <p className="text-xs text-white font-medium mb-1.5">
              Pipeline Provenance Status
            </p>

            <div className="text-[11px] text-[#a59cb8] leading-relaxed p-2.5 rounded-lg bg-[#161028] border border-[#2d224d]">
              {verifiedEvidence.some((v) => v.evidence_type.includes("workflow")) ? (
                <div className="space-y-1">
                  <span className="text-emerald-300 font-semibold block">
                    ✓ Screencast Proof On Record
                  </span>
                  <span>Uncut video evidence confirms creator operates local node execution without outsourced prompt farms.</span>
                </div>
              ) : pendingEvidence.length > 0 ? (
                <div className="space-y-1">
                  <span className="text-sky-300 font-semibold block">
                    ⏳ Pipeline Under Review
                  </span>
                  <span>Workflow schema uploaded. Verification pending moderator signoff.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[#8c82ab] font-semibold block">
                    ⚠️ Self-Reported Narrative
                  </span>
                  <span>Creator has written their pipeline description, but no video screencast or node graph has been verified.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Past-Work Commercial Evidence */}
        <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase font-semibold text-[#8c82ab] mb-2">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#9d7bf5]" />
                Past-Work Evidence
              </span>
              {verifiedEvidence.some((v) => v.evidence_type.includes("delivery")) ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Delivery Verified
                </span>
              ) : (
                <span className="text-[10px] text-[#8c82ab] font-mono">
                  Showcase Uploads
                </span>
              )}
            </div>

            <p className="text-xs text-white font-medium mb-1.5">
              Portfolio Attribution
            </p>

            <div className="text-[11px] text-[#a59cb8] leading-relaxed p-2.5 rounded-lg bg-[#161028] border border-[#2d224d]">
              {verifiedEvidence.some((v) => v.evidence_type.includes("delivery")) ? (
                <div className="space-y-1">
                  <span className="text-emerald-300 font-semibold block">
                    ✓ Commercial Delivery Proven
                  </span>
                  <span>Original ProRes masters and client purchase orders verified on record.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[#8c82ab] font-semibold block">
                    Portfolio Self-Uploads
                  </span>
                  <span>Assets are uploaded by creator. Request milestone escrow or raw seed logs before contract execution.</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Submitted Evidence Records Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#8c82ab] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#9d7bf5]" />
            Evidence Items On Record ({verifications.length})
          </h3>
          <span className="text-[10px] text-[#6b628a] font-mono">
            {isMock ? "Demonstration Audit Records" : "Immutable Platform Ledger"}
          </span>
        </div>

        {hasEvidence ? (
          <div className="space-y-2.5">
            {verifications.map((evidence) => {
              const meta = getEvidenceTypeMeta(evidence.evidence_type);
              const Icon = meta.icon;

              return (
                <div
                  key={evidence.id}
                  className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1b1433] border border-[#36295c] flex items-center justify-center text-[#9d7bf5] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {meta.label}
                        </span>
                        <VerificationBadge status={evidence.status} compact />
                      </div>

                      {evidence.notes && (
                        <p className="text-xs text-[#a59cb8] mt-1 leading-relaxed">
                          <span className="font-semibold text-[#c4b5fd]">Coverage: </span>
                          {evidence.notes}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#6e658f]">
                        {evidence.reviewed_at && (
                          <span>
                            Reviewed: {new Date(evidence.reviewed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                        {evidence.created_at && (
                          <span>
                            Submitted: {new Date(evidence.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                        <span className="text-[#8c82ab]">
                          Evidence ID: {evidence.id.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Link to Evidence URL */}
                  {evidence.evidence_url && (
                    <a
                      href={evidence.evidence_url}
                      target="_blank"
                      rel="noreferrer"
                      className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2e234e] bg-[#161028] hover:bg-[#20183b] text-[#c4b5fd] text-[11px] font-mono transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3 h-3 text-[#9d7bf5]" />
                      Inspect Proof
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Missing Evidence Callout */
          <div className="p-5 rounded-xl border border-dashed border-[#342757] bg-[#0e0a1b] text-left">
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#f59e0b] mb-1">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
              Missing Verification Evidence On Record
            </div>
            <p className="text-xs text-[#8c82ab] leading-relaxed max-w-2xl">
              This creator has not submitted live screencasts, node pipelines, or commercial delivery receipts. All listed AI tools, hardware specifications, and turnaround commitments are <span className="text-white font-medium">self-declared claims</span>. We recommend requesting video proof or utilizing milestone escrow before project kick-off.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
