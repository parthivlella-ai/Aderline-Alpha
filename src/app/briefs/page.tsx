import Link from "next/link";
import { Plus, Briefcase, Sparkles, Info } from "lucide-react";
import { getBriefs } from "@/lib/services/briefs";
import { BriefCard } from "@/components/BriefCard";

export const metadata = {
  title: "Brand Campaign Briefs | Prismora",
  description:
    "Explore active generative AI creative briefs posted by visionary brands and creative agencies.",
};

export default async function BriefsPage() {
  const { data: briefs, isMock } = await getBriefs();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/40 text-violet-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Client Opportunities Board
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Brand & Agency Briefs
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Discover commercial briefs seeking generative video directors, 3D artists, and AI stylists.
            Review campaign objectives, style preferences, aspect ratios, and commercial licenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/briefs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-violet-900/30"
          >
            <Plus className="w-4 h-4" />
            Post a Brief
          </Link>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="my-6 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-300 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Marketplace Briefs Directory: </span>
          {isMock
            ? "Showing demonstration campaign briefs. You can post new briefs or edit existing records—all updates persist in local runtime memory."
            : "Connected to live Supabase database. Briefs and budgets reflect database records."}
        </div>
      </div>

      {/* Briefs Grid or Empty State */}
      {briefs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20">
          <Briefcase className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No active briefs found</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
            Be the first brand to commission generative AI creators by posting a project brief.
          </p>
          <div className="mt-6">
            <Link
              href="/briefs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs"
            >
              <Plus className="w-4 h-4" />
              Post a Campaign Brief
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
