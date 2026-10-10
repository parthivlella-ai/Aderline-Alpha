"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Briefcase, Sparkles, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPostsByCreator, deleteMarketplacePost } from "@/lib/services/marketplace";
import { WorkCard } from "@/components/WorkCard";
import type { MarketplacePost } from "@/types";

export default function PortfolioPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<MarketplacePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (authLoading) return;
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      const data = await getPostsByCreator(user.id);
      setPosts(data);
      setIsLoading(false);
    }
    load();
  }, [user?.id, authLoading]);

  async function handleDelete(id: string) {
    if (!user?.id) return;
    try {
      await deleteMarketplacePost(id, user.id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete post");
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#9d7bf5] animate-pulse" />
          <p className="text-xs font-mono text-[#9b92b6]">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "freelancer") {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-[#271f43] bg-[#140f26] p-8 text-center">
          <Briefcase className="w-10 h-10 text-[#7e749e] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Freelancer Access Required</h2>
          <p className="text-xs text-[#9b92b6] mt-2 leading-relaxed">
            Portfolio management is exclusively available to authenticated creator accounts.
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
      <div className="max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1d1633]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest text-[#8c82ab] uppercase font-semibold">
                CREATOR SHOWCASE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Portfolio ({posts.length})
            </h1>
            <p className="mt-1 text-sm text-[#9b92b6]">
              Manage the visual assets and commercial deliverables showcased to prospective clients.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/posts/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Upload Work
            </Link>
            <Link
              href="/profile/freelancer"
              className="px-4 py-2.5 rounded-full bg-[#1e163b] hover:bg-[#281f4c] border border-[#3b2d66] text-[#c4b5fd] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <WorkCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-12 text-center">
            <Briefcase className="w-10 h-10 text-[#7e749e] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No published portfolio works yet</h3>
            <p className="text-xs text-[#8c82ab] mt-1 max-w-sm mx-auto">
              Upload your generative videos, product visuals, and keyframe packs to attract brand commissions.
            </p>
            <Link
              href="/posts/new"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Upload First Work
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
