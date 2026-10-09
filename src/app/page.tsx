import { Sparkles, Database, Layers, CheckCircle, ArrowRight } from "lucide-react";
import { getClientEnv } from "@/lib/env";

export default function Home() {
  const env = getClientEnv();

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-xs font-medium mb-6">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        Phase 01: Application Foundation & Database Architecture
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
        Prismora
      </h1>
      <p className="mt-3 text-lg text-zinc-400 max-w-xl">
        AI-Native Marketplace connecting generative AI creators with visionary brands and agencies.
      </p>

      {/* Architecture & Environment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Layers className="w-4 h-4 text-violet-400" />
            Full-Stack Core
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Next.js 15 App Router, TypeScript, and Tailwind CSS configured for high-performance delivery.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Initialized & Ready
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Database className="w-4 h-4 text-violet-400" />
            PostgreSQL Schema
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tables for Creators, Portfolios, Brand Briefs, Verifications, and Engagements defined with RLS.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-violet-400 text-xs font-medium">
            Migration SQL Ready
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Supabase Connection
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {env.isConfigured
              ? "Connected to configured Supabase project."
              : "Pending .env.local configuration (using safe fallback client)."}
          </p>
          <div
            className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
              env.isConfigured ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {env.isConfigured ? "Configured" : "Waiting for .env.local"}
          </div>
        </div>
      </div>

      <div className="mt-12 text-xs text-zinc-500">
        Minimal placeholder interface. Visual styling and UI workflows will be developed in Phase 02+ following Figma designs.
      </div>
    </main>
  );
}
