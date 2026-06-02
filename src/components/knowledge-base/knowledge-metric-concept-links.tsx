import Link from "next/link";

import { getAvailableMetricConcepts } from "@/lib/knowledge-base/concept-routes";

type KnowledgeMetricConceptLinksProps = {
  roomName?: string;
  compact?: boolean;
};

export function KnowledgeMetricConceptLinks({
  roomName,
  compact = false,
}: KnowledgeMetricConceptLinksProps) {
  const concepts = getAvailableMetricConcepts();

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {!compact ? (
        <div>
          <p className="bf-lab-label text-fuchsia-400/80">Botafarm expertise</p>
          <h2 className="text-lg font-bold uppercase tracking-tight text-white">
            Cultivation metrics
          </h2>
          {roomName ? (
            <p className="mt-1 text-sm text-zinc-500">{roomName} — open a concept to act</p>
          ) : null}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {concepts.map((concept) => (
          <Link
            key={concept.metricId}
            href={concept.href}
            className="group rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/15 px-3 py-3 transition hover:border-fuchsia-400/45 hover:bg-fuchsia-900/25"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-200/90 group-hover:text-fuchsia-100">
              {concept.label}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500">{concept.shortSummary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
