import type { Recommendation } from "@/lib/recommendations/types";

const borderStyles = {
  watch: "border-amber-900/50",
  action: "border-red-900/50",
  good: "border-emerald-900/50",
};

const dotStyles = {
  watch: "bg-amber-400",
  action: "bg-red-400",
  good: "bg-emerald-400",
};

type RecommendationCardProps = {
  item: Recommendation;
};

export function RecommendationCard({ item }: RecommendationCardProps) {
  return (
    <li
      className={`rounded-xl border bg-zinc-950/80 p-4 ${borderStyles[item.severity]}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotStyles[item.severity]}`}
          aria-hidden
        />
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              {item.metric}
            </p>
          </div>
          <p className="font-medium text-zinc-100">{item.issue}</p>
          <p className="text-sm text-zinc-400">{item.recommendation}</p>
        </div>
      </div>
    </li>
  );
}
