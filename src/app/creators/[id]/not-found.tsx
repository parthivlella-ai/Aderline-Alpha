import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";

export default function CreatorNotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center flex-1 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
        <UserX className="w-8 h-8 text-rose-400" />
      </div>

      <h1 className="text-2xl font-bold text-white tracking-tight">
        Creator Profile Not Found
      </h1>

      <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-md">
        The creator ID or handle you are looking for does not exist in our directory or has been removed.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/creators"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Browse Creators Directory
        </Link>
      </div>
    </div>
  );
}
