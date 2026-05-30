import {
  SEVERITY_LABELS,
  type RecommendationSeverity,
} from "@/lib/recommendations/types";

const severityStyles: Record<RecommendationSeverity, string> = {
  good: "border-emerald-900/50 bg-emerald-950/40 text-emerald-300",
  watch: "border-amber-900/50 bg-amber-950/40 text-amber-200",
  action: "border-red-900/50 bg-red-950/40 text-red-300",
};

type RecommendationStatusBadgeProps = {
  severity: RecommendationSeverity;
  compact?: boolean;
};

export function RecommendationStatusBadge({
  severity,
  compact = false,
}: RecommendationStatusBadgeProps) {
  const { emoji, label } = SEVERITY_LABELS[severity];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-medium ${severityStyles[severity]} ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
