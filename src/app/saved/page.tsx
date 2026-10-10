"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSavedPosts } from "@/lib/services/marketplace";
import { WorkCard } from "@/components/WorkCard";
import type { MarketplacePost } from "@/types";

export default function SavedPage() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<MarketplacePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user?.id) {
        const posts = await getSavedPosts(user.id);
        setSavedPosts(posts);
      } else {
        // Fallback demo saved items
        const posts = await getSavedPosts("client-demo-1");
        setSavedPosts(posts);
      }
      setIsLoading(false);
    }
    load();
  }, [user?.id]);

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1d1633]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest text-[#8c82ab] uppercase font-semibold">
                WORKSPACE INSPIRATION
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Saved Works ({savedPosts.length})
            </h1>
            <p className="mt-1 text-sm text-[#9b92b6]">
              Your collection of bookmarked AI video concepts and visual styles.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="px-4 py-2 rounded-full bg-[#1e163b] hover:bg-[#281f4c] border border-[#3b2d66] text-[#c4b5fd] text-xs font-semibold transition-colors"
          >
            Browse More Works
          </Link>
        </div>

        {savedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPosts.map((post) => (
              <WorkCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-12 text-center">
            <Bookmark className="w-10 h-10 text-[#7e749e] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No saved works yet</h3>
            <p className="text-xs text-[#8c82ab] mt-1 max-w-sm mx-auto">
              When you discover AI videos or images you like in the marketplace, click the bookmark icon to save them here.
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explore Marketplace
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
