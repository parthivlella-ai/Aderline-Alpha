import Link from "next/link";
import {
  Compass,
  Briefcase,
  Bookmark,
  MessageSquare,
  Plus,
  ShieldCheck,
  Building,
} from "lucide-react";
import { getCreators } from "@/lib/services/creators";
import { CreatorDirectoryExplorer } from "@/components/CreatorDirectoryExplorer";

export const metadata = {
  title: "Discover Creators | Prismora",
  description:
    "Find your next AI creative partner. Human imagination. AI-native execution. One place to collaborate.",
};

export default async function CreatorsPage() {
  const { data: creators, isMock } = await getCreators();

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex">
      {/* Left Sidebar (Desktop Navigation as shown in Figma Screen 02) */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#1d1633] bg-[#0c0917] p-6 shrink-0">
        <div className="space-y-8">
          {/* Workspace label */}
          <div className="text-[11px] font-mono tracking-wider text-[#6b628a] uppercase font-semibold">
            WORKSPACE NAVIGATION
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            <Link
              href="/creators"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#201938] border border-[#382b61] text-[#c4b5fd] font-semibold text-sm transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#9d7bf5]" />
              Discover
            </Link>

            <Link
              href="/briefs"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#9288b0] hover:text-white hover:bg-[#16102a] font-medium text-sm transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#7e749e]" />
              Briefs
            </Link>

            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#62597f] font-medium text-sm cursor-not-allowed">
              <span className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-[#52496e]" />
                Saved creators
              </span>
              <span className="text-[10px] font-mono bg-[#18122c] px-2 py-0.5 rounded text-[#7e749e]">
                Soon
              </span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#62597f] font-medium text-sm cursor-not-allowed">
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#52496e]" />
                Messages
              </span>
              <span className="text-[10px] font-mono bg-[#18122c] px-2 py-0.5 rounded text-[#7e749e]">
                Soon
              </span>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Pill */}
        <div className="pt-6 border-t border-[#1d1633] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#9d7bf5] text-[#0b0914] flex items-center justify-center font-bold text-sm shadow-md shadow-[#9d7bf5]/20">
            <Building className="w-5 h-5 text-[#0b0914]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">Brand Studio</p>
            <p className="text-[10px] text-[#7e749e] font-mono truncate">
              Client Workspace
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 md:py-10 w-full overflow-hidden">
        {/* Header Section (Matches Screen 02 Figma Top Bar) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#8c82ab] uppercase font-semibold">
              YOUR CREATIVE UNIVERSE
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Find your next AI creative partner.
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-[#9b92b6] max-w-2xl leading-relaxed">
              Human imagination. AI-native execution. One place to collaborate.
            </p>
          </div>

          {/* Top Right Action Button */}
          <Link
            href="/briefs/new"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] font-bold text-xs transition-all shadow-md shadow-[#9d7bf5]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create a brief
          </Link>
        </div>

        {/* Creator Discovery Explorer Component */}
        <CreatorDirectoryExplorer initialCreators={creators} isMock={isMock} />
      </main>
    </div>
  );
}
