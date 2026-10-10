"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Loader2, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPostById, updateMarketplacePost } from "@/lib/services/marketplace";
import { MARKETPLACE_CATEGORIES, SUPPORTED_AI_TOOLS } from "@/types";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user, isLoading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Advertising & Commercials");
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (authLoading) return;
      if (!id) return;

      const post = await getPostById(id);
      if (!post) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      // Check ownership
      if (!user || post.creator_id !== user.id) {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      }

      setTitle(post.title);
      setDescription(post.description);
      setPrice(String(post.price_cents / 100));
      setCategory(post.category);
      setHashtagsInput(post.hashtags.join(", "));
      setSelectedTools(post.ai_tools);
      setIsLoading(false);
    }
    load();
  }, [id, user, authLoading]);

  function toggleTool(toolId: string) {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const parsedHashtags = hashtagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    try {
      await updateMarketplacePost(
        id,
        {
          title: title.trim(),
          description: description.trim(),
          price_cents: Math.round(parseFloat(price) * 100),
          category,
          hashtags: parsedHashtags,
          ai_tools: selectedTools,
        },
        user?.id
      );

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/portfolio");
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Failed to update work");
      setIsSubmitting(false);
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 text-[#9d7bf5] animate-spin" />
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-rose-900/50 bg-[#140f26] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 mx-auto mb-4 flex items-center justify-center font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-xs text-[#9b92b6] mt-2 leading-relaxed">
            You cannot edit another creator&apos;s published work. Only the verified owner can modify this post.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/portfolio"
              className="px-5 py-2 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              My Portfolio
            </Link>
            <Link
              href="/marketplace"
              className="px-5 py-2 rounded-full bg-[#1e163b] text-[#c4b5fd] text-xs font-medium border border-[#3b2d66]"
            >
              Browse Works
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-[#271f43] bg-[#140f26] p-8 text-center">
          <h2 className="text-lg font-bold text-white">Work Not Found</h2>
          <p className="text-xs text-[#9b92b6] mt-2 leading-relaxed">
            This post does not exist or may have been removed.
          </p>
          <div className="mt-5">
            <Link
              href="/portfolio"
              className="px-5 py-2 rounded-full bg-[#9d7bf5] text-[#0b0914] text-xs font-bold"
            >
              Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 px-6">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-semibold text-[#8c82ab] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Portfolio
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Published Work</h1>
          <p className="text-xs text-[#9b92b6] mt-1">
            Update pricing, category tags, or descriptions for this work.
          </p>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Changes saved successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#271f43] bg-[#140f26] p-6">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Work Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Price ($ USD)
              </label>
              <input
                type="number"
                min="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
              >
                {MARKETPLACE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat} className="bg-[#140f26] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-1.5 font-medium">
              Hashtags (comma separated)
            </label>
            <input
              type="text"
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0914] border border-[#271f43] text-sm text-white focus:outline-none focus:border-[#9d7bf5]"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#9b92b6] block mb-2 font-medium">
              AI Tools Used
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
                        : "bg-[#0b0914] text-[#8c82ab] border border-[#271f43]"
                    }`}
                  >
                    {tool.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[#9d7bf5] hover:bg-[#b094fa] disabled:opacity-50 text-[#0b0914] font-bold text-sm transition-all"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
