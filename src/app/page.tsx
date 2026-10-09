import Link from "next/link";
import {
  Sparkles,
  Database,
  Layers,
  CheckCircle,
  ArrowRight,
  Users,
  Film,
  Briefcase,
  Plus,
} from "lucide-react";
import { getClientEnv } from "@/lib/env";

export default function Home() {
  const env = getClientEnv();

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-14 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-xs font-medium mb-6">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        Phase 03: Brand & Agency Briefs Active
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
        The AI-Native Creative Marketplace
      </h1>
      <p className="mt-3 text-base md:text-lg text-zinc-400 max-w-xl">
        Connecting world-class generative AI directors, 3D simulation artists, and character designers with visionary brands and agencies.
      </p>

      {/* Main CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/briefs"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-violet-900/30"
        >
          <Briefcase className="w-4 h-4" />
          Browse Campaign Briefs
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/briefs/new"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-violet-400" />
          Post a Brief
        </Link>

        <Link
          href="/creators"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white font-medium text-sm transition-colors"
        >
          <Users className="w-4 h-4" />
          Creators Directory
        </Link>
      </div>

      {/* Feature & Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Users className="w-4 h-4 text-violet-400" />
            Creator Profiles
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Detailed profiles with AI tool stacks, hardware rigs, starting rates, and verified portfolios.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Phase 02 Complete
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Briefcase className="w-4 h-4 text-violet-400" />
            Campaign Briefs
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Full brief creation, validation, style specifications, aspect ratios, editing, and retrieval.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Phase 03 Complete
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Database className="w-4 h-4 text-violet-400" />
            Database Architecture
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {env.isConfigured
              ? "Connected to live Supabase PostgreSQL database."
              : "In-memory persistent fallback repository active with demo seed data."}
          </p>
          <div
            className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
              env.isConfigured ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {env.isConfigured ? "Supabase Live" : "Seed & Memory Active"}
          </div>
        </div>
      </div>
    </main>
  );
}
