import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BriefForm } from "@/components/BriefForm";

export const metadata = {
  title: "Post a Campaign Brief | Prismora",
  description: "Create and publish a brand campaign brief for generative AI creators.",
};

export default function NewBriefPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link
          href="/briefs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Campaign Briefs
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/40 text-violet-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          Commission AI Talent
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Create Campaign Brief
        </h1>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-2xl">
          Specify your campaign requirements, style direction, format, aspect ratio,
          budget range, and commercial licensing terms to attract qualified generative creators.
        </p>
      </div>

      {/* Brief Form */}
      <BriefForm />
    </div>
  );
}
