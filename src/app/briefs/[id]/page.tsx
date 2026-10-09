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
  Clock,
  Layers,
} from "lucide-react";
import { getBriefById } from "@/lib/services/briefs";
import { getCreators } from "@/lib/services/creators";
import { matchCreatorsForBrief } from "@/lib/matching/creator-matcher";
import { ExplainableCreatorMatches } from "@/components/ExplainableCreatorMatches";
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
      return <FileCode className="w-4 h-4 text-[#9d7bf5]" />;
  }
}

function getStatusBadge(status: BriefStatus) {
  switch (status) {
    case "open":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
          Open for Proposals
        </span>
      );
    case "in_review":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase bg-amber-950/60 border border-amber-500/40 text-amber-300">
          In Review
        </span>
      );
    case "draft":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase bg-[#1e1736] border border-[#36295c] text-[#8e84b0]">
          Draft
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider uppercase bg-[#1e1736] text-[#8e84b0]">
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

  const { data: creators } = await getCreators();
  const matchingReport = matchCreatorsForBrief(brief, creators || []);

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-5xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/briefs"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold text-[#8c82ab] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO CAMPAIGN BRIEFS
          </Link>

          <Link
            href={`/briefs/${brief.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#322557] bg-[#1a1333] hover:bg-[#251b47] text-xs font-medium text-[#c4b5fd] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#9d7bf5]" />
            Edit Brief
          </Link>
        </div>

        {/* Main Brief Card */}
        <div className="rounded-2xl border border-[#261e40] bg-[#140f26] p-6 md:p-8 shadow-2xl shadow-black/50">
          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#211938]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#c4b5fd] uppercase tracking-wider mb-2">
                <Building className="w-3.5 h-3.5 text-[#9d7bf5]" />
                {brief.company_name}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {brief.title}
              </h1>
              <p className="text-xs text-[#7e749e] mt-2 flex items-center gap-2 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Published on{" "}
                {new Date(brief.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              {getStatusBadge(brief.status)}
              <div className="mt-2 text-left md:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block">
                  APPROVED BUDGET
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
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9b92b6] flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-[#9d7bf5]" />
                CAMPAIGN OBJECTIVE & TARGET GOALS
              </h3>
              <p className="text-sm text-[#e0d9f7] leading-relaxed bg-[#0b0914] p-4 rounded-xl border border-[#221a38]">
                {brief.campaign_goals}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9b92b6] mb-2">
                DETAILED CREATIVE DESCRIPTION
              </h3>
              <p className="text-sm text-[#a8a0c7] leading-relaxed whitespace-pre-line bg-[#0b0914] p-4 rounded-xl border border-[#221a38]">
                {brief.description}
              </p>
            </div>
          </div>

          {/* Specifications Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#211938]">
            <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-1">
                CONTENT FORMAT & TYPE
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-white capitalize">
                {getContentTypeIcon(brief.target_content_type)}
                {brief.target_content_type}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-1">
                ASPECT RATIO
              </span>
              <div className="text-sm font-mono font-bold text-white">
                {brief.preferred_aspect_ratio}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-1">
                COMMERCIAL-USE LICENSE
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 font-mono capitalize">
                <ShieldCheck className="w-3.5 h-3.5" />
                {brief.commercial_use_requirements.replace(/_/g, " ")}
              </div>
            </div>
          </div>

          {/* Desired Style & AI Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {brief.preferred_style && (
              <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-1">
                  DESIRED VISUAL / AUDIO STYLE
                </span>
                <p className="text-xs text-[#c4b5fd] font-medium">
                  {brief.preferred_style}
                </p>
              </div>
            )}

            {brief.deadline && (
              <div className="p-4 rounded-xl border border-[#221a38] bg-[#0b0914]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-1">
                  SUBMISSION DEADLINE
                </span>
                <p className="text-xs text-white font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#7e749e]" />
                  {new Date(brief.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Required AI Tools */}
          {brief.required_ai_tools && brief.required_ai_tools.length > 0 && (
            <div className="mt-4 p-4 rounded-xl border border-[#221a38] bg-[#0b0914]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-2">
                DESIRED AI MODELS & TOOLCHAINS
              </span>
              <div className="flex flex-wrap gap-2">
                {brief.required_ai_tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-3 py-1 rounded-full bg-[#1b1433] border border-[#342759] text-[#c4b5fd] font-mono"
                  >
                    {tool.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Explainable Creator Matching Section */}
        <ExplainableCreatorMatches
          report={matchingReport}
          briefTitle={brief.title}
        />
      </div>
    </div>
  );
}
