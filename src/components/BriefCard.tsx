import Link from "next/link";
import {
  Calendar,
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
      return <FileCode className="w-3.5 h-3.5 text-[#9d7bf5]" />;
  }
}

function getStatusBadge(status: BriefStatus) {
  switch (status) {
    case "open":
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono tracking-wider uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
          Open
        </span>
      );
    case "in_review":
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono tracking-wider uppercase bg-amber-950/60 border border-amber-500/40 text-amber-300">
          In Review
        </span>
      );
    case "draft":
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono tracking-wider uppercase bg-[#1e1736] border border-[#36295c] text-[#8e84b0]">
          Draft
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono tracking-wider uppercase bg-[#1e1736] text-[#8e84b0]">
          {status}
        </span>
      );
  }
}

export function BriefCard({ brief }: BriefCardProps) {
  return (
    <div className="rounded-2xl border border-[#261e40] bg-[#140f26] p-5 flex flex-col justify-between hover:border-[#473775] transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/40">
      <div>
        {/* Header: Company & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-[#8e84b0] truncate">
            {brief.company_name}
          </span>
          {getStatusBadge(brief.status)}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-white tracking-tight line-clamp-2 group-hover:text-[#c4b5fd] transition-colors">
          <Link href={`/briefs/${brief.id}`} className="hover:underline">
            {brief.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-[#9b92b6] line-clamp-2 leading-relaxed">
          {brief.description}
        </p>

        {/* Deliverables Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-[#1d1633] border border-[#312554] text-[#c4b5fd] uppercase">
            {getContentTypeIcon(brief.target_content_type)}
            {brief.target_content_type}
          </span>

          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-[#1d1633] border border-[#312554] text-[#9b92b6]">
            {brief.preferred_aspect_ratio}
          </span>

          {brief.preferred_style && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-[#1d1633] border border-[#312554] text-[#9b92b6] truncate max-w-[140px]">
              {brief.preferred_style}
            </span>
          )}
        </div>

        {/* Commercial Use Shield */}
        <div className="mt-3.5 pt-3 border-t border-[#201938] flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#c4b5fd]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9d7bf5]" />
            {brief.commercial_use_requirements.replace(/_/g, " ").toUpperCase()}
          </span>

          {brief.deadline && (
            <span className="text-[10px] font-mono text-[#6e658f] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(brief.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Budget & CTA Buttons */}
      <div className="mt-4 pt-3.5 border-t border-[#201938] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#7e749e] uppercase block leading-none">
            BUDGET RANGE
          </span>
          <span className="text-xs font-bold text-white mt-1 block">
            {formatCurrency(brief.budget_min_cents, brief.currency)} –{" "}
            {formatCurrency(brief.budget_max_cents, brief.currency)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/briefs/${brief.id}/edit`}
            className="p-1.5 rounded-lg border border-[#302454] bg-[#1a1333] hover:bg-[#251b47] text-[#8e84b0] hover:text-white transition-colors"
            title="Edit Brief"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/briefs/${brief.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-sm"
          >
            View Brief
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
