import Link from "next/link";
import { Sparkles, Database, Users, Briefcase } from "lucide-react";
import { getClientEnv } from "@/lib/env";

export function Navbar() {
  const env = getClientEnv();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-900/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Prismora
          </span>
        </Link>

        {/* Primary Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/creators"
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4 text-violet-400" />
            Creators
          </Link>
          <span className="flex items-center gap-1.5 text-zinc-500 cursor-not-allowed">
            <Briefcase className="w-4 h-4" />
            Briefs <span className="text-[10px] uppercase tracking-wider bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Phase 03</span>
          </span>
        </nav>

        {/* Database Status Pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div
            className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              env.isConfigured
                ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                : "bg-amber-950/30 border-amber-800/40 text-amber-300"
            }`}
          >
            <Database className="w-3 h-3" />
            {env.isConfigured ? "Supabase Live" : "Demo Seed Mode"}
          </div>
        </div>
      </div>
    </header>
  );
}
