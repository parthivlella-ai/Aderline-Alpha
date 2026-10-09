import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Wrench,
  Layers,
  Cpu,
  Workflow,
  ShieldCheck,
  Calendar,
  FolderOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getCreatorById } from "@/lib/services/creators";
import { PortfolioCard } from "@/components/PortfolioCard";
import { VerificationBadge } from "@/components/VerificationBadge";
import { CreatorVerificationSignals } from "@/components/CreatorVerificationSignals";

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

function formatToolName(tool: string) {
  const map: Record<string, string> = {
    runway_gen3: "Runway Gen-3 Alpha",
    kling_ai: "Kling AI 1.5",
    luma_dream_machine: "Luma Dream Machine",
    midjourney_v6: "Midjourney v6.1",
    flux_1: "FLUX.1 [dev/pro]",
    comfy_ui: "ComfyUI Node Pipelines",
    eleven_labs: "ElevenLabs Voice",
    suno: "Suno AI Music",
  };
  return map[tool] || tool.replace(/_/g, " ");
}

export default async function CreatorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: creator, isMock } = await getCreatorById(id);

  if (!creator) {
    notFound();
  }

  const { profile, portfolio_items } = creator;

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold text-[#8c82ab] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO CREATORS DIRECTORY
          </Link>
        </div>

        {/* Hero Profile Card */}
        <div className="rounded-2xl border border-[#261e40] bg-[#140f26] p-6 md:p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-[#1b1433] shrink-0 border border-[#3b2d66] relative shadow-lg">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  fill
                  sizes="(max-width: 768px) 96px, 112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#c4b5fd] font-bold text-2xl font-mono">
                  {profile.display_name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Header Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {profile.display_name}
                </h1>
                <VerificationBadge status={creator.verification_status} isMock={isMock} />
              </div>

              <p className="text-xs font-mono text-[#8c82ab] mt-1">
                @{profile.handle} • {profile.full_name}
              </p>

              {creator.tagline && (
                <p className="mt-2 text-sm font-semibold text-[#c4b5fd]">
                  {creator.tagline}
                </p>
              )}

              {profile.bio && (
                <p className="mt-3 text-xs sm:text-sm text-[#9b92b6] leading-relaxed max-w-3xl">
                  {profile.bio}
                </p>
              )}

              {/* Meta tags */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8c82ab]">
                {profile.location && (
                  <div className="flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#7e749e]" />
                    {profile.location}
                  </div>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#9d7bf5] hover:text-[#b094fa] font-mono transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {profile.website_url.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#7e749e]" />
                  Joined{" "}
                  {new Date(creator.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  {creator.is_available ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Available for Engagements
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#7e749e] font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      Currently Booked
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Booking Box */}
            <div className="md:w-64 p-5 rounded-xl border border-[#2d2252] bg-[#0b0914] shrink-0 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block mb-1">
                  PROJECT STARTING RATE
                </span>
                <div className="text-2xl font-extrabold text-white">
                  {creator.starting_rate_cents > 0
                    ? formatCurrency(creator.starting_rate_cents, creator.currency)
                    : "Custom Quote"}
                </div>
                <p className="text-[11px] text-[#8c82ab] mt-1">
                  Estimated base rate per production package
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#221a38]">
                <Link
                  href="/briefs/new"
                  className="w-full py-2.5 px-4 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] font-bold text-xs text-center inline-block transition-all shadow-md shadow-[#9d7bf5]/20"
                >
                  Commission This Creator
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Signals & Capabilities Audit (Requirement A & Trust) */}
        <CreatorVerificationSignals creator={creator} isMock={isMock} />

        {/* Technical Deep Dive: Tools, Skills, Workflow & Commercial Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool Stack & Hardware */}
          <div className="p-6 rounded-2xl border border-[#261e40] bg-[#140f26]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Wrench className="w-4 h-4 text-[#9d7bf5]" />
              AI Tool Stack & Hardware Environment
            </div>

            <div>
              <span className="text-xs text-[#8c82ab] block mb-2 font-mono uppercase">
                Primary AI Models:
              </span>
              <div className="flex flex-wrap gap-2">
                {creator.primary_ai_tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg bg-[#0b0914] border border-[#261e40] text-xs text-[#e0d9f7] font-mono"
                  >
                    {formatToolName(tool)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <span className="text-xs text-[#8c82ab] block mb-2 font-mono uppercase">
                Creative Specializations:
              </span>
              <div className="flex flex-wrap gap-2">
                {creator.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-lg bg-[#1e163b] border border-[#3b2d66] text-xs text-[#c4b5fd] font-medium capitalize"
                  >
                    {spec.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {creator.hardware_specs && (
              <div className="mt-5 pt-4 border-t border-[#201938]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c82ab] font-mono uppercase mb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#7e749e]" />
                  Local Compute & Rig Specs:
                </div>
                <p className="text-xs text-white font-mono bg-[#0b0914] p-2.5 rounded-lg border border-[#221a38]">
                  {creator.hardware_specs}
                </p>
              </div>
            )}
          </div>

          {/* Workflow & Commercial Terms */}
          <div className="p-6 rounded-2xl border border-[#261e40] bg-[#140f26] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Workflow className="w-4 h-4 text-[#9d7bf5]" />
                Workflow Pipeline & Commercial Terms
              </div>

              {creator.custom_workflow_summary && (
                <div>
                  <span className="text-xs text-[#8c82ab] block mb-1.5 font-mono uppercase">
                    Pipeline Architecture:
                  </span>
                  <p className="text-xs text-[#dcd6f5] leading-relaxed bg-[#0b0914] p-3.5 rounded-xl border border-[#221a38]">
                    {creator.custom_workflow_summary}
                  </p>
                </div>
              )}
            </div>

            {creator.commercial_terms && (
              <div className="mt-5 pt-4 border-t border-[#201938]">
                <div className="flex items-center gap-1.5 text-xs text-[#8c82ab] font-mono uppercase mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9d7bf5]" />
                  Standard Commercial Rights:
                </div>
                <p className="text-xs text-[#a59cb8] leading-relaxed">
                  {creator.commercial_terms}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Portfolio Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#201938]">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Featured AI Portfolio Works
              </h2>
              <p className="text-xs text-[#8c82ab] mt-0.5">
                Generative video, imagery, 3D simulations, and production prompt breakdowns.
              </p>
            </div>
            <div className="text-xs text-[#8c82ab] font-mono">
              {portfolio_items.length} {portfolio_items.length === 1 ? "showcase" : "showcases"}
            </div>
          </div>

          {/* Portfolio Grid or Empty State */}
          {portfolio_items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio_items.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            /* Empty State for Creators without Portfolio Items */
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#2d2252] bg-[#140f26]/40">
              <FolderOpen className="w-10 h-10 text-[#6e658f] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">
                No portfolio items uploaded yet
              </h3>
              <p className="text-xs text-[#8c82ab] mt-1 max-w-sm mx-auto">
                This creator has registered their capabilities, but has not yet published showcase assets to the marketplace.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
