"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  CheckCircle2,
  SearchX,
  ChevronDown,
} from "lucide-react";
import type { CreatorWithDetails } from "@/types";
import { CreatorCard } from "@/components/CreatorCard";
import { filterCreators } from "@/lib/filters/creators";

interface CreatorDirectoryExplorerProps {
  initialCreators: CreatorWithDetails[];
  isMock?: boolean;
}

const PRIMARY_SPECIALIZATION_PILLS = [
  { value: "all", label: "All creators" },
  { value: "cinematic_video", label: "Cinematic Video" },
  { value: "product_render", label: "Product Visuals" },
  { value: "character_design", label: "Character Design" },
  { value: "vfx_composite", label: "VFX & Composite" },
  { value: "motion_graphics", label: "Motion Graphics" },
];

const AI_TOOL_OPTIONS = [
  { value: "all", label: "Tools: Any" },
  { value: "runway_gen3", label: "Runway Gen-3" },
  { value: "kling_ai", label: "Kling AI 1.5" },
  { value: "flux_1", label: "FLUX.1 [dev/pro]" },
  { value: "midjourney_v6", label: "Midjourney v6.1" },
  { value: "comfy_ui", label: "ComfyUI Pipelines" },
  { value: "eleven_labs", label: "ElevenLabs Voice" },
];

const CONTENT_TYPE_OPTIONS = [
  { value: "all", label: "Format: Any" },
  { value: "video", label: "Video Commercials" },
  { value: "image", label: "Still Keyframes" },
  { value: "3d", label: "3D Assets" },
  { value: "audio", label: "Audio & Soundscapes" },
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
      {/* Search Input Bar (Figma Screen 02 Search Capsule) */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-[#7e749e] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search creators, tools, skills, or visual styles..."
          className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-[#140f26] border border-[#271f43] text-sm text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] focus:ring-1 focus:ring-[#9d7bf5] transition-all shadow-inner"
        />

        {/* Clear query button if typed */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-20 top-1/2 -translate-y-1/2 text-[#7e749e] hover:text-white p-1"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Sort indicator badge on right edge */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="hidden sm:inline-flex items-center text-[11px] font-mono text-[#8c82ab] bg-[#1d1633] px-2.5 py-1 rounded-lg border border-[#312554]">
            Sort: Recommended
          </span>
        </div>
      </div>

      {/* Specialization Filter Pills Bar */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider text-[#7e749e] uppercase font-semibold mr-1">
            SPECIALIZATION
          </span>

          {PRIMARY_SPECIALIZATION_PILLS.map((pill) => {
            const isActive = specialization === pill.value;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => setSpecialization(pill.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#2c214d] text-white border border-[#9d7bf5] shadow-sm shadow-[#9d7bf5]/20 font-semibold"
                    : "bg-[#140f26] text-[#9b92b6] border border-[#271f43] hover:border-[#3d3163] hover:text-white"
                }`}
              >
                {pill.label}
              </button>
            );
          })}

          {/* AI Tools Dropdown Pill */}
          <div className="relative">
            <select
              value={aiTool}
              onChange={(e) => setAiTool(e.target.value)}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-medium bg-[#140f26] border cursor-pointer focus:outline-none transition-all ${
                aiTool !== "all"
                  ? "border-[#9d7bf5] text-white bg-[#2c214d]"
                  : "border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
              }`}
            >
              {AI_TOOL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#140f26] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#7e749e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Format / Content Type Dropdown Pill */}
          <div className="relative">
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-medium bg-[#140f26] border cursor-pointer focus:outline-none transition-all ${
                contentType !== "all"
                  ? "border-[#9d7bf5] text-white bg-[#2c214d]"
                  : "border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
              }`}
            >
              {CONTENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#140f26] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#7e749e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Availability Filter Toggle Pill */}
          <button
            type="button"
            onClick={() => setAvailabilityOnly(!availabilityOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
              availabilityOnly
                ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-semibold"
                : "bg-[#140f26] border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                availabilityOnly ? "bg-emerald-400" : "bg-[#7e749e]"
              }`}
            />
            Available Only
          </button>

          {/* Reset Filters Action Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1b1433] hover:bg-[#251b45] border border-[#3b2d66] text-[#c4b5fd] text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Catalog Status Bar (Matches Figma Screen 02 Stats Row) */}
      <div className="flex items-center justify-between pt-2 pb-1 border-b border-[#1c1633] text-xs">
        <div className="text-[#9b92b6]">
          <span className="font-bold text-white text-sm">
            {filteredCreators.length} creators
          </span>{" "}
          · Profiles with real workflows, not just pretty pixels.
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16102b] border border-[#2d224d] text-[#c4b5fd] text-[11px] font-mono tracking-wider uppercase font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#9d7bf5]" />
          VERIFIED DETAILS
        </div>
      </div>

      {/* Creator Cards Grid (3 Columns) */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} isMock={isMock} />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#1f1738] border border-[#34275c] flex items-center justify-center text-[#9d7bf5] mb-4">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No creators match your filters</h3>
          <p className="mt-1 text-sm text-[#8c82ab] max-w-md">
            Try adjusting your search keywords, clearing selected specializations, or expanding the AI tool criteria.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
