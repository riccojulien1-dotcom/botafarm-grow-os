import Link from "next/link";

import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import { getKnowledgeLinkForRecommendationMetric } from "@/lib/knowledge-base";
import type { Recommendation } from "@/lib/recommendations/types";

const borderStyles = {
  watch: "border-amber-900/50",
  action: "border-red-900/50",
  good: "border-emerald-900/50",
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
              className="inline-block rounded-md border border-fuchsia-800/60 bg-fuchsia-950/30 px-3 py-1.5 text-sm text-fuchsia-200 hover:border-fuchsia-500 hover:bg-fuchsia-950/50"
            >
              View in Knowledge Library
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
}
