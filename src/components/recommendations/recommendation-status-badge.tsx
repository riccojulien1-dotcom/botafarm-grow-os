import {
  SEVERITY_LABELS,
  type RecommendationSeverity,
} from "@/lib/recommendations/types";

const severityStyles: Record<RecommendationSeverity, string> = {
  good: "border-cyan-500/30 bg-cyan-950/30 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.15)]",
  watch: "border-fuchsia-500/30 bg-fuchsia-950/30 text-fuchsia-200 shadow-[0_0_12px_rgba(232,121,249,0.12)]",
  action: "border-red-500/40 bg-red-950/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
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
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono font-medium uppercase tracking-wide ${severityStyles[severity]} ${
        compact ? "text-[10px]" : "text-xs"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
