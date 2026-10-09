import { ShieldCheck, ShieldAlert, Clock, XCircle } from "lucide-react";
import type { VerificationStatus } from "@/types";

interface VerificationBadgeProps {
  status: VerificationStatus;
  isMock?: boolean;
  compact?: boolean;
}

export function VerificationBadge({
  status,
  isMock = false,
  compact = false,
}: VerificationBadgeProps) {
  switch (status) {
    case "verified":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-sm"
          title="Creator submitted workflow screencasts and deliverable receipts verified by platform moderation."
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {compact ? "Verified Evidence" : "Evidence Reviewed & Verified"}
            {isMock ? " (Sample Audit)" : ""}
          </span>
        </span>
      );

    case "pending":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-sky-950/60 border border-sky-500/40 text-sky-300 shadow-sm"
          title="Evidence submitted and currently under review. Claims are not yet verified."
        >
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>
            {compact ? "Verification Pending" : "Verification In Review (Pending)"}
          </span>
        </span>
      );

    case "rejected":
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-rose-950/60 border border-rose-500/40 text-rose-300 shadow-sm"
          title="Submitted evidence failed verification standards."
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Evidence Rejected</span>
        </span>
      );

    case "unverified":
    default:
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#1d1533] border border-[#3b2d66] text-[#c4b5fd] shadow-sm"
          title="All capabilities, tool listings, and turnaround metrics are self-reported by the creator and have not been independently verified."
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#9d7bf5]" />
          <span>
            {compact
              ? "Self-Declared"
              : "Self-Declared Claims • Not Independently Verified"}
          </span>
        </span>
      );
  }
}
