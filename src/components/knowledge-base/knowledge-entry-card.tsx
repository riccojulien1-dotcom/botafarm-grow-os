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
        className="bf-glass bf-glass-shine bf-interactive block rounded-2xl p-5 transition hover:border-fuchsia-500/35"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-fuchsia-900/50 bg-fuchsia-950/30 px-2 py-0.5 text-xs text-fuchsia-200">
            {entry.topic}
          </span>
          <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
            {entry.subcategory}
          </span>
        </div>
        <h3 className="mt-2 font-medium text-white">{entry.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{entry.shortSummary}</p>
        <p className="mt-2 text-xs text-zinc-500">
          Phases: {entry.phaseRelevance.join(" · ")}
        </p>
      </Link>
    </li>
  );
}
