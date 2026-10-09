import { Sparkles, Info } from "lucide-react";
import { getCreators } from "@/lib/services/creators";
import { CreatorDirectoryExplorer } from "@/components/CreatorDirectoryExplorer";

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
            Talent Discovery Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Generative AI Creators
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Search and filter world-class AI creators by skills, specializations, AI tool stacks,
            portfolio formats, and availability.
          </p>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Total Talent Pool: {creators.length}
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="my-6 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-300 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Demonstration Catalog Notice: </span>
          {isMock
            ? "You are viewing demonstration seed creators. Tool workflows, rates, and portfolio metrics are sample self-reported submissions and are not independently verified."
            : "Live Supabase Database active. Creator metrics and tool specifications are self-reported unless marked with an official verification badge."}
        </div>
      </div>

      {/* Creator Search & Multi-Filter Explorer */}
      <CreatorDirectoryExplorer initialCreators={creators} isMock={isMock} />
    </div>
  );
}
