export default function BriefLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full animate-pulse flex-1">
      {/* Back button skeleton */}
      <div className="w-32 h-4 bg-zinc-800 rounded mb-6" />

      {/* Main card skeleton */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-6">
        <div className="space-y-3">
          <div className="w-24 h-4 bg-zinc-850 rounded" />
          <div className="w-3/4 h-8 bg-zinc-800 rounded" />
          <div className="w-40 h-4 bg-zinc-850 rounded" />
        </div>

        <div className="space-y-2 pt-4">
          <div className="w-48 h-5 bg-zinc-800 rounded" />
          <div className="w-full h-16 bg-zinc-850 rounded-xl" />
        </div>

        <div className="space-y-2 pt-2">
          <div className="w-48 h-5 bg-zinc-800 rounded" />
          <div className="w-full h-24 bg-zinc-850 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="h-20 bg-zinc-950/60 rounded-xl" />
          <div className="h-20 bg-zinc-950/60 rounded-xl" />
          <div className="h-20 bg-zinc-950/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
