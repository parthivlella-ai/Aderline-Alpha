import Link from "next/link";
import { Sparkles, Database, Users, Briefcase } from "lucide-react";
import { getClientEnv } from "@/lib/env";

export function Navbar() {
  const env = getClientEnv();

  return (
    <header className="border-b border-[#1f1936] bg-[#0b0914]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#9d7bf5] flex items-center justify-center text-[#0b0914] font-black text-sm shadow-md shadow-[#9d7bf5]/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight leading-none">
              Prismora
            </span>
            <span className="text-[10px] text-[#8e84b0] tracking-wider uppercase font-mono mt-0.5">
              AI Marketplace
            </span>
          </div>
        </Link>

        {/* Primary Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/creators"
            className="flex items-center gap-1.5 text-[#a8a0c5] hover:text-white transition-colors"
          >
            <Users className="w-4 h-4 text-[#9d7bf5]" />
            Discover Creators
          </Link>
          <Link
            href="/briefs"
            className="flex items-center gap-1.5 text-[#a8a0c5] hover:text-white transition-colors"
          >
            <Briefcase className="w-4 h-4 text-[#9d7bf5]" />
            Briefs
          </Link>
          <Link
            href="/briefs/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e1736] hover:bg-[#282046] border border-[#332857] text-[#c4b5fd] text-xs font-semibold transition-colors"
          >
            + Create Brief
          </Link>
        </nav>

        {/* Database Status Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div
            className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[11px] font-medium ${
              env.isConfigured
                ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                : "bg-[#1f1736] border-[#382b61] text-[#b8aee0]"
            }`}
          >
            <Database className="w-3 h-3 text-[#9d7bf5]" />
            {env.isConfigured ? "Supabase Live" : "Demo Engine Ready"}
          </div>
        </div>
      </div>
    </header>
  );
}
