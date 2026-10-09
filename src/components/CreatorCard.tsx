import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wrench, Layers, MapPin, Sparkles } from "lucide-react";
import type { CreatorWithDetails } from "@/types";
import { VerificationBadge } from "@/components/VerificationBadge";

interface CreatorCardProps {
  creator: CreatorWithDetails;
  isMock?: boolean;
}

// Format currency
function formatCurrency(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// Format tool names into clean human-readable tags
function formatToolName(tool: string) {
  const map: Record<string, string> = {
    runway_gen3: "Runway Gen-3",
    kling_ai: "Kling AI",
    luma_dream_machine: "Luma Dream",
    midjourney_v6: "Midjourney v6",
    flux_1: "FLUX.1",
    comfy_ui: "ComfyUI",
    eleven_labs: "ElevenLabs",
    suno: "Suno AI",
  };
  return map[tool] || tool.replace(/_/g, " ");
}

export function CreatorCard({ creator, isMock = true }: CreatorCardProps) {
  const { profile, portfolio_items } = creator;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
      <div>
        {/* Verification Status Banner */}
        <div className="mb-4">
          <VerificationBadge status={creator.verification_status} isMock={isMock} />
        </div>

        {/* Creator Identity Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-lg">
                {profile.display_name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-white truncate">
              {profile.display_name}
            </h3>
            <p className="text-xs text-zinc-400">
              @{profile.handle} • {profile.full_name}
            </p>
            {profile.location && (
              <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Tagline & Bio */}
        {creator.tagline && (
          <p className="mt-3 text-sm font-medium text-violet-300">
            {creator.tagline}
          </p>
        )}
        {profile.bio && (
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* AI Tools & Models */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium mb-2">
            <Wrench className="w-3.5 h-3.5 text-violet-400" />
            AI Tool Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {creator.primary_ai_tools.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
              >
                {formatToolName(tool)}
              </span>
            ))}
            {creator.primary_ai_tools.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/40 text-zinc-500">
                +{creator.primary_ai_tools.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Specializations */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium mb-1.5">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            Specialization
          </div>
          <div className="flex flex-wrap gap-1.5">
            {creator.specializations.map((spec) => (
              <span
                key={spec}
                className="text-[11px] px-2 py-0.5 rounded bg-violet-950/40 text-violet-300 border border-violet-800/30 capitalize"
              >
                {spec.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Rates & Profile CTA */}
      <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
            Starting Rate
          </span>
          <span className="text-sm font-bold text-white">
            {creator.starting_rate_cents > 0
              ? `${formatCurrency(creator.starting_rate_cents, creator.currency)}`
              : "Inquire"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">
            {portfolio_items.length} {portfolio_items.length === 1 ? "work" : "works"}
          </span>
          <Link
            href={`/creators/${creator.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
          >
            View Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
