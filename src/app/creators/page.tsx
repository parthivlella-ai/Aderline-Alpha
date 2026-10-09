import { Users, Info, Sparkles } from "lucide-react";
import { getCreators } from "@/lib/services/creators";
import { CreatorCard } from "@/components/CreatorCard";

export const metadata = {
  title: "AI Creators Directory | Prismora",
  description:
    "Explore specialized AI video directors, generative 3D artists, and character designers available for brand engagements.",
};

export default async function CreatorsPage() {
  const { data: creators, isMock } = await getCreators();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/40 text-violet-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Curated Talent Network
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Generative AI Creators
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Discover verified and emerging AI creators specializing in Runway Gen-3, Kling, FLUX.1,
            Midjourney, and advanced ComfyUI pipelines for brand campaigns.
          </p>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Showing {creators.length} creator {creators.length === 1 ? "profile" : "profiles"}
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="my-6 p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 text-amber-200/90 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Demonstration Catalog Notice: </span>
          {isMock
            ? "You are viewing demonstration seed creators. Tool workflows, rates, and portfolio metrics are sample self-reported submissions and are not independently verified."
            : "Live Supabase Database active. Creator metrics and tool specifications are self-reported unless marked with an official verification badge."}
        </div>
      </div>

      {/* Creator Grid */}
      {creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} isMock={isMock} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No creators found</h3>
          <p className="text-sm text-zinc-500 mt-1">
            No creator profiles have been registered in the database yet.
          </p>
        </div>
      )}
    </div>
  );
}
