"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building, CheckCircle2, Globe, Mail, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MARKETPLACE_CATEGORIES } from "@/types";

export default function ClientProfilePage() {
  const { user, updateProfile } = useAuth();

  const [companyName, setCompanyName] = useState(user?.company_name || user?.display_name || "Velvet Luxe Studio");
  const [businessCategory, setBusinessCategory] = useState(user?.business_category || "Food & Beverage");
  const [bio, setBio] = useState(user?.bio || "Prestige food & beverage brand launching seasonal campaigns.");
  const [websiteUrl, setWebsiteUrl] = useState(user?.website_url || "https://velvetluxe.co");
  const [savedSuccess, setSavedSuccess] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile({
      company_name: companyName.trim(),
      display_name: companyName.trim(),
      business_category: businessCategory,
      bio: bio.trim(),
      website_url: websiteUrl.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <Link
          href="/dashboard/client"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold text-[#8c82ab] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Client Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Business Profile
          </h1>
          <p className="mt-1 text-sm text-[#9b92b6]">
            Keep your company information updated so creators understand your industry niche and brand voice.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Business profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 rounded-3xl border border-[#271f43] bg-[#140f26] p-6 md:p-8 shadow-xl">
          {/* Company Name */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Business / Company Name *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#7e749e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
              />
            </div>
          </div>

          {/* Business Category */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Primary Business Category *
            </label>
            <select
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
            >
              {MARKETPLACE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat} className="bg-[#140f26] text-white">
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#7e749e] mt-1">
              Prismora automatically prioritizes marketplace visuals matching this category.
            </p>
          </div>

          {/* Short Bio / Description */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Short Brand Description / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell creators a little about your brand, audience, and creative aesthetic..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5] resize-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Website or Portfolio Link (Optional)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#7e749e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourbrand.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#9d7bf5] hover:bg-[#b094fa] text-[#0b0914] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-[#9d7bf5]/20"
            >
              <Save className="w-4 h-4" />
              Save Business Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
