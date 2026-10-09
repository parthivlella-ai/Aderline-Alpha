import Link from "next/link";
import { Sparkles, Database, Layers, CheckCircle, ArrowRight, Users, Film } from "lucide-react";
import { getClientEnv } from "@/lib/env";

export default function Home() {
  const env = getClientEnv();

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-14 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-xs font-medium mb-6">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        Phase 02: Creator Profiles & AI Portfolios Active
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
        The AI-Native Creative Marketplace
      </h1>
      <p className="mt-3 text-base md:text-lg text-zinc-400 max-w-xl">
        Connecting world-class generative AI directors, 3D simulation artists, and character designers with brands and creative agencies.
      </p>

      {/* Main CTA to explore creators */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/creators"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-violet-900/30"
        >
          <Users className="w-4 h-4" />
          Explore Creators Directory
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Phase 02 Architecture & Feature Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Users className="w-4 h-4 text-violet-400" />
            Creator Profiles
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Detailed profiles with AI tool stacks, hardware rigs, starting rates, and commercial licensing policies.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Implemented & Active
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Film className="w-4 h-4 text-violet-400" />
            AI Portfolios & Workflows
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Showcase items featuring video/image players, generation parameters, pipeline breakdowns, and commercial terms.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Implemented & Active
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Database className="w-4 h-4 text-violet-400" />
            Persistence Layer
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {env.isConfigured
              ? "Connected to configured Supabase project."
              : "Demonstration seed persistence active (transparent fallback until .env.local keys are added)."}
          </p>
          <div
            className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
              env.isConfigured ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {env.isConfigured ? "Supabase Live" : "Seed Data Fallback"}
          </div>
        </div>
      </div>
    </main>
  );
}
