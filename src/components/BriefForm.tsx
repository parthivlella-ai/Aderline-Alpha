"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Wrench,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import type {
  BrandBriefWithBrand,
  ContentType,
  AspectRatio,
  CommercialLicenseType,
  BriefStatus,
} from "@/types";
import { createBrief, updateBrief } from "@/lib/services/briefs";

interface BriefFormProps {
  initialData?: BrandBriefWithBrand;
  isEdit?: boolean;
}

const CONTENT_TYPE_PILLS: { value: ContentType; label: string }[] = [
  { value: "video", label: "AI Film" },
  { value: "image", label: "Product Visual" },
  { value: "3d", label: "3D Simulation" },
  { value: "multi_modal", label: "Social Graphics" },
  { value: "audio", label: "Sound & Audio" },
];

const STYLE_PRESETS = [
  "Surreal",
  "Cinematic",
  "Minimal",
  "Playful",
  "Futuristic Photorealism",
  "Cyberpunk Anime",
];

const ASPECT_RATIO_PILLS: { value: AspectRatio; label: string }[] = [
  { value: "9:16", label: "9:16 Vertical" },
  { value: "16:9", label: "16:9 Widescreen" },
  { value: "1:1", label: "1:1 Square" },
  { value: "21:9", label: "21:9 Anamorphic" },
  { value: "4:5", label: "4:5 Social" },
];

const COMMERCIAL_USE_OPTIONS: { value: CommercialLicenseType; label: string }[] = [
  { value: "full_buyout", label: "Full Buyout & Resale" },
  { value: "social_media_ads", label: "Paid Campaign & Ads" },
  { value: "digital_only", label: "Organic Digital Only" },
  { value: "broadcast", label: "Broadcast & Streaming" },
];

const POPULAR_AI_TOOLS = [
  { id: "runway_gen3", label: "Runway Gen-3" },
  { id: "kling_ai", label: "Kling 1.5" },
  { id: "flux_1", label: "FLUX.1 [dev]" },
  { id: "midjourney_v6", label: "Midjourney v6.1" },
  { id: "comfy_ui", label: "ComfyUI" },
  { id: "eleven_labs", label: "ElevenLabs" },
];

