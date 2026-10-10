"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Globe, Sparkles, Save, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SUPPORTED_AI_TOOLS } from "@/types";

export default function FreelancerProfilePage() {
  const { user, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.display_name || "Aetheris Studios");
  const [handle, setHandle] = useState(user?.handle || "aetheris");
  const [bio, setBio] = useState(
    user?.bio || "Next-generation cinematic AI commercial director specializing in photorealistic luxury & fashion executions."
  );
  const [websiteUrl, setWebsiteUrl] = useState(user?.website_url || "https://aetheris.art");
  const [skillsInput, setSkillsInput] = useState(
    user?.skills ? user.skills.join(", ") : "Cinematic Direction, Prompt Engineering, Color Grading, Commercial VFX"
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(
    user?.primary_ai_tools || ["runway_gen3", "flux_1", "comfy_ui"]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  function toggleTool(toolId: string) {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await updateProfile({
      display_name: displayName.trim(),
      handle: handle.trim().toLowerCase(),
      bio: bio.trim(),
      website_url: websiteUrl.trim(),
      skills: skillsArray,
      primary_ai_tools: selectedTools,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <Link
          href="/dashboard/freelancer"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold text-[#8c82ab] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Creator Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Creator Profile & Capabilities
          </h1>
          <p className="mt-1 text-sm text-[#9b92b6]">
            Highlight your AI pipeline, hardware capabilities, and creative specializations for clients.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 rounded-3xl border border-[#271f43] bg-[#140f26] p-6 md:p-8 shadow-xl">
          {/* Display Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Studio / Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Handle *
              </label>
              <div className="relative">
                <span className="text-xs text-[#7e749e] absolute left-3 top-1/2 -translate-y-1/2 font-mono">@</span>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Creator Bio & Direction Style *
            </label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5] resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Key Skills & Specializations (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Cinematic Direction, Prompt Engineering, Color Grading"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
            />
          </div>

          {/* AI Tools Used */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-2 font-medium">
              Primary AI Tools & Pipelines
            </label>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_AI_TOOLS.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#9d7bf5] text-[#0b0914] font-bold"
                        : "bg-[#0b0914] text-[#8c82ab] border border-[#271f43] hover:text-white"
                    }`}
                  >
                    {tool.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Portfolio / Website Link
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#7e749e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
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
              Save Creator Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
