import Link from "next/link";

import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import { getKnowledgeLinkForRecommendationMetric } from "@/lib/knowledge-base";
import type { Recommendation } from "@/lib/recommendations/types";

const borderStyles = {
  watch: "border-fuchsia-500/30 bg-fuchsia-950/10",
  action: "border-red-500/40 bg-red-950/15",
  good: "border-cyan-500/20 bg-cyan-950/10",
};

type RecommendationCardProps = {
  item: Recommendation;
};

export function RecommendationCard({ item }: RecommendationCardProps) {
  const knowledgeLink = getKnowledgeLinkForRecommendationMetric(item.metric);

  return (
    <li
      className={`rounded-xl border bg-zinc-950/80 p-4 ${borderStyles[item.severity]}`}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <RecommendationStatusBadge severity={item.severity} compact />
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            {item.metric}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-zinc-100">{item.issue}</p>
          <p className="text-sm text-zinc-400">{item.recommendation}</p>
        </div>

        {knowledgeLink ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 space-y-2">
            <p className="text-xs font-medium text-fuchsia-200/90">
              {knowledgeLink.title}
            </p>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Why it matters
              </p>
              <p className="mt-1 text-sm text-zinc-400">{knowledgeLink.shortSummary}</p>
            </div>
            <Link
                href={`/dashboard/knowledge/${knowledgeLink.entryId}`}
                className="inline-block rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-sm text-cyan-200 transition hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]"
              >
              View in Knowledge Library
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
}
