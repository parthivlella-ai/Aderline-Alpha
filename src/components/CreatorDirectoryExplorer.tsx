"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Wrench,
  Layers,
  Film,
  CheckCircle2,
  Users,
  SearchX,
} from "lucide-react";
import type { CreatorWithDetails } from "@/types";
import { CreatorCard } from "@/components/CreatorCard";
import { filterCreators } from "@/lib/filters/creators";

interface CreatorDirectoryExplorerProps {
  initialCreators: CreatorWithDetails[];
  isMock?: boolean;
}

const SPECIALIZATION_OPTIONS = [
  { value: "all", label: "All Specializations" },
  { value: "cinematic_video", label: "Cinematic Video" },
  { value: "product_render", label: "Product Render" },
  { value: "character_design", label: "Character Design" },
  { value: "virtual_influencer", label: "Virtual Influencer" },
  { value: "motion_graphics", label: "Motion Graphics" },
  { value: "vfx_composite", label: "VFX Composite" },
  { value: "concept_art", label: "Concept Art" },
  { value: "voice_audio", label: "Voice / Audio" },
];

const AI_TOOL_OPTIONS = [
  { value: "all", label: "All AI Tools & Models" },
  { value: "runway_gen3", label: "Runway Gen-3 Alpha" },
  { value: "kling_ai", label: "Kling AI 1.5" },
  { value: "flux_1", label: "FLUX.1 [dev/pro]" },
  { value: "midjourney_v6", label: "Midjourney v6.1" },
  { value: "comfy_ui", label: "ComfyUI Node Pipelines" },
  { value: "luma_dream_machine", label: "Luma Dream Machine" },
  { value: "eleven_labs", label: "ElevenLabs" },
];

const CONTENT_TYPE_OPTIONS = [
  { value: "all", label: "All Portfolio Types" },
  { value: "video", label: "Video Spot / Commercial" },
  { value: "image", label: "Still Image / Render" },
  { value: "3d", label: "3D Asset / Simulation" },
  { value: "audio", label: "Voice / Soundscape" },
];

export function CreatorDirectoryExplorer({
  initialCreators,
  isMock = true,
}: CreatorDirectoryExplorerProps) {
  // Filter States
  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [aiTool, setAiTool] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  // Compute filtered creators using pure filtering engine
  const filteredCreators = useMemo(() => {
    return filterCreators(initialCreators, {
      query,
      specialization: specialization === "all" ? undefined : specialization,
      aiTool: aiTool === "all" ? undefined : aiTool,
      contentType: contentType === "all" ? undefined : contentType,
      availabilityOnly,
    });
  }, [initialCreators, query, specialization, aiTool, contentType, availabilityOnly]);

  // Check if any filter is active
  const hasActiveFilters =
    query.trim() !== "" ||
    specialization !== "all" ||
    aiTool !== "all" ||
    contentType !== "all" ||
    availabilityOnly;

  // Reset all filters action
  function handleResetFilters() {
    setQuery("");
    setSpecialization("all");
    setAiTool("all");
    setContentType("all");
    setAvailabilityOnly(false);
  }

  return (
    <div className="space-y-6">
      {/* Search Bar & Primary Filter Controls */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
        {/* Keyword Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators by name, handle, bio keywords, or pipeline tools..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              title="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Specialization Filter */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-violet-400" />
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {SPECIALIZATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* AI Tool & Model Filter */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-violet-400" />
              AI Tool / Model
            </label>
            <select
              value={aiTool}
              onChange={(e) => setAiTool(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {AI_TOOL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio Content Type Filter */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Film className="w-3 h-3 text-violet-400" />
              Portfolio Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {CONTENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors h-[38px]">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-violet-600 focus:ring-0"
              />
              <span className="text-xs text-zinc-300 font-medium">
                Available Now
              </span>
            </label>
          </div>
        </div>

        {/* Active Filter Pills Bar & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">
              Showing {filteredCreators.length} of {initialCreators.length} creators
            </span>

            {/* Active Pills */}
            {query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[11px]">
                Search: "{query}"
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {specialization !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-[11px] capitalize">
                Spec: {specialization.replace(/_/g, " ")}
                <button
                  type="button"
                  onClick={() => setSpecialization("all")}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {aiTool !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-[11px]">
                Tool: {aiTool.replace(/_/g, " ")}
                <button
                  type="button"
                  onClick={() => setAiTool("all")}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {contentType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-800/40 text-violet-300 text-[11px] capitalize">
                Type: {contentType}
                <button
                  type="button"
                  onClick={() => setContentType("all")}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {availabilityOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px]">
                Available Only
                <button
                  type="button"
                  onClick={() => setAvailabilityOnly(false)}
                  className="hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Creator Grid or Clear Empty State */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} isMock={isMock} />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30">
          <div className="w-12 h-12 rounded-xl bg-zinc-850 flex items-center justify-center text-zinc-500 mx-auto mb-3">
            <SearchX className="w-6 h-6 text-zinc-400" />
          </div>

          <h3 className="text-base font-semibold text-white">
            No creators match your search or filter combination
          </h3>

          <p className="text-xs text-zinc-400 mt-1.5 max-w-md mx-auto leading-relaxed">
            {query ? (
              <>
                No creators matched the query <span className="text-white font-medium">"{query}"</span>{" "}
                with the applied filters. Try adjusting your search term or clearing active filters.
              </>
            ) : (
              "None of our creators currently match this combination of filters. Try widening your criteria."
            )}
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters & View All Creators
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
