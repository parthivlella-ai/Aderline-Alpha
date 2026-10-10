"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  PlusCircle,
  Heart,
  MessageSquare,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Sliders,
  Edit,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPostsByCreator, getConversations, deleteMarketplacePost } from "@/lib/services/marketplace";
import { WorkCard } from "@/components/WorkCard";
import type { MarketplacePost } from "@/types";

export default function FreelancerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [myPosts, setMyPosts] = useState<MarketplacePost[]>([]);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      const posts = await getPostsByCreator(user.id);
      setMyPosts(posts);

      const convs = await getConversations(user.id);
      setConversationsCount(convs.length);

      setIsLoading(false);
    }
    loadData();
  }, [user?.id, authLoading]);

  const totalLikes = myPosts.reduce((acc, p) => acc + (p.likes_count || 0), 0);

  async function handleDelete(id: string) {
    if (!user?.id) return;
    try {
      await deleteMarketplacePost(id, user.id);
      setMyPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete post");
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#9d7bf5] animate-pulse" />
          <p className="text-xs font-mono text-[#9b92b6]">Loading your creator studio...</p>
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
            Please log in with your creator credentials to access your studio and manage published works.
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
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Freelancer Studio • @{user?.handle || "creator"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.display_name || "Creator"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#9b92b6] max-w-xl">
              Manage your published works, monitor client engagement, and reply to project commissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/posts/new"
              className="px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Upload Work
            </Link>
            <Link
              href="/profile/freelancer"
              className="px-4 py-2.5 rounded-full bg-[#1e163b] hover:bg-[#2b204f] border border-[#392b61] text-[#c4b5fd] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#261e40] bg-[#140f26] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7e749e] block">
                PUBLISHED WORKS
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {myPosts.length}
              </span>
              <Link href="/portfolio" className="text-xs text-[#9d7bf5] hover:underline mt-1 inline-block">
                Manage portfolio →
              </Link>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#20183b] flex items-center justify-center text-[#9d7bf5]">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#261e40] bg-[#140f26] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7e749e] block">
                TOTAL CLIENT LIKES
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {totalLikes}
              </span>
              <span className="text-xs text-rose-400 mt-1 block font-mono">
                Across all posts
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#20183b] flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#261e40] bg-[#140f26] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7e749e] block">
                CLIENT CONVERSATIONS
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {conversationsCount}
              </span>
              <Link href="/messages" className="text-xs text-[#9d7bf5] hover:underline mt-1 inline-block">
                View conversations →
              </Link>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#20183b] flex items-center justify-center text-[#9d7bf5]">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* My Published Works Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1d1633]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                My Published Works ({myPosts.length})
              </h2>
              <p className="text-xs text-[#9b92b6] mt-0.5">
                These visuals are visible in the public marketplace and on your creator profile.
              </p>
            </div>
            <Link
              href="/posts/new"
              className="text-xs text-[#9d7bf5] hover:text-[#b094fa] font-semibold flex items-center gap-1"
            >
              + Add new work
            </Link>
          </div>

          {myPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPosts.map((post) => (
                <WorkCard key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-12 text-center">
              <Briefcase className="w-10 h-10 text-[#7e749e] mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No works published yet</h3>
              <p className="text-xs text-[#8c82ab] mt-1 max-w-sm mx-auto">
                Upload your first AI video or image post to start receiving client commissions.
              </p>
              <Link
                href="/posts/new"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
              >
                Upload First Work
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
