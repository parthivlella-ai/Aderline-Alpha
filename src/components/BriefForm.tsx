"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import type {
  BrandBriefWithBrand,
  ContentType,
  AspectRatio,
  CommercialLicenseType,
  BriefStatus,
} from "@/types";

interface BriefFormProps {
  initialData?: BrandBriefWithBrand;
  isEdit?: boolean;
}

const AVAILABLE_AI_TOOLS = [
  { id: "runway_gen3", label: "Runway Gen-3 Alpha" },
  { id: "kling_ai", label: "Kling AI 1.5" },
  { id: "flux_1", label: "FLUX.1 [dev/pro]" },
  { id: "midjourney_v6", label: "Midjourney v6.1" },
  { id: "comfy_ui", label: "ComfyUI Node Pipelines" },
  { id: "luma_dream_machine", label: "Luma Dream Machine" },
  { id: "eleven_labs", label: "ElevenLabs Voiceover" },
  { id: "suno", label: "Suno AI Music" },
];

export function BriefForm({ initialData, isEdit = false }: BriefFormProps) {
  const router = useRouter();

  // Form State initialized with existing data or defaults
  const [title, setTitle] = useState(initialData?.title || "");
  const [companyName, setCompanyName] = useState(initialData?.company_name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [campaignGoals, setCampaignGoals] = useState(initialData?.campaign_goals || "");
  const [contentType, setContentType] = useState<ContentType>(
    initialData?.target_content_type || "video"
  );
  const [style, setStyle] = useState(initialData?.preferred_style || "");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialData?.preferred_aspect_ratio || "16:9"
  );
  const [commercialLicense, setCommercialLicense] = useState<CommercialLicenseType>(
    initialData?.commercial_use_requirements || "full_buyout"
  );
  const [budgetMin, setBudgetMin] = useState(
    initialData ? String(initialData.budget_min_cents / 100) : "1500"
  );
  const [budgetMax, setBudgetMax] = useState(
    initialData ? String(initialData.budget_max_cents / 100) : "3000"
  );
  const [aiTools, setAiTools] = useState<string[]>(
    initialData?.required_ai_tools || ["runway_gen3", "flux_1"]
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? initialData.deadline.slice(0, 10) : ""
  );
  const [status, setStatus] = useState<BriefStatus>(initialData?.status || "open");

  // Interaction & Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Toggle tool checkbox
  function toggleTool(toolId: string) {
    if (aiTools.includes(toolId)) {
      setAiTools(aiTools.filter((t) => t !== toolId));
    } else {
      setAiTools([...aiTools, toolId]);
    }
  }

  // Client-side quick check
  function validate() {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 3) {
      errs.title = "Campaign title is required (minimum 3 characters).";
    }
    if (!companyName.trim() || companyName.trim().length < 2) {
      errs.company_name = "Company / Agency name is required.";
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = "Brief description is required (minimum 10 characters).";
    }
    if (!campaignGoals.trim() || campaignGoals.trim().length < 5) {
      errs.campaign_goals = "Campaign objective & goals are required.";
    }
    const minVal = parseFloat(budgetMin);
    const maxVal = parseFloat(budgetMax);
    if (isNaN(minVal) || minVal < 0) {
      errs.budget_min_cents = "Minimum budget must be a positive number.";
    }
    if (isNaN(maxVal) || maxVal < 0) {
      errs.budget_max_cents = "Maximum budget must be a positive number.";
    } else if (!isNaN(minVal) && maxVal < minVal) {
      errs.budget_max_cents = "Maximum budget cannot be less than minimum budget.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      company_name: companyName,
      description,
      campaign_goals: campaignGoals,
      target_content_type: contentType,
      preferred_style: style,
      preferred_aspect_ratio: aspectRatio,
      commercial_use_requirements: commercialLicense,
      budget_min_cents: Math.round(parseFloat(budgetMin) * 100),
      budget_max_cents: Math.round(parseFloat(budgetMax) * 100),
      required_ai_tools: aiTools,
      deadline: deadline ? `${deadline}T00:00:00Z` : null,
      status,
      currency: "USD",
    };

    try {
      const url = isEdit && initialData ? `/api/briefs/${initialData.id}` : "/api/briefs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
          setServerError("Validation failed. Please correct the highlighted fields below.");
        } else {
          setServerError(data.error || "An unexpected error occurred while saving the brief.");
        }
        setIsSubmitting(false);
        return;
      }

      // Success: redirect to detail view
      const briefId = data.brief?.id || (initialData ? initialData.id : "");
      router.push(`/briefs/${briefId}`);
      router.refresh();
    } catch (err: any) {
      console.error("[Brief Submission Error]", err);
      // Retain all user input in form state!
      setServerError(
        "A network or database connection error occurred. Your entered data has been preserved; please try submitting again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Banner Alert on Server/Database Errors */}
      {serverError && (
        <div className="p-4 rounded-xl border border-rose-900/50 bg-rose-950/30 text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-rose-300 mb-0.5">Submission Error</span>
            {serverError}
          </div>
        </div>
      )}

      {/* Section 1: Campaign Identity */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          1. Campaign Identity & Commissioning Brand
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Campaign Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aura Cyber-Sedan 30s Brand Launch Teaser"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                errors.title ? "border-rose-500" : "border-zinc-800"
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Brand / Creative Agency Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Aura Automotive Labs"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                errors.company_name ? "border-rose-500" : "border-zinc-800"
              }`}
            />
            {errors.company_name && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.company_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Brief Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be created, key visual elements, mood, and creative expectations..."
            className={`w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 ${
              errors.description ? "border-rose-500" : "border-zinc-800"
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Campaign Objective & Target Goals <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={2}
            value={campaignGoals}
            onChange={(e) => setCampaignGoals(e.target.value)}
            placeholder="e.g. Drive viral engagement on YouTube pre-roll, boost pre-order waitlist..."
            className={`w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500 ${
              errors.campaign_goals ? "border-rose-500" : "border-zinc-800"
            }`}
          />
          {errors.campaign_goals && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.campaign_goals}</p>
          )}
        </div>
      </div>

      {/* Section 2: Technical & Format Specifications */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-violet-400" />
          2. Content Format, Desired Style & Aspect Ratio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Content Type <span className="text-rose-400">*</span>
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="video">Video Commercial / Spot</option>
              <option value="image">Still Image / Graphic Render</option>
              <option value="3d">3D Asset / Simulation</option>
              <option value="audio">Voiceover / Audio Soundscape</option>
              <option value="multi_modal">Multi-modal Multimedia Suite</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Format & Aspect Ratio <span className="text-rose-400">*</span>
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="16:9">16:9 (Landscape / YouTube / TV)</option>
              <option value="9:16">9:16 (Vertical / TikTok / Reels)</option>
              <option value="1:1">1:1 (Square / Feed)</option>
              <option value="4:5">4:5 (Portrait / Instagram)</option>
              <option value="21:9">21:9 (Ultrawide Cinema Scope)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Commercial-Use Rights <span className="text-rose-400">*</span>
            </label>
            <select
              value={commercialLicense}
              onChange={(e) => setCommercialLicense(e.target.value as CommercialLicenseType)}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="full_buyout">Full Commercial Buyout (Recommended)</option>
              <option value="social_media_ads">Paid Social Media Ads Only</option>
              <option value="digital_only">Digital / Web Only</option>
              <option value="broadcast">Broadcast & Television Rights</option>
              <option value="non_commercial">Portfolio Non-Commercial Only</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Desired Visual / Audio Style
          </label>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g. Futuristic hyper-realism, anamorphic flare, high-fashion editorial lighting"
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* AI Tools Selection */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-2">
            Recommended AI Tool Stack (Optional creator preferences)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {AVAILABLE_AI_TOOLS.map((tool) => (
              <label
                key={tool.id}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  aiTools.includes(tool.id)
                    ? "bg-violet-950/40 border-violet-800/60 text-white"
                    : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={aiTools.includes(tool.id)}
                  onChange={() => toggleTool(tool.id)}
                  className="rounded bg-zinc-900 border-zinc-700 text-violet-600 focus:ring-0"
                />
                <span className="truncate">{tool.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Budget & Timeline */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          3. Budget Range, Delivery Deadline & Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Minimum Budget ($ USD) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                errors.budget_min_cents ? "border-rose-500" : "border-zinc-800"
              }`}
            />
            {errors.budget_min_cents && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.budget_min_cents}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Maximum Budget ($ USD) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                errors.budget_max_cents ? "border-rose-500" : "border-zinc-800"
              }`}
            />
            {errors.budget_max_cents && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.budget_max_cents}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Target Delivery Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
            </input>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Brief Publication Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BriefStatus)}
            className="w-full md:w-64 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="open">Open (Accepting Proposals)</option>
            <option value="in_review">In Review</option>
            <option value="draft">Draft (Private)</option>
          </select>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href={isEdit && initialData ? `/briefs/${initialData.id}` : "/briefs"}
          className="px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-xs font-semibold text-white transition-colors shadow-lg shadow-violet-900/30"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEdit ? "Saving Changes..." : "Publishing Brief..."}
            </>
          ) : (
            <>{isEdit ? "Save Changes" : "Post Campaign Brief"}</>
          )}
        </button>
      </div>
    </form>
  );
}
