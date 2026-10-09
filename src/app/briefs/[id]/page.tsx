import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit3,
  ShieldCheck,
  Film,
  Image as ImageIcon,
  Box,
  FileCode,
  Building,
  Target,
  Sparkles,
  Wrench,
  Clock,
  Layers,
} from "lucide-react";
import { getBriefById } from "@/lib/services/briefs";
import type { ContentType, BriefStatus } from "@/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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
      return <Film className="w-4 h-4 text-rose-400" />;
    case "image":
      return <ImageIcon className="w-4 h-4 text-sky-400" />;
    case "3d":
      return <Box className="w-4 h-4 text-amber-400" />;
    default:
      return <FileCode className="w-4 h-4 text-violet-400" />;
  }
}

function getStatusBadge(status: BriefStatus) {
  switch (status) {
    case "open":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
          Open for Proposals
        </span>
      );
    case "in_review":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-950/40 border border-amber-800/40 text-amber-400">
          In Review
        </span>
      );
    case "draft":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-zinc-800 border border-zinc-700 text-zinc-400">
          Draft
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-300">
          {status}
        </span>
      );
  }
}

export default async function BriefDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: brief } = await getBriefById(id);

  if (!brief) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/briefs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Campaign Briefs
        </Link>

        <Link
          href={`/briefs/${brief.id}/edit`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5 text-violet-400" />
          Edit Brief
        </Link>
      </div>

      {/* Main Brief Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
              <Building className="w-3.5 h-3.5" />
              {brief.company_name}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {brief.title}
            </h1>
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Published on {new Date(brief.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            {getStatusBadge(brief.status)}
            <div className="mt-2 text-right">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                Approved Budget
              </span>
              <span className="text-xl font-extrabold text-white">
                {formatCurrency(brief.budget_min_cents, brief.currency)} –{" "}
                {formatCurrency(brief.budget_max_cents, brief.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Objective & Requirements */}
        <div className="py-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-2">
              <Target className="w-3.5 h-3.5 text-violet-400" />
              Campaign Objective & Target Goals
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
              {brief.campaign_goals}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Detailed Creative Description
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {brief.description}
            </p>
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
              Content Format & Type
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-white capitalize">
              {getContentTypeIcon(brief.target_content_type)}
              {brief.target_content_type}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
              Aspect Ratio
            </span>
            <div className="text-sm font-mono font-bold text-white">
              {brief.preferred_aspect_ratio}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
              Commercial-Use License
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 capitalize">
              <ShieldCheck className="w-3.5 h-3.5" />
              {brief.commercial_use_requirements.replace(/_/g, " ")}
            </div>
          </div>
        </div>

        {/* Desired Style & AI Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {brief.preferred_style && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Desired Visual / Audio Style
              </span>
              <p className="text-xs text-zinc-300 italic">
                "{brief.preferred_style}"
              </p>
            </div>
          )}

          {brief.deadline && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Target Delivery Deadline
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {new Date(brief.deadline).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recommended AI Tools */}
        {brief.required_ai_tools && brief.required_ai_tools.length > 0 && (
          <div className="mt-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
              Recommended AI Tool Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {brief.required_ai_tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded bg-zinc-800 text-xs text-zinc-300 border border-zinc-700/60"
                >
                  {tool.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Commissioner Attribution */}
      <div className="mt-8 p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
            Commissioned by
          </span>
          <div className="text-sm font-semibold text-white mt-0.5">
            {brief.brand.display_name}
          </div>
          <p className="text-xs text-zinc-400">
            @{brief.brand.handle} • {brief.brand.location || "Remote"}
          </p>
        </div>

        <div>
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-colors"
          >
            Submit Proposal
          </Link>
        </div>
      </div>
    </div>
  );
}
