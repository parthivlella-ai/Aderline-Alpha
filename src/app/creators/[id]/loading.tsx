export default function CreatorLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full animate-pulse flex-1">
      {/* Back button skeleton */}
      <div className="w-32 h-4 bg-zinc-800 rounded mb-6" />

      {/* Hero card skeleton */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col md:flex-row gap-6">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="w-48 h-7 bg-zinc-800 rounded" />
          <div className="w-32 h-4 bg-zinc-850 rounded" />
          <div className="w-72 h-4 bg-zinc-800 rounded" />
          <div className="w-full max-w-xl h-12 bg-zinc-850 rounded" />
        </div>
        <div className="w-full md:w-60 h-36 bg-zinc-850 rounded-xl" />
      </div>

      {/* Tech stack grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="h-48 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
        <div className="h-48 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
      </div>

      {/* Portfolio grid skeleton */}
      <div className="mt-12 space-y-4">
        <div className="w-56 h-6 bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-72 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
          <div className="h-72 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
          <div className="h-72 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
