import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { VerificationStatus } from "@/types";

interface VerificationBadgeProps {
  status: VerificationStatus;
  isMock?: boolean;
}

export function VerificationBadge({ status, isMock = true }: VerificationBadgeProps) {
  // If demo mock data or unverified, explicitly label as self-reported / not independently verified
  if (isMock || status !== "verified") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/40 border border-amber-800/40 text-amber-300">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        Sample Profile • Self-Reported (Not Independently Verified)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      Verified AI Creator
    </span>
  );
}
