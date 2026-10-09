"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Film,
  Image as ImageIcon,
  Box,
  FileCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
} from "lucide-react";
import type { PortfolioItemRow, ContentType } from "@/types";

interface PortfolioCardProps {
  item: PortfolioItemRow;
}

function getContentTypeIcon(type: ContentType) {
  switch (type) {
    case "video":
      return <Film className="w-3.5 h-3.5 text-rose-400" />;
    case "image":
      return <ImageIcon className="w-3.5 h-3.5 text-sky-400" />;
    case "3d":
      return <Box className="w-3.5 h-3.5 text-amber-400" />;
    default:
      return <FileCode className="w-3.5 h-3.5 text-violet-400" />;
  }
}

function formatLicense(license: string) {
  const map: Record<string, string> = {
    full_buyout: "Full Commercial Buyout",
    digital_only: "Digital / Web Only",
    social_media_ads: "Paid Social Media Ads",
    broadcast: "Broadcast & Television",
    non_commercial: "Portfolio Showcase Only",
  };
  return map[license] || license.replace(/_/g, " ");
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [showWorkflow, setShowWorkflow] = useState(false);

  const isVideo = item.content_type === "video" && item.media_url.endsWith(".mp4");

  return (
    <div className="rounded-2xl border border-[#261e40] bg-[#140f26] overflow-hidden flex flex-col justify-between hover:border-[#473775] transition-all duration-300 shadow-xl shadow-black/40">
      {/* Media Player / Viewer */}
      <div className="relative bg-black w-full overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px]">
        {isVideo ? (
          <video
            src={item.media_url}
            controls
            playsInline
            preload="metadata"
            poster={item.thumbnail_url || undefined}
            className="w-full h-auto max-h-[360px] object-contain"
          />
        ) : (
          <div className="relative w-full h-64">
            <Image
              src={item.media_url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-[11px] font-medium text-white border border-zinc-800">
            {getContentTypeIcon(item.content_type)}
            <span className="capitalize">{item.content_type}</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-zinc-800">
            {item.aspect_ratio}
          </span>
        </div>

        {item.is_featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded bg-violet-600/90 backdrop-blur-md text-[10px] font-semibold text-white tracking-wide uppercase">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Item Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-white text-base leading-snug">
            {item.title}
          </h4>

          {item.description && (
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* AI Tools Used */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-zinc-500 font-medium mr-1">
              AI Tools:
            </span>
            {item.ai_tools_used.map((tool) => (
              <span
                key={tool}
                className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60"
              >
                {tool.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {/* Commercial License Terms */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-[11px]">
              License: {formatLicense(item.commercial_rights_granted)}
            </span>
          </div>
        </div>

        {/* Workflow & Generation Parameters Accordion */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setShowWorkflow(!showWorkflow)}
            className="w-full flex items-center justify-between text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Workflow & Prompt Parameters
            </span>
            {showWorkflow ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showWorkflow && (
            <div className="mt-3 space-y-2.5 text-xs bg-zinc-950 p-3.5 rounded-lg border border-zinc-800">
              {item.workflow_breakdown && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                    Production Pipeline:
                  </span>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-[11px]">
                    {item.workflow_breakdown}
                  </p>
                </div>
              )}

              {item.generation_parameters &&
                Object.keys(item.generation_parameters).length > 0 && (
                  <div className="pt-2 border-t border-zinc-900">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                      Generation Metadata:
                    </span>
                    <pre className="text-[10px] font-mono text-zinc-400 bg-zinc-900 p-2 rounded overflow-x-auto">
                      {JSON.stringify(item.generation_parameters, null, 2)}
                    </pre>
                  </div>
                )}

              <div className="pt-2 border-t border-zinc-900 flex justify-end">
                <a
                  href={item.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                >
                  Open Original Asset
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
