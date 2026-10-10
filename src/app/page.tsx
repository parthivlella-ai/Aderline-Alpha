import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 w-full min-h-[calc(100vh-8rem)] flex items-center relative overflow-hidden bg-[#0b0914]">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#4c205c]/20 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#9d7bf5]/10 blur-[120px] pointer-events-none -z-10" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        
        {/* Left Column: Brand Statement & Primary Action Buttons */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold text-white tracking-tight leading-[1.05] max-w-xl">
            Make the <br />
            <span className="text-white">impossible.</span> <br />
            <span className="text-[#9d7bf5]">Marketable.</span>
          </h1>

          {/* Action Buttons: Login & Sign Up */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] font-bold text-base transition-all shadow-xl shadow-[#9d7bf5]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign Up
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#191330] hover:bg-[#251c47] border border-[#35285c] text-[#e0d9f7] font-semibold text-base transition-colors"
            >
              Login
            </Link>

            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium text-[#a8a0c5] hover:text-white transition-colors"
            >
              Explore Marketplace →
            </Link>
          </div>
        </div>

        {/* Right Column: One Attractive 3D Abstract Creative Artwork (without featured creative card) */}
        <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
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
          </div>
        </div>

      </div>
    </main>
  );
}
