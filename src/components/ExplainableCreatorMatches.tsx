"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Clock,
  Layers,
  Wrench,
  Percent,
} from "lucide-react";
import type { CreatorMatchResult, BriefMatchingReport } from "@/lib/matching/creator-matcher";
import { VerificationBadge } from "@/components/VerificationBadge";

interface Props {
  report: BriefMatchingReport;
  briefTitle: string;
}

export function ExplainableCreatorMatches({ report, briefTitle }: Props) {
  const [expandedCreatorId, setExpandedCreatorId] = useState<string | null>(
    report.rankedCreators[0]?.creator.id || null
  );

  function toggleExpand(id: string) {
    setExpandedCreatorId(expandedCreatorId === id ? null : id);
  }

  function getTierBadge(tier: CreatorMatchResult["matchTier"], score: number) {
    switch (tier) {
      case "strong":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {score}% STRONG MATCH
          </span>
        );
      case "moderate":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-amber-950/80 border border-amber-500/40 text-amber-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            {score}% MODERATE MATCH
          </span>
        );
      case "weak":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-purple-950/80 border border-purple-500/40 text-purple-300">
            {score}% PARTIAL MATCH
          </span>
        );
      case "incompatible":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-rose-950/80 border border-rose-500/40 text-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            DISQUALIFIED (RIGHTS CONFLICT)
          </span>
        );
    }
  }

  return (
    <div className="mt-12 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#211938]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#c4b5fd] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#9d7bf5]" />
            EXPLAINABLE CREATOR MATCHING
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white tracking-tight">
            Matched AI Directors & Creators
          </h2>
          <p className="text-xs text-[#9b92b6] mt-1">
            Deterministic scoring based on verified portfolio evidence, toolchain overlap, format adaptability, and strict commercial licensing constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#140f26] border border-[#271f43] text-xs font-mono text-[#a79bc8]">
            {report.eligibleMatchesCount} of {report.totalCreatorsEvaluated} Eligible
          </span>
        </div>
      </div>

      {/* Empty State when 0 eligible matches */}
      {report.rankedCreators.length === 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-8 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Creators Found</h3>
          <p className="text-xs text-amber-200/90 max-w-xl mx-auto leading-relaxed">
            None of our verified creators currently meet all specific criteria for this campaign brief.
          </p>
          {report.emptyStateAdvice && (
            <div className="bg-[#120d24] border border-[#2d2150] rounded-xl p-4 max-w-lg mx-auto text-left space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#7e749e] font-bold block">
                SUGGESTED ADJUSTMENTS:
              </span>
              <ul className="text-xs text-[#c4b5fd] list-disc list-inside space-y-1">
                {report.emptyStateAdvice.map((advice, i) => (
                  <li key={i}>{advice}</li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9d7bf5] text-[#0b0914] font-bold text-xs hover:bg-[#b094fa] transition-all"
          >
            Browse All Creators Directory →
          </Link>
        </div>
      )}

      {/* Eligible Ranked Creators List */}
      <div className="space-y-5">
        {report.rankedCreators.map((match, idx) => {
          const isExpanded = expandedCreatorId === match.creator.id;
          const { creator, overallScore, breakdown, matchTier } = match;

          return (
            <div
              key={creator.id}
              className="rounded-2xl border border-[#271f43] bg-[#140f26] p-6 shadow-xl transition-all hover:border-[#3d2f66]"
            >
              {/* Creator Card Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Rank Number */}
                  <div className="w-8 h-8 rounded-full bg-[#1e1738] border border-[#3b2d61] text-[#c4b5fd] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#392b5e] bg-[#22183b] shrink-0">
                    {creator.profile.avatar_url ? (
                      <Image
                        src={creator.profile.avatar_url}
                        alt={creator.profile.display_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-white">
                        {creator.profile.display_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/creators/${creator.id}`}
                        className="text-base font-bold text-white hover:text-[#c4b5fd] transition-colors"
                      >
                        {creator.profile.display_name}
                      </Link>
                      <VerificationBadge status={creator.verification_status} />
                    </div>
                    <p className="text-xs text-[#8c82ab] font-mono">
                      @{creator.profile.handle} • Starting at ${creator.starting_rate_cents / 100}
                    </p>
                  </div>
                </div>

                {/* Score & Tier Badge */}
                <div className="flex items-center gap-3">
                  {getTierBadge(matchTier, overallScore)}

                  <button
                    type="button"
                    onClick={() => toggleExpand(creator.id)}
                    className="p-2 rounded-xl bg-[#1e1738] hover:bg-[#2b204e] text-[#c4b5fd] text-xs transition-colors flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <span className="text-[10px] font-mono uppercase">Hide Details</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] font-mono uppercase">Score Breakdown</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tagline */}
              {creator.tagline && (
                <p className="mt-3 text-xs text-[#b8afd1] leading-relaxed">
                  "{creator.tagline}"
                </p>
              )}

              {/* Commercial Rights Banner */}
              <div className="mt-4 p-3 rounded-xl bg-[#0c0917] border border-[#241c3d] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`w-4 h-4 shrink-0 ${
                      match.commercialRightsStatus === "compatible"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  />
                  <span className="text-[#d8cff5]">
                    <strong className="text-white">Commercial Rights: </strong>
                    {match.commercialRightsReason}
                  </span>
                </div>

                {match.commercialRightsStatus === "requires_confirmation" && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 shrink-0">
                    Confirmation Required
                  </span>
                )}
              </div>

              {/* Matched & Missing Criteria Summary */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Criteria */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider block">
                    ✓ MATCHED CRITERIA ({match.matchedCriteria.length})
                  </span>
                  <div className="space-y-1">
                    {match.matchedCriteria.map((item, i) => (
                      <div
                        key={i}
                        className="text-xs text-[#a3e4bc] bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-lg flex items-start gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Criteria */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider block">
                    ! MISSING / ADAPTABLE CRITERIA ({match.missingCriteria.length})
                  </span>
                  <div className="space-y-1">
                    {match.missingCriteria.length === 0 ? (
                      <p className="text-xs text-[#7e749e] italic px-2 py-1">
                        Zero gaps — fully qualified across all specifications.
                      </p>
                    ) : (
                      match.missingCriteria.map((item, i) => (
                        <div
                          key={i}
                          className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-900/30 px-2.5 py-1 rounded-lg flex items-start gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Granular Score Breakdown */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-[#251d3d] space-y-4 animate-in fade-in">
                  <h4 className="text-xs font-mono font-bold uppercase text-[#c4b5fd] tracking-wider">
                    DETERMINISTIC SCORING BREAKDOWN (100 PTS MAX)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {/* Content Type */}
                    <div className="p-3 rounded-xl bg-[#0b0914] border border-[#271f43]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#7e749e] uppercase mb-1">
                        <span>Content Type</span>
                        <span className="text-white font-bold">
                          {breakdown.contentType.score}/{breakdown.contentType.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-[#1e1736] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#9d7bf5] h-full rounded-full"
                          style={{
                            width: `${(breakdown.contentType.score / breakdown.contentType.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-[#9b92b6] leading-tight">
                        {breakdown.contentType.matched ? "Verified evidence" : "Spec only / Gaps"}
                      </p>
                    </div>

                    {/* AI Tools */}
                    <div className="p-3 rounded-xl bg-[#0b0914] border border-[#271f43]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#7e749e] uppercase mb-1">
                        <span>AI Tools</span>
                        <span className="text-white font-bold">
                          {breakdown.tools.score}/{breakdown.tools.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-[#1e1736] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#9d7bf5] h-full rounded-full"
                          style={{
                            width: `${(breakdown.tools.score / breakdown.tools.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-[#9b92b6] leading-tight">
                        {breakdown.tools.overlapPercentage}% overlap
                      </p>
                    </div>

                    {/* Specialization */}
                    <div className="p-3 rounded-xl bg-[#0b0914] border border-[#271f43]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#7e749e] uppercase mb-1">
                        <span>Specialization</span>
                        <span className="text-white font-bold">
                          {breakdown.specialization.score}/{breakdown.specialization.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-[#1e1736] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#9d7bf5] h-full rounded-full"
                          style={{
                            width: `${(breakdown.specialization.score / breakdown.specialization.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-[#9b92b6] leading-tight">
                        {breakdown.specialization.matchedSpecializations.length} domains aligned
                      </p>
                    </div>

                    {/* Format Compatibility */}
                    <div className="p-3 rounded-xl bg-[#0b0914] border border-[#271f43]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#7e749e] uppercase mb-1">
                        <span>Format / Ratio</span>
                        <span className="text-white font-bold">
                          {breakdown.format.score}/{breakdown.format.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-[#1e1736] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#9d7bf5] h-full rounded-full"
                          style={{
                            width: `${(breakdown.format.score / breakdown.format.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-[#9b92b6] leading-tight">
                        {breakdown.format.matchedRatio ? "Direct ratio match" : "Adaptable formats"}
                      </p>
                    </div>

                    {/* Budget & Availability */}
                    <div className="p-3 rounded-xl bg-[#0b0914] border border-[#271f43]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#7e749e] uppercase mb-1">
                        <span>Budget & Status</span>
                        <span className="text-white font-bold">
                          {breakdown.budgetAndAvailability.score}/
                          {breakdown.budgetAndAvailability.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-[#1e1736] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#9d7bf5] h-full rounded-full"
                          style={{
                            width: `${(breakdown.budgetAndAvailability.score / breakdown.budgetAndAvailability.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-[#9b92b6] leading-tight">
                        {breakdown.budgetAndAvailability.withinBudget ? "In budget" : "Exceeds"} •{" "}
                        {breakdown.budgetAndAvailability.isAvailable ? "Available" : "Busy"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-[#201838] flex items-center justify-between">
                <span className="text-[11px] text-[#7e749e] font-mono">
                  {creator.portfolio_items.length} Portfolio Work(s) Available
                </span>

                <Link
                  href={`/creators/${creator.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c4b5fd] hover:text-white transition-colors"
                >
                  View Full Creator Profile & Portfolio
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disqualified Creators Section (Licensing Conflict) */}
      {report.disqualifiedCreators.length > 0 && (
        <div className="mt-10 rounded-2xl border border-rose-950/60 bg-rose-950/10 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase">
            <XCircle className="w-4 h-4 text-rose-400" />
            DISQUALIFIED FROM ELIGIBILITY (LICENSING CONFLICT)
          </div>
          <p className="text-xs text-rose-200/80 leading-relaxed">
            Per Prismora's rights safety policy, the following creators possess relevant technical skills but cannot be ranked as eligible because their published commercial terms explicitly conflict with this brief's required rights.
          </p>

          <div className="space-y-3">
            {report.disqualifiedCreators.map((dq) => (
              <div
                key={dq.creator.id}
                className="p-4 rounded-xl bg-[#140f26] border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/creators/${dq.creator.id}`}
                      className="font-bold text-white hover:text-rose-300 transition-colors"
                    >
                      {dq.creator.profile.display_name}
                    </Link>
                    <span className="text-[10px] font-mono text-[#7e749e]">
                      (@{dq.creator.profile.handle})
                    </span>
                  </div>
                  <p className="text-rose-300/90 text-xs mt-1">
                    {dq.commercialRightsReason}
                  </p>
                </div>

                <Link
                  href={`/creators/${dq.creator.id}`}
                  className="text-xs text-[#a79bc8] hover:text-white font-mono shrink-0"
                >
                  Inspect Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
