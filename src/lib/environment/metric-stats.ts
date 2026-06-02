export type MetricTrend = "rising" | "falling" | "stable" | "unknown";

export type TargetStatus = "on_target" | "above_target" | "below_target" | "no_data" | "no_target";

export function computeSeriesStats(values: number[]) {
  if (!values.length) {
    return { min: null, max: null, avg: null };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return { min, max, avg };
}

export function computeTrend(values: number[]): { trend: MetricTrend; label: string } {
  if (values.length < 2) {
    return { trend: "unknown", label: "Insufficient data" };
  }

  const last = values[values.length - 1];
  const previous = values[values.length - 2];
  const delta = last - previous;
  const threshold = Math.max(Math.abs(previous) * 0.02, 0.05);

  if (Math.abs(delta) <= threshold) {
    return { trend: "stable", label: "Stable" };
  }
  if (delta > 0) {
    return { trend: "rising", label: "Rising" };
  }
  return { trend: "falling", label: "Falling" };
}

export function evaluateTargetStatus(
  value: number | null,
  range: { min: number; max: number } | null,
): { status: TargetStatus; label: string } {
  if (value == null) {
    return { status: "no_data", label: "No data" };
  }
  if (!range) {
    return { status: "no_target", label: "Tracking" };
  }
  if (value < range.min) {
    return { status: "below_target", label: "Below target" };
  }
  if (value > range.max) {
    return { status: "above_target", label: "Above target" };
  }
  return { status: "on_target", label: "On target" };
}

export function formatMetricValue(value: number | null, decimals = 2): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  const rounded = Number(value.toFixed(decimals));
  return String(rounded);
}
