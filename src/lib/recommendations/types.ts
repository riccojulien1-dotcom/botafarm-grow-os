export type RecommendationSeverity = "good" | "watch" | "action";

export type Recommendation = {
  severity: RecommendationSeverity;
  metric: string;
  issue: string;
  recommendation: string;
};

export type RecommendationLogInput = {
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
  dryback_percent: number | null;
  vpd: number | null;
  ppfd: number | null;
};

export const SEVERITY_RANK: Record<RecommendationSeverity, number> = {
  good: 0,
  watch: 1,
  action: 2,
};

export const SEVERITY_LABELS: Record<
  RecommendationSeverity,
  { label: string; emoji: string }
> = {
  good: { label: "GOOD", emoji: "🟢" },
  watch: { label: "WATCH", emoji: "🟡" },
  action: { label: "ACTION REQUIRED", emoji: "🔴" },
};
