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
  DollarSign,
  FolderOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getCreatorById } from "@/lib/services/creators";
import { PortfolioCard } from "@/components/PortfolioCard";
import { VerificationBadge } from "@/components/VerificationBadge";

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
    eleven_labs: "ElevenLabs Voice Synthesis",
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
    <div className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/creators"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Creators Directory
        </Link>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 relative">
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
              <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-2xl">
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

            <p className="text-sm text-zinc-400 mt-1">
              @{profile.handle} • {profile.full_name}
            </p>

            {creator.tagline && (
              <p className="mt-2 text-base font-medium text-violet-300">
                {creator.tagline}
              </p>
            )}

            {profile.bio && (
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {profile.bio}
              </p>
            )}

            {/* Meta tags */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {profile.location}
                </div>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {profile.website_url.replace(/^https?:\/\//, "")}
                </a>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined {new Date(creator.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <div className="flex items-center gap-1.5">
                {creator.is_available ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available for Commercial Engagements
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-zinc-500 font-medium">
                    <XCircle className="w-3.5 h-3.5" />
                    Currently Booked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Booking Box */}
          <div className="md:w-64 p-5 rounded-xl border border-zinc-800 bg-zinc-950/70 shrink-0 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1">
                Project Starting Rate
              </span>
              <div className="text-2xl font-extrabold text-white">
                {creator.starting_rate_cents > 0
                  ? formatCurrency(creator.starting_rate_cents, creator.currency)
                  : "Custom Quote"}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Estimated base rate per deliverable package
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs text-center transition-colors shadow-lg shadow-violet-900/20"
              >
                Inquire for Brief
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive: Tools, Skills, Workflow & Commercial Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Tool Stack & Hardware */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Wrench className="w-4 h-4 text-violet-400" />
            AI Tool Stack & Hardware Environment
          </div>

          <div>
            <span className="text-xs text-zinc-400 block mb-2 font-medium">
              Primary AI Models & Frameworks:
            </span>
            <div className="flex flex-wrap gap-2">
              {creator.primary_ai_tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-200 font-medium"
                >
                  {formatToolName(tool)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="text-xs text-zinc-400 block mb-2 font-medium">
              Creative Specializations:
            </span>
            <div className="flex flex-wrap gap-2">
              {creator.specializations.map((spec) => (
                <span
                  key={spec}
                  className="px-2.5 py-1 rounded-md bg-violet-950/40 border border-violet-800/40 text-xs text-violet-300 font-medium capitalize"
                >
                  {spec.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          {creator.hardware_specs && (
            <div className="mt-5 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                Local Compute & Rendering Rig:
              </div>
              <p className="text-xs text-zinc-300 font-mono">
                {creator.hardware_specs}
              </p>
            </div>
          )}
        </div>

        {/* Workflow & Commercial Terms */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Workflow className="w-4 h-4 text-violet-400" />
              Workflow Pipeline & Licensing Terms
            </div>

            {creator.custom_workflow_summary && (
              <div>
                <span className="text-xs text-zinc-400 block mb-1.5 font-medium">
                  Pipeline Architecture:
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  {creator.custom_workflow_summary}
                </p>
              </div>
            )}
          </div>

          {creator.commercial_terms && (
            <div className="mt-5 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Standard Commercial Rights & Delivery:
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {creator.commercial_terms}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Portfolio Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Featured AI Portfolio Works
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Generative video, imagery, 3D simulations, and production prompt breakdowns.
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            {portfolio_items.length} {portfolio_items.length === 1 ? "work showcase" : "work showcases"}
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
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30">
            <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">
              No portfolio items uploaded yet
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              This creator has registered their capabilities, but has not yet published showcase assets to the marketplace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
