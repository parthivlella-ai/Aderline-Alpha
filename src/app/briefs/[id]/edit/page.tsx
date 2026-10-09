import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import { getBriefById } from "@/lib/services/briefs";
import { BriefForm } from "@/components/BriefForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBriefPage({ params }: PageProps) {
  const { id } = await params;
  const { data: brief } = await getBriefById(id);

  if (!brief) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/briefs/${brief.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Brief View
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/40 text-violet-300 text-xs font-medium mb-3">
          <Edit3 className="w-3.5 h-3.5 text-violet-400" />
          Edit Campaign Brief
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Modify Campaign Requirements
        </h1>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-2xl">
          Update your creative guidelines, budget parameters, target deliverables, or deadline.
          Changes will persist in your database.
        </p>
      </div>

      {/* Form with pre-populated data */}
      <BriefForm initialData={brief} isEdit={true} />
    </div>
  );
}
