import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between relative overflow-hidden bg-[#0b0914]">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#4c205c]/20 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#9d7bf5]/10 blur-[120px] pointer-events-none -z-10" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        
        {/* Left Column: Brand Statement & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18122c] border border-[#302552] text-[#c4b5fd] text-xs font-mono tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9d7bf5] animate-pulse" />
            CREATIVE INTELLIGENCE, REIMAGINED
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-white tracking-tight leading-[1.08] max-w-xl">
            Make the <br />
            <span className="text-white">impossible.</span> <br />
            <span className="text-[#9d7bf5]">marketable.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#9b92b6] max-w-lg leading-relaxed">
            A new universe of AI-native talent. Discover creators, shape ambitious briefs, and bring your next big idea to life.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              href="/creators"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] font-bold text-sm transition-all shadow-lg shadow-[#9d7bf5]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Enter the universe
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/briefs/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#191330] hover:bg-[#231b42] border border-[#322757] text-[#e0d9f7] font-semibold text-sm transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#9d7bf5]" />
              Create a brief
            </Link>
          </div>

          {/* Secondary reassurance copy */}
          <p className="mt-4 text-xs text-[#756c94]">
            Brand or creator? Start with one simple sign-in.
          </p>

          {/* Quick Platform Metrics */}
          <div className="mt-12 pt-8 border-t border-[#1d1633] w-full grid grid-cols-3 gap-6 max-w-md">
            <div>
              <p className="text-xl font-bold text-white">124+</p>
              <p className="text-xs text-[#8278a2] mt-0.5">Vetted AI Creators</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">4K / ProRes</p>
              <p className="text-xs text-[#8278a2] mt-0.5">Commercial Masters</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">100%</p>
              <p className="text-xs text-[#8278a2] mt-0.5">Clear IP Buyout</p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Art & Featured Creative Glass Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
          
          {/* Main Visual Circle Composition */}
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            
            {/* Deep plum saturated backdrop disc */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3b1747] via-[#4f205f] to-[#682a7e] opacity-90 shadow-2xl shadow-[#4f205f]/40" />

            {/* Glowing gold thin vector ring */}
            <div className="absolute -top-4 -right-4 w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border border-[#fdb750]/30 pointer-events-none" />

            {/* Glowing pink/rose thin vector ring */}
            <div className="absolute -bottom-6 -left-6 w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border border-[#f472b6]/30 pointer-events-none" />

            {/* Stylized Modern Art Figurine / Solar Motif (Coral & Amber) */}
            <div className="relative z-0 flex items-center justify-center">
              {/* Silhouette Head / Arc in Coral */}
              <div className="w-28 h-36 rounded-t-full bg-gradient-to-b from-[#f7845f] to-[#e66c45] shadow-lg relative overflow-hidden">
                <div className="absolute top-2 left-3 w-8 h-8 rounded-full bg-white/20 blur-sm" />
              </div>
              {/* Golden Sun Orb */}
              <div className="absolute -right-4 top-8 w-14 h-14 rounded-full bg-gradient-to-tr from-[#fdb750] to-[#ffd57e] shadow-lg shadow-[#fdb750]/50" />
            </div>

            {/* Floating Glass Card: "Featured Creative · 001" */}
            <div className="absolute -bottom-6 right-2 sm:right-0 max-w-[290px] w-full rounded-2xl bg-[#140f26]/95 border border-[#312554] p-5 shadow-2xl shadow-black/80 backdrop-blur-xl z-20 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-[#9b92b6] uppercase font-semibold">
                  FEATURED CREATIVE · 001
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <h3 className="mt-2 text-lg font-bold text-white tracking-tight">
                Dreams, rendered.
              </h3>

              <p className="mt-1 text-xs text-[#9b92b6] leading-relaxed">
                Generative film / surreal worlds <br />
                <span className="text-[#c4b5fd] font-mono text-[11px]">
                  Runway · Midjourney · ComfyUI
                </span>
              </p>

              <div className="mt-4 pt-3 border-t border-[#251c41] flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e163b] border border-[#3b2d66] text-[#c4b5fd] text-[10px] font-semibold tracking-wide">
                  <ShieldCheck className="w-3 h-3 text-[#9d7bf5]" />
                  VERIFIED WORKFLOW
                </span>

                <Link
                  href="/creators/00000000-0000-0000-0000-000000000001"
                  className="text-xs font-semibold text-[#9d7bf5] hover:text-[#b094fa] inline-flex items-center gap-0.5"
                >
                  View
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Fine Print Bar */}
      <div className="w-full border-t border-[#1a142e] py-4 bg-[#0a0812]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#62597f] tracking-wider uppercase">
          <span>CURATED TALENT • CLEAR RIGHTS • CREATIVE FLOW</span>
          <span className="text-[#8479a6]">
            Active Creators: 4 Verified Studios • 100% Commercial Clearance
          </span>
        </div>
      </div>
    </main>
  );
}
