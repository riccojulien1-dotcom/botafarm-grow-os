import Link from "next/link";

import type { KnowledgeEntrySummary } from "@/lib/knowledge-base/types";

type KnowledgeEntryCardProps = {
  entry: KnowledgeEntrySummary;
};

export function KnowledgeEntryCard({ entry }: KnowledgeEntryCardProps) {
  return (
    <li>
      <Link
        href={`/dashboard/knowledge/${entry.id}`}
        className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-fuchsia-500/50 hover:bg-zinc-900/80"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-fuchsia-900/50 bg-fuchsia-950/30 px-2 py-0.5 text-xs text-fuchsia-200">
            {entry.category}
          </span>
          <span className="text-xs text-zinc-500">
            {entry.phaseRelevance.join(" · ")}
          </span>
        </div>
        <h3 className="mt-2 font-medium text-white">{entry.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{entry.shortExplanation}</p>
        <p className="mt-2 text-xs text-zinc-500">
          Metrics: {entry.relatedMetrics.join(", ")}
        </p>
      </Link>
    </li>
  );
}
