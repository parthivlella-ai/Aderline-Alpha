"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Film,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Sliders,
  Share2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Scale,
  MonitorPlay,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPostById, toggleLikePost, toggleSavePost } from "@/lib/services/marketplace";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CampaignInquiryModal } from "@/components/CampaignInquiryModal";
import { SUPPORTED_AI_TOOLS } from "@/types";
import type { MarketplacePost } from "@/types";

function formatPrice(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function WorkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();

  const [post, setPost] = useState<MarketplacePost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      setIsLoading(true);
      const data = await getPostById(id, user?.id);
      if (data) {
        setPost(data);
        setIsLiked(data.is_liked || false);
        setLikesCount(data.likes_count || 0);
        setIsSaved(data.is_saved || false);
      }
      setIsLoading(false);
    }
    loadPost();
  }, [id, user?.id]);

  async function handleToggleLike() {
    if (!user) {
      router.push(`/login?redirect=/posts/${id}`);
      return;
    }
    if (!post) return;
    const res = await toggleLikePost(post.id, user.id);
    setIsLiked(res.liked);
    setLikesCount(res.likesCount);
  }

  async function handleToggleSave() {
    if (!user) {
      router.push(`/login?redirect=/posts/${id}`);
      return;
    }
    if (!post) return;
    const res = await toggleSavePost(post.id, user.id);
    setIsSaved(res.saved);
  }

  const [showInquiryModal, setShowInquiryModal] = useState(false);

  function handleStartChat() {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/messages?creatorId=${post?.creator_id}&creatorName=${post?.creator?.display_name || ""}&creatorHandle=${post?.creator?.handle || ""}&creatorAvatar=${post?.creator?.avatar_url || ""}&postTitle=${post?.title || ""}`
        )}`
      );
      return;
    }
    if (!post) return;
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

  function handleCopyShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#9d7bf5] animate-pulse" />
          <p className="text-xs font-mono text-[#9b92b6]">Loading commercial deliverable...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-[#271f43] bg-[#140f26] p-8 text-center shadow-xl">
          <AlertCircle className="w-12 h-12 text-[#7e749e] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Work Not Found</h2>
          <p className="text-xs text-[#9b92b6] mt-2 leading-relaxed">
            This portfolio post does not exist or may have been unlisted by the creator.
          </p>
          <div className="mt-5">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVideo =
    post.media_type === "video" ||
    post.media_url.endsWith(".mp4") ||
    post.media_url.includes(".mp4") ||
    post.media_url.includes(".webm") ||
    post.media_url.startsWith("blob:") ||
    post.media_url.includes("gtv-videos") ||
    post.media_url.startsWith("data:video");
  const isOwner = user?.id === post.creator_id;

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#8c82ab]">
            <Link href="/marketplace" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Marketplace
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#403366]" />
            <span className="text-[#c4b5fd] truncate max-w-[200px] sm:max-w-md">{post.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShare}
              className="px-3.5 py-1.5 rounded-full bg-[#1b1433] hover:bg-[#251b47] border border-[#3b2d66] text-xs text-[#c4b5fd] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
            {isOwner && (
              <Link
                href={`/posts/${post.id}/edit`}
                className="px-3.5 py-1.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-sm"
              >
                Edit Work
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Grid: 8 Cols Media / Left, 4 Cols Details / Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media Player & Deep Specs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Media Display */}
            <div className="rounded-3xl border border-[#271f43] bg-[#140f26] overflow-hidden p-2 shadow-2xl">
              {isVideo ? (
                <VideoPlayer
                  src={post.media_url}
                  poster={post.thumbnail_url}
                  title={post.title}
                />
              ) : (
                <div
                  onClick={() => setImageZoomed(!imageZoomed)}
                  className={`relative w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center cursor-zoom-in transition-all ${
                    imageZoomed ? "min-h-[70vh]" : "aspect-video"
                  }`}
                >
                  <Image
                    src={post.media_url}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1200px) 100vw, 800px"
                    className="object-contain"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 uppercase flex items-center gap-1 pointer-events-none">
                    <ImageIcon className="w-3 h-3 text-sky-400" />
                    High-Res Keyframe (Click to expand)
                  </div>
                </div>
              )}
            </div>

            {/* Title & Description Header */}
            <div className="rounded-3xl border border-[#271f43] bg-[#140f26] p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#271d47] border border-[#3f2e6e] text-[#c4b5fd] text-xs font-semibold">
                  {post.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] font-mono uppercase text-[#8c82ab]">
                  {post.media_type.toUpperCase()}
                </span>
                {post.resolution && (
                  <span className="px-3 py-1 rounded-full bg-[#1e1738] border border-[#392a66] text-[11px] font-mono text-[#a78bfa]">
                    {post.resolution}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {post.title}
              </h1>

              <p className="text-sm sm:text-base text-[#b8afcf] leading-relaxed whitespace-pre-line">
                {post.description}
              </p>

              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-[#a89ec4] bg-[#0b0914] border border-[#281f45] px-2.5 py-1 rounded-lg"
                    >
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Pipeline & Tools Used */}
            <div className="rounded-3xl border border-[#271f43] bg-[#140f26] p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#9b92b6] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#9d7bf5]" />
                GENERATIVE PIPELINE & AI MODELS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {post.ai_tools && post.ai_tools.length > 0 ? (
                  post.ai_tools.map((toolId) => {
                    const toolMeta = SUPPORTED_AI_TOOLS.find((t) => t.id === toolId);
                    return (
                      <div
                        key={toolId}
                        className="p-3.5 rounded-2xl border border-[#281e47] bg-[#0b0914] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {toolMeta?.name || toolId.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] font-mono text-[#7e749e] uppercase">
                            {toolMeta?.category || "Generative AI"}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                          VERIFIED STACK
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#7e749e]">No specific tools listed.</p>
                )}
              </div>

              {post.workflow && (
                <div className="mt-4 p-4 rounded-2xl bg-[#0b0914] border border-[#281e47]">
                  <span className="text-[10px] font-mono uppercase text-[#7e749e] block mb-1">
                    WORKFLOW EXECUTION PIPELINE
                  </span>
                  <p className="text-xs text-[#c4b5fd] font-mono leading-relaxed">
                    {post.workflow}
                  </p>
                </div>
              )}
            </div>

            {/* Commercial Rights & Licensing Details */}
            <div className="rounded-3xl border border-[#271f43] bg-[#140f26] p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#9b92b6] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#9d7bf5]" />
                COMMERCIAL RIGHTS & USAGE COMPLIANCE
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm font-bold text-emerald-200">
                    {post.commercial_license || "Standard Commercial Deliverable Rights Included"}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 leading-relaxed pl-7">
                  All training weights, prompt configurations, and generative outputs are authorized for enterprise commercial advertising, digital distribution, and marketing broadcasts.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Card & Creator Attribution */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            {/* Purchase / Commission Action Card */}
            <div className="rounded-3xl border border-[#271f43] bg-gradient-to-b from-[#181130] to-[#140f26] p-6 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block">
                  DELIVERABLE COMMISSION PRICE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white">
                    {formatPrice(post.price_cents, post.currency)}
                  </span>
                  <span className="text-xs font-mono text-[#8c82ab]">
                    {post.currency}
                  </span>
                </div>
                <p className="text-xs text-[#9b92b6] mt-1.5">
                  Includes native source keyframes, high-bitrate renders, and prompt lineage documentation.
                </p>
              </div>

              {/* Like & Save Quick Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#261d42]">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isLiked
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-[#0b0914] text-[#c4b5fd] border border-[#281e47] hover:border-[#423370]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400 text-rose-400" : ""}`} />
                  <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSaved
                      ? "bg-[#9d7bf5]/20 text-[#c4b5fd] border border-[#9d7bf5]/40"
                      : "bg-[#0b0914] text-[#c4b5fd] border border-[#281e47] hover:border-[#423370]"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-[#9d7bf5] text-[#9d7bf5]" : ""}`} />
                  <span>{isSaved ? "Saved" : "Save Work"}</span>
                </button>
              </div>

              {/* Commission / Message Creator CTA */}
              <button
                type="button"
                onClick={handleStartChat}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#9d7bf5]/20"
              >
                <MessageSquare className="w-4 h-4" />
                Message Creator About This Work
              </button>

              <button
                type="button"
                onClick={() => setShowInquiryModal(true)}
                className="w-full py-3 px-5 rounded-2xl bg-[#1e163b] hover:bg-[#281f4c] border border-[#3b2d66] text-[#c4b5fd] font-semibold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9d7bf5]" />
                Commission Custom Campaign Brief
              </button>
            </div>

            {/* Creator Profile Box */}
            <div className="rounded-3xl border border-[#271f43] bg-[#140f26] p-6 space-y-4 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7e749e] block">
                CREATOR SHOWCASE
              </span>

              <div className="flex items-center gap-3">
                {post.creator?.avatar_url ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#3b2d66] relative shrink-0">
                    <Image
                      src={post.creator.avatar_url}
                      alt={post.creator.display_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#281e47] text-[#c4b5fd] font-bold text-base flex items-center justify-center shrink-0">
                    {post.creator?.display_name?.charAt(0) || "C"}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="font-bold text-white text-base truncate">
                    {post.creator?.display_name || "Verified Creator"}
                  </h4>
                  <p className="text-xs font-mono text-[#9d7bf5] truncate">
                    @{post.creator?.handle || "creator"}
                  </p>
                </div>
              </div>

              {post.creator?.bio && (
                <p className="text-xs text-[#9b92b6] leading-relaxed line-clamp-3">
                  {post.creator.bio}
                </p>
              )}

              <div className="pt-2 border-t border-[#231b3d] flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Verified Commercial Creator
                </span>
                <Link
                  href={`/creators/${post.creator_id}`}
                  className="text-xs font-semibold text-[#9d7bf5] hover:text-white flex items-center gap-1 transition-colors"
                >
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Streamlined Campaign Inquiry Modal */}
      <CampaignInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        creatorId={post.creator_id}
        creatorName={post.creator?.display_name || "Verified Creator"}
        creatorHandle={post.creator?.handle}
        creatorAvatar={post.creator?.avatar_url}
        workContextTitle={post.title}
      />
    </div>
  );
}
