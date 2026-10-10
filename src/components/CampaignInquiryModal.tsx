"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  Film,
  Image as ImageIcon,
  DollarSign,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrCreateConversation, sendMessage } from "@/lib/services/marketplace";
import type { ContentType, AspectRatio, CommercialLicenseType } from "@/types";

interface CampaignInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
  creatorHandle?: string;
  creatorAvatar?: string;
  workContextTitle?: string;
}

export function CampaignInquiryModal({
  isOpen,
  onClose,
  creatorId,
  creatorName,
  creatorHandle,
  creatorAvatar,
  workContextTitle,
}: CampaignInquiryModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [campaignTitle, setCampaignTitle] = useState(
    workContextTitle ? `Commission: ${workContextTitle}` : "Custom Generative AI Campaign"
  );
  const [campaignGoals, setCampaignGoals] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType>("video");
  const [style, setStyle] = useState("Cinematic Photorealism, Neon & Chromatic Reflections");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [commercialLicense, setCommercialLicense] =
    useState<CommercialLicenseType>("social_media_ads");
  const [budget, setBudget] = useState("650");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!campaignGoals.trim() || campaignGoals.trim().length < 5) {
      setError("Please outline your campaign objective (min 5 characters).");
      return;
    }

    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError("Please specify a valid budget amount.");
      return;
    }

    setIsSubmitting(true);

    try {
      const budgetCents = Math.round(budgetNum * 100);

      // 1. Create compliant campaign brief record
      try {
        await fetch("/api/briefs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_name: user.company_name || user.display_name || "Client Partner",
            title: campaignTitle.trim(),
            description:
              description.trim() ||
              `Campaign requirements inquiry for ${creatorName}. Objective: ${campaignGoals.trim()}`,
            campaign_goals: campaignGoals.trim(),
            target_content_type: contentType,
            preferred_style: style.trim(),
            preferred_aspect_ratio: aspectRatio,
            commercial_use_requirements: commercialLicense,
            budget_min_cents: budgetCents,
            budget_max_cents: Math.round(budgetCents * 1.25),
            currency: "USD",
          }),
        });
      } catch (err) {
        console.warn("[Prismora] Brief record creation warning:", err);
      }

      // 2. Open or create direct conversation with creator
      const conv = await getOrCreateConversation(user.id, creatorId, {
        display_name: creatorName,
        handle: creatorHandle,
        avatar_url: creatorAvatar,
      });

      // 3. Format and send campaign requirement message
      const inquiryMessage = `✦ CAMPAIGN INQUIRY & BRIEF SPECIFICATIONS ✦\n• Title: ${campaignTitle}\n• Objective: ${campaignGoals}\n• Format: ${contentType.toUpperCase()} (${aspectRatio})\n• Style: ${style}\n• Commercial Rights: ${commercialLicense.replace(/_/g, " ")}\n• Target Budget: $${budgetNum.toLocaleString()}\n\nCould you review these requirements and confirm turnaround feasibility?`;

      await sendMessage(conv.id, user.id, inquiryMessage);

      setIsSubmitting(false);
      onClose();

      // 4. Navigate directly to conversation
      router.push(
        `/messages?creatorId=${encodeURIComponent(creatorId)}&creatorName=${encodeURIComponent(
          creatorName
        )}&postTitle=${encodeURIComponent(campaignTitle)}`
      );
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Failed to submit campaign inquiry.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-[#2e2354] bg-[#140f26] p-6 sm:p-8 shadow-2xl shadow-black/80 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1e163b] hover:bg-[#281f4c] text-[#8c82ab] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#271d47] border border-[#3f2e6e] text-[#c4b5fd] text-[11px] font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#9d7bf5]" />
            <span>Direct Campaign Commission</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Commission {creatorName}
          </h2>
          <p className="text-xs text-[#9b92b6] mt-1 leading-relaxed">
            Enter your campaign requirements below. Prismora packages this into a compliant commercial brief and delivers it straight to the creator.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campaign Objective */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1 font-medium">
              Campaign Objective / Deliverable Goals *
            </label>
            <textarea
              required
              rows={2}
              value={campaignGoals}
              onChange={(e) => setCampaignGoals(e.target.value)}
              placeholder="e.g. 15s high-energy social ad showcasing product liquid splash with 4K turnaround..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-xs text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5] transition-colors resize-none"
            />
          </div>

          {/* Content Type & Aspect Ratio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1 font-medium">
                Content Type *
              </label>
              <div className="flex rounded-xl bg-[#0b0914] border border-[#271f43] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setContentType("video")}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
                    contentType === "video" ? "bg-[#281e4a] text-white" : "text-[#7e749e]"
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("image")}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
                    contentType === "image" ? "bg-[#281e4a] text-white" : "text-[#7e749e]"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  Image
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1 font-medium">
                Aspect Ratio *
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0914] border border-[#271f43] text-xs text-white focus:outline-none focus:border-[#9d7bf5]"
              >
                <option value="16:9" className="bg-[#140f26]">16:9 Landscape (TV / Web)</option>
                <option value="9:16" className="bg-[#140f26]">9:16 Vertical (Reels / TikTok)</option>
                <option value="1:1" className="bg-[#140f26]">1:1 Square (Feed)</option>
                <option value="4:5" className="bg-[#140f26]">4:5 Vertical Portrait</option>
                <option value="21:9" className="bg-[#140f26]">21:9 Ultrawide Cinema</option>
              </select>
            </div>
          </div>

          {/* Visual Style & Aesthetic */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1 font-medium">
              Preferred Visual Style
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g. Moody twilight, macro liquid refraction, anamorphic flare..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-xs text-white placeholder-[#7e749e] focus:outline-none focus:border-[#9d7bf5]"
            />
          </div>

          {/* Commercial License & Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1 font-medium">
                Commercial License *
              </label>
              <select
                value={commercialLicense}
                onChange={(e) => setCommercialLicense(e.target.value as CommercialLicenseType)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0914] border border-[#271f43] text-xs text-white focus:outline-none focus:border-[#9d7bf5]"
              >
                <option value="social_media_ads" className="bg-[#140f26]">Social Media Ads</option>
                <option value="full_buyout" className="bg-[#140f26]">Full Commercial Buyout</option>
                <option value="digital_only" className="bg-[#140f26]">Digital Organic Only</option>
                <option value="broadcast" className="bg-[#140f26]">Broadcast & TV</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1 font-medium">
                Target Budget ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-[#7e749e] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0b0914] border border-[#271f43] text-xs text-white focus:outline-none focus:border-[#9d7bf5]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-50 text-[#0b0914] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#9d7bf5]/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Brief & Opening Message...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Campaign Brief & Message Creator
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
