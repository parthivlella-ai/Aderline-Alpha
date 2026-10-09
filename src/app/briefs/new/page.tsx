import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BriefForm } from "@/components/BriefForm";

export const metadata = {
  title: "AI Brief Builder | Prismora",
  description:
    "Turn a spark into a creative brief. Tell us the rough idea. Prismora helps structure the details.",
};

export default function NewBriefPage() {
  return (
    <div className="flex-1 w-full bg-[#0b0914] min-h-[calc(100vh-4rem)] py-8 md:py-12 px-6">
      <div className="max-w-6xl mx-auto w-full">
        {/* Breadcrumb Header (Matches Figma Screen 03) */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#8c82ab] uppercase font-semibold">
            <Link
              href="/briefs"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              BRIEFS
            </Link>
            <span className="text-[#473b66]">/</span>
            <span className="text-[#c4b5fd]">AI-ASSISTED BRIEF BUILDER</span>
          </div>
        </div>

        {/* Page Title & Subtitle */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Turn a spark into <br />
            a creative brief.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#9b92b6] leading-relaxed">
            Tell us the rough idea. Prismora helps structure the details — your vision stays in control.
          </p>
        </div>

        {/* Interactive Brief Builder Form Component */}
        <BriefForm />
      </div>
    </div>
  );
}
