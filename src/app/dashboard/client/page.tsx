"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building,
  Bookmark,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMarketplacePosts, getSavedPosts, getConversations } from "@/lib/services/marketplace";
import { WorkCard } from "@/components/WorkCard";
import type { MarketplacePost, Conversation } from "@/types";

export default function ClientDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [curatedPosts, setCuratedPosts] = useState<MarketplacePost[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const businessCategory = user?.business_category || "Food & Beverage";

  useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      const allPosts = await getMarketplacePosts({
        clientBusinessCategory: businessCategory,
        currentUserId: user?.id,
      });

      // Filter or sort by user's business category
      const curated = allPosts.filter((p) =>
        p.category.toLowerCase().includes(businessCategory.toLowerCase())
      );
      setCuratedPosts(curated.length > 0 ? curated.slice(0, 3) : allPosts.slice(0, 3));

      const saved = await getSavedPosts(user.id);
      setSavedCount(saved.length);
      const convs = await getConversations(user.id);
      setConversationsCount(convs.length);

      setIsLoading(false);
    }
    loadData();
  }, [user?.id, businessCategory, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#9d7bf5] animate-pulse" />
          <p className="text-xs font-mono text-[#9b92b6]">Loading your client workspace...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "client") {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-[#271f43] bg-[#140f26] p-8 text-center">
          <Building className="w-10 h-10 text-[#7e749e] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Client Workspace</h2>
          <p className="text-xs text-[#9b92b6] mt-2 leading-relaxed">
            Please log in with your brand or business account to access this workspace.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              Sign In
            </Link>
            <Link
              href="/marketplace"
              className="px-5 py-2 rounded-full bg-[#1e163b] text-[#c4b5fd] text-xs font-medium border border-[#3b2d66]"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-[#271f43] bg-gradient-to-r from-[#17102e] via-[#1a1236] to-[#201440] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-[#271d47] border border-[#3f2e6e] text-[#c4b5fd] text-xs font-mono font-medium flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#9d7bf5]" />
                Client Workspace • {businessCategory}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.display_name || "Client"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#9b92b6] max-w-xl">
              Discover top AI creators, review your saved inspiration, and message creative directors directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/creators"
              className="px-4 py-2.5 rounded-full bg-[#20173d] hover:bg-[#2b1f52] border border-[#3f2e6e] text-[#c4b5fd] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              Find Creators
            </Link>
            <Link
              href="/marketplace"
              className="px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Discover Work
            </Link>
            <Link
              href="/profile/client"
              className="px-4 py-2.5 rounded-full bg-[#1e163b] hover:bg-[#2b204f] border border-[#392b61] text-[#c4b5fd] text-xs font-semibold transition-colors"
            >
              Business Profile
            </Link>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#261e40] bg-[#140f26] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7e749e] block">
                SAVED CREATIVE WORKS
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {savedCount}
              </span>
              <Link href="/saved" className="text-xs text-[#9d7bf5] hover:underline mt-1 inline-block">
                View saved works →
              </Link>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#20183b] flex items-center justify-center text-[#9d7bf5]">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#261e40] bg-[#140f26] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7e749e] block">
                ACTIVE CONVERSATIONS
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {conversationsCount}
              </span>
              <Link href="/messages" className="text-xs text-[#9d7bf5] hover:underline mt-1 inline-block">
                Open messages →
              </Link>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#20183b] flex items-center justify-center text-[#9d7bf5]">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#261e40] bg-[#140f26] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7e749e] block">
                RECOMMENDED NICHE
              </span>
              <span className="text-sm font-bold text-white mt-1 block truncate max-w-[160px]">
                {businessCategory}
              </span>
              <span className="text-xs text-emerald-400 mt-1 block font-mono">
                Auto-prioritizing feed
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#20183b] flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Curated Recommendations for this Client's Niche */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1d1633]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Curated for Your Business ({businessCategory})
              </h2>
              <p className="text-xs text-[#9b92b6] mt-0.5">
                Top AI visuals and commercial directors tailored to your brand category.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-xs text-[#9d7bf5] hover:text-[#b094fa] font-semibold flex items-center gap-1"
            >
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedPosts.map((post) => (
              <WorkCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
