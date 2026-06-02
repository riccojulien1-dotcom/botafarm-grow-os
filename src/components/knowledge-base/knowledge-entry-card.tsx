import Link from "next/link";

import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base";
import type { KnowledgeEntrySummary } from "@/lib/knowledge-base/types";

type KnowledgeEntryCardProps = {
  entry: KnowledgeEntrySummary;
};

const priorityStyles = {
  low: "text-zinc-500",
  medium: "text-amber-200/90",
  high: "text-red-300/90",
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
            {entry.category}
          </span>
          <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            {KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]}
          </span>
          <span className={`text-xs uppercase ${priorityStyles[entry.priority]}`}>
            {entry.priority}
          </span>
        </div>
        <h3 className="mt-2 font-medium text-white">{entry.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{entry.shortSummary}</p>
        <p className="mt-2 font-mono text-[10px] text-fuchsia-400/70">
          Ref {entry.sourceReference.internalReferenceId}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Phases: {entry.phaseRelevance.join(" · ")}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Metrics: {entry.relatedMetrics.join(", ")}
        </p>
        {entry.tags.length ? (
          <p className="mt-1 text-xs text-zinc-600">Tags: {entry.tags.join(" · ")}</p>
        ) : null}
      </Link>
    </li>
  );
}
