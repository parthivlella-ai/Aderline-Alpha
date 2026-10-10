import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CreatorWithDetails } from "@/types";
import { VerificationBadge } from "@/components/VerificationBadge";

interface CreatorCardProps {
  creator: CreatorWithDetails;
  isMock?: boolean;
}

// Format tool names into clean human-readable tags
function formatToolName(tool: string) {
  const map: Record<string, string> = {
    runway_gen3: "Runway Gen-3",
    kling_ai: "Kling 1.5",
    luma_dream_machine: "Luma Dream",
    midjourney_v6: "Midjourney v6",
    flux_1: "FLUX.1",
    comfy_ui: "ComfyUI",
    eleven_labs: "ElevenLabs",
    suno: "Suno AI",
  };
  return map[tool] || tool.replace(/_/g, " ");
}

// Background theme color generator for card header artwork
const BANNER_THEMES = [
  {
    bg: "from-[#3b1747] via-[#4d1f5e] to-[#692980]",
    orb: "bg-gradient-to-tr from-[#f7845f] to-[#fdb750]",
    badgeBg: "bg-[#251533]/80 border-[#4a2469]",
    badgeText: "text-[#fbcfe8]",
  },
  {
    bg: "from-[#574499] via-[#6d57b5] to-[#8068cc]",
    orb: "bg-gradient-to-tr from-[#fdb750] to-[#ffd77d]",
    badgeBg: "bg-[#2c2057]/80 border-[#554294]",
    badgeText: "text-[#ede9fe]",
  },
  {
    bg: "from-[#c25132] via-[#e0633e] to-[#f57a53]",
    orb: "bg-gradient-to-tr from-[#fdb750] to-[#ffffff]",
    badgeBg: "bg-[#45180f]/80 border-[#853424]",
    badgeText: "text-[#ffedd5]",
  },
  {
    bg: "from-[#1b344b] via-[#244b6e] to-[#2f6696]",
    orb: "bg-gradient-to-tr from-[#38bdf8] to-[#93c5fd]",
    badgeBg: "bg-[#112436]/80 border-[#285780]",
    badgeText: "text-[#e0f2fe]",
  },
];

export function CreatorCard({ creator, isMock = true }: CreatorCardProps) {
  const { profile, portfolio_items } = creator;

  // Stable index based on id
  const themeIndex =
    Math.abs(
      creator.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % BANNER_THEMES.length;
  const theme = BANNER_THEMES[themeIndex];

  // Pick top portfolio item if exists
  const featuredItem = portfolio_items?.[0];
  const primarySpec =
    creator.specializations?.[0]?.replace(/_/g, " ").toUpperCase() || "AI CREATIVE";
  const toolsFormatted = creator.primary_ai_tools.map(formatToolName).slice(0, 3).join(" · ");

  return (
    <div className="rounded-2xl border border-[#261e40] bg-[#140f26] p-4 flex flex-col justify-between hover:border-[#473775] transition-all duration-300 hover:-translate-y-1 group shadow-lg shadow-black/40">
      <div>
        {/* Top Visual Banner / Artwork Showcase */}
        <Link
          href={`/creators/${creator.id}`}
          className={`relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-tr ${theme.bg} flex items-center justify-center p-3 mb-4 block group/banner`}
        >
          {/* Subtle thumbnail preview if available */}
          {featuredItem?.thumbnail_url && (
            <div className="absolute inset-0 opacity-25 mix-blend-overlay group-hover/banner:opacity-40 transition-opacity">
              <Image
                src={featuredItem.thumbnail_url}
                alt={featuredItem.title || "Portfolio preview"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Abstract Geometric Solar Motif (Matches Figma Screen 02 Art) */}
          <div className="relative z-10 flex items-center justify-center pointer-events-none">
            <div
              className={`w-16 h-16 rounded-full ${theme.orb} shadow-xl shadow-black/40 group-hover/banner:scale-110 transition-transform duration-500`}
            />
            <div className="absolute w-24 h-24 rounded-full border border-white/20 pointer-events-none" />
          </div>

          {/* Top-left category badge */}
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase font-semibold border backdrop-blur-md ${theme.badgeBg} ${theme.badgeText}`}
            >
              {primarySpec}
            </span>
          </div>

          {/* Availability pill if available */}
          {creator.is_available && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 text-[10px] font-medium font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE
            </div>
          )}
        </Link>

        {/* Creator Name & Subtitle */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-lg text-white tracking-tight truncate group-hover:text-[#c4b5fd] transition-colors">
              <Link href={`/creators/${creator.id}`} className="hover:underline">
                {profile.display_name}
              </Link>
            </h3>
            <p className="text-[11px] font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mt-0.5 truncate">
              {creator.tagline || `@${profile.handle}`}
            </p>
          </div>
        </div>

        {/* Bio / Capability Summary */}
        <p className="mt-2.5 text-xs text-[#a097bf] line-clamp-2 leading-relaxed">
          {profile.bio ||
            "Next-generation generative AI pipeline director specializing in photorealistic commercial executions."}
        </p>

        {/* Tools list */}
        <div className="mt-3 text-[11px] font-mono text-[#c4b5fd] truncate">
          {toolsFormatted}
        </div>
      </div>

      {/* Card Footer: Verification Badge & Direct Profile Link */}
      <div className="mt-5 pt-3.5 border-t border-[#221a3b] flex items-center justify-between">
        <VerificationBadge
          status={creator.verification_status}
          compact
          isMock={isMock}
        />

        <Link
          href={`/creators/${creator.id}`}
          className="w-8 h-8 rounded-full bg-[#1e173b] hover:bg-[#9d7bf5] text-[#c4b5fd] hover:text-[#0b0914] flex items-center justify-center transition-colors border border-[#34275c] group/btn"
          aria-label={`View ${profile.display_name} profile`}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
