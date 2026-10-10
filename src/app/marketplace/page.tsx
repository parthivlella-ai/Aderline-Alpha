"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  Building,
  Film,
  Image as ImageIcon,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMarketplacePosts } from "@/lib/services/marketplace";
import { WorkCard } from "@/components/WorkCard";
import { MARKETPLACE_CATEGORIES, type MarketplacePost } from "@/types";

const POPULAR_TOOLS = [
  { value: "all", label: "All Tools" },
  { value: "runway_gen3", label: "Runway Gen-3" },
  { value: "flux_1", label: "FLUX.1" },
  { value: "midjourney_v6", label: "Midjourney v6" },
  { value: "kling_ai", label: "Kling AI" },
  { value: "comfy_ui", label: "ComfyUI" },
  { value: "luma_dream_machine", label: "Luma Dream" },
];

export default function MarketplacePage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<MarketplacePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mediaType, setMediaType] = useState<"all" | "video" | "image">("all");
  const [tool, setTool] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [activeHashtag, setActiveHashtag] = useState("all");

  // If user is client, note their business category
  const clientNiche = user?.role === "client" ? user.business_category : undefined;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await getMarketplacePosts({
        currentUserId: user?.id,
        clientBusinessCategory: clientNiche,
      });
      setPosts(data);
      setIsLoading(false);
    }
    load();
  }, [user?.id, clientNiche]);

  // Extract all unique hashtags
  const allHashtags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      p.hashtags?.forEach((tag) => set.add(tag.toLowerCase()));
    });
    return Array.from(set);
  }, [posts]);

  // Filtered posts calculation
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q)) ||
          p.ai_tools.some((t) => t.toLowerCase().includes(q)) ||
          (p.creator && p.creator.display_name.toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Hashtag
    if (activeHashtag !== "all") {
      result = result.filter((p) =>
        p.hashtags.some((h) => h.toLowerCase() === activeHashtag.toLowerCase())
      );
    }

    // Media type
    if (mediaType !== "all") {
      result = result.filter((p) => p.media_type === mediaType);
    }

    // AI Tool
    if (tool !== "all") {
      result = result.filter((p) => p.ai_tools.includes(tool));
    }

    // Price
    if (maxPrice < 1000) {
      result = result.filter((p) => p.price_cents <= maxPrice * 100);
    }

    // Prioritize client's business category if active and viewing "All"
    if (clientNiche && category === "All" && !search) {
      const nicheLower = clientNiche.toLowerCase();
      result.sort((a, b) => {
        const aMatches = a.category.toLowerCase().includes(nicheLower) ? 1 : 0;
        const bMatches = b.category.toLowerCase().includes(nicheLower) ? 1 : 0;
        return bMatches - aMatches;
      });
    }

    return result;
  }, [posts, search, category, activeHashtag, mediaType, tool, maxPrice, clientNiche]);

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    activeHashtag !== "all" ||
    mediaType !== "all" ||
    tool !== "all" ||
    maxPrice < 1000;

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setActiveHashtag("all");
    setMediaType("all");
    setTool("all");
    setMaxPrice(1000);
  }

  function handleDeletePost(deletedId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1d1633]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-widest text-[#8c82ab] uppercase font-semibold">
                AI CREATOR MARKETPLACE
              </span>
              {clientNiche && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#20183b] border border-[#3b2d66] text-[#c4b5fd] text-[10px] font-medium font-mono">
                  <Building className="w-3 h-3 text-[#9d7bf5]" />
                  Curated for {clientNiche}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Discover World-Class AI Visuals
            </h1>
            <p className="mt-1 text-sm text-[#9b92b6] max-w-2xl leading-relaxed">
              Explore verified commercial-ready video commercials, 3D simulations, and product imagery created with cutting-edge AI models.
            </p>
          </div>

          {/* Quick link for freelancers */}
          {user?.role === "freelancer" && (
            <Link
              href="/posts/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-all shadow-md shrink-0 self-start md:self-auto"
            >
              + Upload Your Work
            </Link>
          )}
        </div>

        {/* Search Bar + Filters Capsule */}
        <div className="space-y-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#7e749e] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, creator, tool (e.g. Runway, FLUX), or category..."
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-[#140f26] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e749e] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Horizontal Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MARKETPLACE_CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#2c2052] text-white border border-[#9d7bf5] font-semibold shadow-sm shadow-[#9d7bf5]/20"
                      : "bg-[#140f26] text-[#9b92b6] border border-[#271f43] hover:border-[#3d3163] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Row: Media Type, AI Tool, Price, Reset */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Media Type Filter */}
            <div className="flex items-center rounded-full bg-[#140f26] border border-[#271f43] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMediaType("all")}
                className={`px-3 py-1 rounded-full font-medium transition-colors ${
                  mediaType === "all" ? "bg-[#251d42] text-white" : "text-[#8c82ab] hover:text-white"
                }`}
              >
                All Formats
              </button>
              <button
                type="button"
                onClick={() => setMediaType("video")}
                className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 transition-colors ${
                  mediaType === "video" ? "bg-[#251d42] text-white" : "text-[#8c82ab] hover:text-white"
                }`}
              >
                <Film className="w-3 h-3 text-rose-400" />
                Videos
              </button>
              <button
                type="button"
                onClick={() => setMediaType("image")}
                className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 transition-colors ${
                  mediaType === "image" ? "bg-[#251d42] text-white" : "text-[#8c82ab] hover:text-white"
                }`}
              >
                <ImageIcon className="w-3 h-3 text-sky-400" />
                Images
              </button>
            </div>

            {/* AI Tool Dropdown */}
            <div className="relative">
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-medium bg-[#140f26] border cursor-pointer focus:outline-none transition-all ${
                  tool !== "all"
                    ? "border-[#9d7bf5] text-white bg-[#251d42]"
                    : "border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
                }`}
              >
                {POPULAR_TOOLS.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#140f26] text-white">
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#7e749e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Price Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] font-mono text-[#7e749e] mr-1">Budget:</span>
              {[350, 500, 750, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setMaxPrice(amount)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors ${
                    maxPrice === amount
                      ? "bg-[#251d42] text-[#c4b5fd] border border-[#9d7bf5]"
                      : "bg-[#140f26] text-[#8c82ab] border border-[#271f43] hover:text-white"
                  }`}
                >
                  {amount === 1000 ? "Any" : `≤$${amount}`}
                </button>
              ))}
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1b1433] hover:bg-[#251b47] border border-[#3b2d66] text-[#c4b5fd] text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>

          {/* Hashtag Quick Filters (if available) */}
          {allHashtags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#7e749e] mr-1">Trending Tags:</span>
              {allHashtags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveHashtag(activeHashtag === tag ? "all" : tag)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
                    activeHashtag === tag
                      ? "bg-[#9d7bf5] text-[#0b0914] font-bold"
                      : "bg-[#140f26] text-[#a89ec4] border border-[#271f43] hover:border-[#3f3263] hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Catalog Status Bar */}
        <div className="flex items-center justify-between pt-2 pb-1 border-b border-[#1c1633] text-xs">
          <div className="text-[#9b92b6]">
            Showing <strong className="text-white font-bold">{filteredPosts.length}</strong> works
            {category !== "All" && ` in ${category}`}
            {clientNiche && category === "All" && ` (prioritizing ${clientNiche})`}
          </div>

          <span className="text-[11px] font-mono text-[#8c82ab]">
            Matching: Category • Toolchain • Commercial Clearance
          </span>
        </div>

        {/* Works Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <WorkCard key={post.id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#1f1738] border border-[#34275c] flex items-center justify-center text-[#9d7bf5] mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No creator works match your filters</h3>
            <p className="mt-1 text-sm text-[#8c82ab] max-w-md">
              Try clearing selected categories or hashtags, broadening your budget range, or searching for other tools.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
