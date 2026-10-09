import Link from "next/link";
import {
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Film,
  Image as ImageIcon,
  Box,
  FileCode,
  Edit3,
} from "lucide-react";
import type { BrandBriefWithBrand, ContentType, BriefStatus } from "@/types";

interface BriefCardProps {
  brief: BrandBriefWithBrand;
}

function formatCurrency(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function getContentTypeIcon(type: ContentType) {
  switch (type) {
    case "video":
      return <Film className="w-3.5 h-3.5 text-rose-400" />;
    case "image":
      return <ImageIcon className="w-3.5 h-3.5 text-sky-400" />;
    case "3d":
      return <Box className="w-3.5 h-3.5 text-amber-400" />;
    default:
      return <FileCode className="w-3.5 h-3.5 text-violet-400" />;
  }
}

function getStatusBadge(status: BriefStatus) {
  switch (status) {
    case "open":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
          Open for Proposals
        </span>
      );
    case "in_review":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-amber-950/40 border border-amber-800/40 text-amber-400">
          In Review
        </span>
      );
    case "draft":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-800 border border-zinc-700 text-zinc-400">
          Draft
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-300">
          {status}
        </span>
      );
  }
}

export function BriefCard({ brief }: BriefCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
      <div>
        {/* Top Badges & Company */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-semibold text-violet-400 tracking-wide">
            {brief.company_name}
          </span>
          {getStatusBadge(brief.status)}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-white leading-snug">
          {brief.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {brief.description}
        </p>

        {/* Campaign Requirements Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/90 text-[11px] text-zinc-300 border border-zinc-700/60">
            {getContentTypeIcon(brief.target_content_type)}
            <span className="capitalize">{brief.target_content_type}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/90 font-mono text-[11px] text-zinc-300 border border-zinc-700/60">
            {brief.preferred_aspect_ratio}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 text-[11px] text-emerald-300 border border-emerald-800/40">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="capitalize">{brief.commercial_use_requirements.replace(/_/g, " ")}</span>
          </span>
        </div>

        {/* Desired Style */}
        {brief.preferred_style && (
          <div className="mt-3 text-xs text-zinc-400">
            <span className="text-zinc-500 font-medium">Style: </span>
            <span className="text-zinc-300 italic">{brief.preferred_style}</span>
          </div>
        )}
      </div>

      {/* Footer: Budget & Actions */}
      <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
            Budget Range
          </span>
          <span className="text-sm font-bold text-white">
            {formatCurrency(brief.budget_min_cents, brief.currency)} –{" "}
            {formatCurrency(brief.budget_max_cents, brief.currency)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/briefs/${brief.id}/edit`}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Edit Brief"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/briefs/${brief.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
          >
            View Brief
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
