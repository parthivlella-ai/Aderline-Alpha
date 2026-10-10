"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Bookmark,
  MessageSquare,
  Film,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle,
  Play,
  ArrowUpRight,
} from "lucide-react";
import type { MarketplacePost } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toggleLikePost, toggleSavePost } from "@/lib/services/marketplace";

interface WorkCardProps {
  post: MarketplacePost;
  onDelete?: (id: string) => void;
}

function formatPrice(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function WorkCard({ post, onDelete }: WorkCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isSaved, setIsSaved] = useState(post.is_saved || false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSaveNotice, setShowSaveNotice] = useState(false);

  const isOwner = user?.id === post.creator_id;
  const isVideo =
    post.media_type === "video" ||
    post.media_url.endsWith(".mp4") ||
    post.media_url.includes(".mp4") ||
    post.media_url.includes(".webm") ||
    post.media_url.startsWith("blob:") ||
    post.media_url.includes("gtv-videos") ||
    post.media_url.startsWith("data:video");

  const hasCustomThumbnail = Boolean(
    post.thumbnail_url &&
    post.thumbnail_url !== post.media_url &&
    (post.thumbnail_url.startsWith("data:image") ||
     post.thumbnail_url.startsWith("http://") ||
     post.thumbnail_url.startsWith("https://") ||
     post.thumbnail_url.startsWith("blob:"))
  );

  async function handleToggleLike() {
    if (!user) {
      router.push("/login");
      return;
    }
    const res = await toggleLikePost(post.id, user.id);
    setIsLiked(res.liked);
    setLikesCount(res.likesCount);
  }

  async function handleToggleSave() {
    if (!user) {
      router.push("/login");
      return;
    }
    const res = await toggleSavePost(post.id, user.id);
    setIsSaved(res.saved);
    if (res.saved) {
      setShowSaveNotice(true);
      setTimeout(() => setShowSaveNotice(false), 2000);
    }
  }

  function handleStartChat() {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/messages?creatorId=${post.creator_id}&creatorName=${post.creator?.display_name || ""}&creatorHandle=${post.creator?.handle || ""}&postTitle=${post.title}`
        )}`
      );
      return;
    }
    router.push(
      `/messages?creatorId=${encodeURIComponent(post.creator_id)}&creatorName=${encodeURIComponent(
        post.creator?.display_name || ""
      )}&creatorHandle=${encodeURIComponent(
        post.creator?.handle || ""
      )}&creatorAvatar=${encodeURIComponent(
        post.creator?.avatar_url || ""
      )}&postTitle=${encodeURIComponent(post.title)}`
    );
  }

  return (
    <div className="rounded-2xl border border-[#261e40] bg-[#140f26] overflow-hidden flex flex-col justify-between hover:border-[#473775] transition-all duration-300 hover:-translate-y-1 group shadow-xl shadow-black/40 relative">
      {/* Save feedback toast */}
      {showSaveNotice && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-in fade-in">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved to your workspace!</span>
        </div>
      )}

      {/* Top Media Preview Container */}
      <div className="relative w-full bg-black aspect-video overflow-hidden flex items-center justify-center">
        {isVideo ? (
          <Link href={`/posts/${post.id}`} className="relative w-full h-full block group/media">
            {hasCustomThumbnail && post.thumbnail_url ? (
              post.thumbnail_url.startsWith("data:") || post.thumbnail_url.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500"
                />
              ) : (
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover/media:scale-105 transition-transform duration-500"
                />
              )
            ) : (
              <video
                src={`${post.media_url}#t=0.001`}
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none group-hover/media:scale-105 transition-transform duration-500"
              />
            )}
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover/media:bg-black/20 flex items-center justify-center transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#9d7bf5]/90 group-hover/media:bg-[#b094fa] text-[#0b0914] flex items-center justify-center shadow-2xl transition-transform group-hover/media:scale-110">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-current text-[#9d7bf5]" />
              <span>Watch Video</span>
            </div>
          </Link>
        ) : (
          <Link href={`/posts/${post.id}`} className="relative w-full h-full block group/media">
            {post.media_url.startsWith("data:") || post.media_url.startsWith("blob:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.media_url}
                alt={post.title}
                className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500"
              />
            ) : (
              <Image
                src={post.media_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover/media:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 opacity-0 group-hover/media:opacity-100 transition-opacity">
              <ImageIcon className="w-2.5 h-2.5 text-sky-400" />
              <span>View Full Image</span>
            </div>
          </Link>
        )}

        {/* Media Type & Category Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 uppercase">
            {post.media_type === "video" ? (
              <Film className="w-3 h-3 text-rose-400" />
            ) : (
              <ImageIcon className="w-3 h-3 text-sky-400" />
            )}
            {post.media_type}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-medium text-[#c4b5fd] border border-[#9d7bf5]/30">
            {post.category}
          </span>
        </div>

        {/* Action Controls (Like & Save) on Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={handleToggleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "bg-black/60 text-white hover:text-rose-400 border border-white/10"
            }`}
            title="Like this work"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleToggleSave}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? "bg-[#9d7bf5] text-[#0b0914] shadow-md shadow-[#9d7bf5]/30"
                : "bg-black/60 text-white hover:text-[#c4b5fd] border border-white/10"
            }`}
            title="Save work"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
          </button>

          {/* Owner options (Edit / Delete) */}
          {isOwner && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-full bg-black/60 text-white hover:text-[#c4b5fd] border border-white/10 backdrop-blur-md"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-1 w-32 rounded-xl bg-[#1a1333] border border-[#372a61] p-1.5 shadow-xl z-30 space-y-1">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-white hover:bg-[#281f4a] flex items-center gap-2"
                  >
                    <Edit className="w-3 h-3 text-[#9d7bf5]" />
                    Edit Work
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(post.id)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator Profile attribution header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link
              href={`/creators/${post.creator_id}`}
              className="flex items-center gap-2 group/creator min-w-0"
            >
              {post.creator?.avatar_url ? (
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#3b2d66] shrink-0 relative">
                  <Image
                    src={post.creator.avatar_url}
                    alt={post.creator.display_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#271f43] text-[#c4b5fd] font-bold text-[10px] flex items-center justify-center shrink-0">
                  {post.creator?.display_name?.charAt(0) || "C"}
                </div>
              )}
              <span className="text-xs font-semibold text-[#c4b5fd] group-hover/creator:text-white truncate transition-colors">
                {post.creator?.display_name || "Verified Creator"}
              </span>
            </Link>

            {/* Like count indicator */}
            <span className="text-[11px] font-mono text-[#7e749e] flex items-center gap-1">
              <Heart className={`w-3 h-3 ${likesCount > 0 ? "text-rose-400 fill-rose-400/40" : ""}`} />
              {likesCount}
            </span>
          </div>

          {/* Work Title */}
          <Link href={`/posts/${post.id}`} className="block">
            <h3 className="font-bold text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-[#c4b5fd] hover:underline transition-colors">
              {post.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-1.5 text-xs text-[#9b92b6] line-clamp-2 leading-relaxed">
            {post.description}
          </p>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-[#a89ec4] bg-[#0b0914] border border-[#241c3d] px-1.5 py-0.5 rounded"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* AI Tools Used */}
          {post.ai_tools && post.ai_tools.length > 0 && (
            <div className="mt-2 text-[10px] font-mono text-[#7e749e] truncate">
              Tools: {post.ai_tools.map((t) => t.replace(/_/g, " ")).join(" · ")}
            </div>
          )}
        </div>

        {/* Card Footer: Starting Price & Message Button */}
        <div className="mt-4 pt-3 border-t border-[#221a3b] flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-[#7e749e] block leading-none">
              STARTING AT
            </span>
            <span className="text-base font-extrabold text-white mt-0.5 block">
              {formatPrice(post.price_cents, post.currency)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#16102b] hover:bg-[#20183b] border border-[#2e2354] text-[11px] font-semibold text-[#a89ec4] hover:text-white transition-colors"
              title="View details & specs"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={handleStartChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1433] hover:bg-[#251b47] border border-[#3b2d66] text-xs font-semibold text-[#c4b5fd] hover:text-white transition-colors"
              title="Message Creator directly"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#9d7bf5]" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