export function BriefForm({ initialData, isEdit = false }: BriefFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [companyName, setCompanyName] = useState(initialData?.company_name || "");
  const [description, setDescription] = useState(
    initialData?.description ||
      "A surreal launch film for a new sneaker—liquid chrome, neon-lit desert, bold energy. 15 seconds for social."
  );
  const [campaignGoals, setCampaignGoals] = useState(
    initialData?.campaign_goals ||
      "Drive global viral awareness and conversion for Q4 product launch across YouTube and TikTok."
  );
  const [contentType, setContentType] = useState<ContentType>(
    initialData?.target_content_type || "video"
  );
  const [style, setStyle] = useState(
    initialData?.preferred_style || "Surreal"
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialData?.preferred_aspect_ratio || "9:16"
  );
  const [commercialLicense, setCommercialLicense] = useState<CommercialLicenseType>(
    initialData?.commercial_use_requirements || "social_media_ads"
  );
  const [budgetMin, setBudgetMin] = useState(
    initialData ? String(initialData.budget_min_cents / 100) : "2500"
  );
  const [budgetMax, setBudgetMax] = useState(
    initialData ? String(initialData.budget_max_cents / 100) : "5000"
  );
  const [aiTools, setAiTools] = useState<string[]>(
    initialData?.required_ai_tools || ["runway_gen3", "flux_1"]
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? initialData.deadline.slice(0, 10) : ""
  );
  const [status, setStatus] = useState<BriefStatus>(initialData?.status || "open");

  // Errors & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // AI-Assisted Brief Builder State
  const [roughIdea, setRoughIdea] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDraftMeta, setAiDraftMeta] = useState<{
    licensingReasoning: string;
    providerUsed: string;
  } | null>(null);

  async function handleGenerateAi() {
    if (!roughIdea.trim()) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch("/api/briefs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: roughIdea.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.draft) {
        const errorMsg =
          data.error ||
          (data.errors ? data.errors.join(", ") : "AI service returned an unexpected response.");
        setAiError(errorMsg);
        return;
      }

      const draft = data.draft;

      // Populate editable fields with AI structured draft
      setTitle(draft.title || title);
      setDescription(draft.description || roughIdea);
      setCampaignGoals(draft.campaign_goals || campaignGoals);
      if (draft.target_content_type) setContentType(draft.target_content_type);
      if (draft.preferred_style) setStyle(draft.preferred_style);
      if (draft.preferred_aspect_ratio) setAspectRatio(draft.preferred_aspect_ratio);
      if (draft.commercial_use_requirements) setCommercialLicense(draft.commercial_use_requirements);
      if (draft.suggested_budget_min_cents) {
        setBudgetMin(String(draft.suggested_budget_min_cents / 100));
      }
      if (draft.suggested_budget_max_cents) {
        setBudgetMax(String(draft.suggested_budget_max_cents / 100));
      }
      if (Array.isArray(draft.suggested_ai_tools) && draft.suggested_ai_tools.length > 0) {
        setAiTools(draft.suggested_ai_tools);
      }

      setAiDraftMeta({
        licensingReasoning:
          draft.licensing_reasoning ||
          "Conservative commercial rights assigned. No broad IP buyout was silently assumed.",
        providerUsed: data.isFallback ? "Prismora Heuristic Engine" : draft.provider_used || "AI Assistant",
      });

      // Clear any previous field errors since fields are now structured
      setErrors({});
    } catch (err: any) {
      setAiError(
        "Network connection or AI service timeout. Manual brief editing remains fully available."
      );
    } finally {
      setIsGeneratingAi(false);
    }
  }

  // Toggle tool
  function toggleTool(toolId: string) {
    if (aiTools.includes(toolId)) {
      setAiTools(aiTools.filter((t) => t !== toolId));
    } else {
      setAiTools([...aiTools, toolId]);
    }
  }

  // Validate
  function validate() {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 3) {
      errs.title = "Campaign title is required (minimum 3 characters).";
    }
    if (!companyName.trim() || companyName.trim().length < 2) {
      errs.company_name = "Company / Agency name is required.";
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = "Creative brief idea description is required (min 10 chars).";
    }
    if (!campaignGoals.trim() || campaignGoals.trim().length < 5) {
      errs.campaign_goals = "Campaign objective & goals are required.";
    }
    if (!style.trim()) {
      errs.preferred_style = "Preferred visual style is required.";
    }

    const min = parseFloat(budgetMin);
    const max = parseFloat(budgetMax);
    if (isNaN(min) || min < 0) {
      errs.budget_min_cents = "Please provide a valid minimum budget.";
    }
    if (isNaN(max) || max < 0) {
      errs.budget_max_cents = "Please provide a valid maximum budget.";
    }
    if (!isNaN(min) && !isNaN(max) && max < min) {
      errs.budget_max_cents = "Maximum budget cannot be less than minimum budget.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Handle Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        company_name: companyName.trim(),
        description: description.trim(),
        campaign_goals: campaignGoals.trim(),
        target_content_type: contentType,
        preferred_style: style.trim(),
        preferred_aspect_ratio: aspectRatio,
        commercial_use_requirements: commercialLicense,
        budget_min_cents: Math.round(parseFloat(budgetMin) * 100),
        budget_max_cents: Math.round(parseFloat(budgetMax) * 100),
        required_ai_tools: aiTools,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        status,
      };

      if (isEdit && initialData) {
        const result = await updateBrief(initialData.id, payload);
        if (!result.success || !result.brief) {
          setServerError(
            result.errors
              ? Object.values(result.errors)[0]
              : "Failed to update brief."
          );
          setIsSubmitting(false);
          return;
        }
        router.push(`/briefs/${initialData.id}`);
      } else {
        const result = await createBrief(payload);
        if (!result.success || !result.brief) {
          setServerError(
            result.errors
              ? Object.values(result.errors)[0]
              : "Failed to create brief."
          );
          setIsSubmitting(false);
          return;
        }
        router.push(`/briefs/${result.brief.id}`);
      }
    } catch (err: any) {
      setServerError(err?.message || "Unexpected submission error.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-950/30 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Two Column Layout (Figma Screen 03 Template) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Brief Progress & Agency Guidance */}
        <div className="lg:col-span-4 space-y-5">
          {/* Stepper Card */}
          <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-6 shadow-xl shadow-black/40">
            <span className="text-[11px] font-mono tracking-widest text-[#7e749e] uppercase font-semibold block mb-4">
              YOUR BRIEF
            </span>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#251d3d] border border-[#9d7bf5]/50 text-white font-medium text-xs shadow-sm">
                <span className="w-5 h-5 rounded-full bg-[#9d7bf5] text-[#0b0914] font-bold flex items-center justify-center text-[10px]">
                  01
                </span>
                <span>The idea</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#8f85ad] text-xs">
                <span className="w-5 h-5 rounded-full bg-[#1e1736] text-[#7e749e] font-semibold flex items-center justify-center text-[10px]">
                  02
                </span>
                <span>Content & style</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#8f85ad] text-xs">
                <span className="w-5 h-5 rounded-full bg-[#1e1736] text-[#7e749e] font-semibold flex items-center justify-center text-[10px]">
                  03
                </span>
                <span>Format & delivery</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#8f85ad] text-xs">
                <span className="w-5 h-5 rounded-full bg-[#1e1736] text-[#7e749e] font-semibold flex items-center justify-center text-[10px]">
                  04
                </span>
                <span>Rights & usage</span>
              </div>
            </div>
          </div>

          {/* Agency Brief Protection Box */}
          <div className="rounded-2xl border border-[#302552] bg-[#17112c] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-bold text-[#c4b5fd]">
              <Sparkles className="w-3.5 h-3.5 text-[#9d7bf5]" />
              AGENCY BRIEF
            </div>
            <p className="mt-2 text-xs text-[#9b92b6] leading-relaxed">
              We'll suggest missing details, required LoRA parameters, and key commercial rights protection before dispatching to directors.
            </p>
          </div>

          {/* Budget Range Box */}
          <div className="rounded-2xl border border-[#271f43] bg-[#140f26] p-5">
            <span className="text-[11px] font-mono tracking-wider text-[#7e749e] uppercase font-semibold block mb-3">
              BUDGET RANGE (USD)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#9b92b6] font-mono uppercase block mb-1">
                  Min ($)
                </label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="2500"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
                />
                {errors.budget_min_cents && (
                  <p className="text-[10px] text-red-400 mt-1">{errors.budget_min_cents}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#9b92b6] font-mono uppercase block mb-1">
                  Max ($)
                </label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
                />
                {errors.budget_max_cents && (
                  <p className="text-[10px] text-red-400 mt-1">{errors.budget_max_cents}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Interactive Brief Builder (Figma Screen 03 Card) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#271f43] bg-[#140f26] p-6 sm:p-8 space-y-7 shadow-2xl shadow-black/50">
          
          {/* AI-Assisted Brief Builder Section */}
          <div className="rounded-2xl border border-[#392b63] bg-gradient-to-br from-[#1a1336] to-[#110d24] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c4b5fd]" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#c4b5fd] uppercase">
                  AI-Assisted Brief Builder
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#7e749e] px-2 py-0.5 rounded bg-[#0b0914] border border-[#271f43]">
                Server-Side Gemini & Heuristic Fallback
              </span>
            </div>

            <p className="text-xs text-[#9b92b6] leading-relaxed mb-3">
              Enter your rough campaign idea below. Prismora's server-side engine will generate an editable structured draft without inventing commercial rights.
            </p>

            <div className="space-y-3">
              <textarea
                id="ai-rough-idea-input"
                rows={3}
                value={roughIdea}
                onChange={(e) => setRoughIdea(e.target.value)}
                placeholder="e.g. A 15-second cinematic cyberpunk teaser for an electric hypercar. Heavy neon reflections, synth soundtrack, high-energy cuts for Instagram reels."
                className="w-full p-3.5 rounded-xl bg-[#0b0914] border border-[#2d2252] text-xs text-white placeholder-[#685e87] focus:outline-none focus:ring-1 focus:ring-[#9d7bf5] transition-colors"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[10px] text-[#7e749e] font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9d7bf5]" />
                  Licensing safeguard active: Rights never silently escalated to buyout.
                </span>

                <button
                  id="ai-generate-button"
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi || !roughIdea.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-40 text-[#0b0914] font-bold text-xs transition-all shadow-md shadow-[#9d7bf5]/20 shrink-0"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Structuring Draft...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Structured Draft ✨
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Success / Draft Review Banner */}
          {aiDraftMeta && (
            <div
              id="ai-draft-banner"
              className="p-4 rounded-xl border border-[#9d7bf5]/50 bg-[#251d3d]/90 text-white text-xs space-y-2 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#c4b5fd]">
                  <CheckCircle2 className="w-4 h-4 text-[#9d7bf5]" />
                  <span>Structured Draft Ready ({aiDraftMeta.providerUsed})</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#140f26] border border-[#403369] px-2 py-0.5 rounded text-[#a79bc8]">
                  Editable Draft
                </span>
              </div>
              <div className="text-[#d8cff5] text-xs bg-[#150f28] p-3 rounded-lg border border-[#3b2d61] leading-relaxed">
                <strong className="text-white">Commercial Rights Transparency: </strong>
                {aiDraftMeta.licensingReasoning}
              </div>
              <p className="text-[11px] text-[#9b92b6]">
                All draft fields have been populated below. You can review, refine, or edit any detail before submitting.
              </p>
            </div>
          )}

          {/* AI Error / Fallback Alert (Non-blocking) */}
          {aiError && (
            <div
              id="ai-error-banner"
              className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-200 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-amber-300">
                  AI Service Notice (Manual Brief Creation Active)
                </div>
                <p className="text-amber-200/90">{aiError}</p>
                <p className="text-[11px] text-amber-200/70">
                  Manual brief entry remains 100% operational. Feel free to fill out the fields directly below.
                </p>
              </div>
            </div>
          )}

          {/* Section Subtitle */}
          <div>
            <span className="text-[11px] font-mono tracking-wider text-[#7e749e] uppercase font-semibold">
              START WITH YOUR IDEA
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white tracking-tight">
              What do you want to create?
            </h2>
          </div>

          {/* Prompt / Idea Large Textarea */}
          <div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A surreal launch film for a new sneaker—liquid chrome, neon-lit desert, bold energy. 15 seconds for social."
              className={`w-full p-4 rounded-xl bg-[#0b0914] border text-sm text-white placeholder-[#685e87] focus:outline-none focus:ring-1 focus:ring-[#9d7bf5] leading-relaxed transition-colors ${
                errors.description ? "border-red-500" : "border-[#271f43] focus:border-[#9d7bf5]"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Campaign Title & Company Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-1.5">
                Campaign Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nebula Zero 60s Launch Spot"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border text-xs text-white focus:outline-none ${
                  errors.title ? "border-red-500" : "border-[#271f43] focus:border-[#9d7bf5]"
                }`}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-1.5">
                Company / Agency *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Creative Agency"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border text-xs text-white focus:outline-none ${
                  errors.company_name ? "border-red-500" : "border-[#271f43] focus:border-[#9d7bf5]"
                }`}
              />
              {errors.company_name && (
                <p className="text-xs text-red-400 mt-1">{errors.company_name}</p>
              )}
            </div>
          </div>

          {/* Campaign Goals Field */}
          <div>
            <label className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-1.5">
              Campaign Objective & Target Audience *
            </label>
            <input
              type="text"
              value={campaignGoals}
              onChange={(e) => setCampaignGoals(e.target.value)}
              placeholder="e.g. Drive 10M viral impressions across TikTok and YouTube Pre-roll"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border text-xs text-white focus:outline-none ${
                errors.campaign_goals ? "border-red-500" : "border-[#271f43] focus:border-[#9d7bf5]"
              }`}
            />
            {errors.campaign_goals && (
              <p className="text-xs text-red-400 mt-1">{errors.campaign_goals}</p>
            )}
          </div>

          {/* 1. Content Type Pill Selector */}
          <div>
            <span className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-2.5">
              CONTENT TYPE
            </span>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPE_PILLS.map((pill) => {
                const isSelected = contentType === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setContentType(pill.value)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#2d2252] border border-[#9d7bf5] text-white shadow-sm shadow-[#9d7bf5]/30 font-semibold"
                        : "bg-[#0b0914] border border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Visual Direction / Style Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold">
                VISUAL DIRECTION
              </span>
              <span className="text-[10px] text-[#7e749e] font-mono">Custom or Preset</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {STYLE_PRESETS.map((preset) => {
                const isSelected = style.toLowerCase() === preset.toLowerCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setStyle(preset)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#2d2252] border border-[#9d7bf5] text-white shadow-sm font-semibold"
                        : "bg-[#0b0914] border border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Or specify nuanced visual aesthetic..."
              className={`w-full px-3.5 py-2 rounded-xl bg-[#0b0914] border text-xs text-white focus:outline-none ${
                errors.preferred_style ? "border-red-500" : "border-[#271f43] focus:border-[#9d7bf5]"
              }`}
            />
            {errors.preferred_style && (
              <p className="text-xs text-red-400 mt-1">{errors.preferred_style}</p>
            )}
          </div>

          {/* 3. Delivery Format / Aspect Ratio */}
          <div>
            <span className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-2.5">
              DELIVERY FORMAT
            </span>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIO_PILLS.map((pill) => {
                const isSelected = aspectRatio === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setAspectRatio(pill.value)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#2d2252] border border-[#9d7bf5] text-white shadow-sm shadow-[#9d7bf5]/30 font-semibold"
                        : "bg-[#0b0914] border border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Commercial Use Rights */}
          <div>
            <span className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-2.5">
              COMMERCIAL USE
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMERCIAL_USE_OPTIONS.map((opt) => {
                const isSelected = commercialLicense === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCommercialLicense(opt.value)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#2d2252] border border-[#9d7bf5] text-white shadow-sm shadow-[#9d7bf5]/30 font-semibold"
                        : "bg-[#0b0914] border border-[#271f43] text-[#9b92b6] hover:border-[#3d3163] hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#9d7bf5]" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Tools Preference */}
          <div>
            <span className="block text-xs font-mono tracking-wider text-[#9b92b6] uppercase font-semibold mb-2.5">
              REQUIRED AI TOOLCHAINS (OPTIONAL)
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AI_TOOLS.map((tool) => {
                const isSelected = aiTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#2d2252] border border-[#9d7bf5] text-white font-semibold"
                        : "bg-[#0b0914] border border-[#271f43] text-[#7e749e] hover:border-[#3d3163] hover:text-white"
                    }`}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-[#221a3b] flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/briefs"
              className="text-xs font-medium text-[#7e749e] hover:text-white transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-50 text-[#0b0914] font-bold text-sm transition-all shadow-lg shadow-[#9d7bf5]/20 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0b0914]" />
                  Saving Brief...
                </>
              ) : (
                <>
                  {isEdit ? "Update Campaign Brief →" : "Save and publish brief →"}
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </form>
  );
}
