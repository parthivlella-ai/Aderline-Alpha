"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function CreatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Creator Page Error]", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center flex-1 flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-6">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h1 className="text-xl font-bold text-white tracking-tight">
        Unable to Load Creator Profile
      </h1>

      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
        {error.message || "An unexpected error occurred while loading this creator."}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>

        <Link
          href="/creators"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>
      </div>
    </div>
  );
}
