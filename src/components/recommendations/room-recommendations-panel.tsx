import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
import type { RecommendationLogInput } from "@/lib/recommendations/types";

type RoomRecommendationsPanelProps = {
  roomStatus: string;
  latestLog: RecommendationLogInput | null;
  logDateLabel?: string | null;
};

export function RoomRecommendationsPanel({
  roomStatus,
  latestLog,
  logDateLabel,
}: RoomRecommendationsPanelProps) {
  const summary = getRecommendationSummary(latestLog, roomStatus);

  return (
    <section className="space-y-4 rounded-xl border border-fuchsia-900/30 bg-zinc-900/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Recommendations</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Rule-based guidance from your latest daily journal entry.
            {logDateLabel ? ` Based on log: ${logDateLabel}.` : ""}
          </p>
        </div>
        <RecommendationStatusBadge severity={summary.severity} />
      </div>

      {!latestLog ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
          Add a daily journal log with EC, pH, dryback, VPD, or PPFD to receive recommendations.
        </p>
      ) : summary.activeItems.length ? (
        <ul className="space-y-3">
          {summary.activeItems.map((item) => (
            <RecommendationCard
              key={`${item.metric}-${item.issue}`}
              item={item}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-5 text-sm text-emerald-200">
          All checked metrics look good. Keep monitoring daily.
        </p>
      )}
    </section>
  );
}
