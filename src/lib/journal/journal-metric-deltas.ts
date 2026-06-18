import type { DailyLogFieldValues } from "@/lib/journal/daily-log-fields";
import {
  JOURNAL_V1_METRICS,
  type JournalMetricDelta,
  type JournalV1MetricKey,
} from "@/lib/journal/journal-types";

function formatDelta(delta: number, unit: string): string {
  const sign = delta > 0 ? "+" : "";
  const rounded = Number.isInteger(delta) ? String(delta) : delta.toFixed(1);
  return `${sign}${rounded}${unit}`;
}

export function buildMetricDeltas(
  current: DailyLogFieldValues,
  previous: DailyLogFieldValues | null,
): JournalMetricDelta[] {
  return JOURNAL_V1_METRICS.map((metric) => {
    const currentValue = current[metric.key as JournalV1MetricKey] as number | null;
    const previousValue = previous
      ? (previous[metric.key as JournalV1MetricKey] as number | null)
      : null;

    let delta: number | null = null;
    let deltaLabel: string | null = null;

    if (currentValue != null && previousValue != null) {
      delta = Number((currentValue - previousValue).toFixed(2));
      if (delta !== 0) {
        deltaLabel = formatDelta(delta, metric.unit);
      }
    }

    return {
      key: metric.key,
      label: metric.label,
      unit: metric.unit,
      current: currentValue,
      previous: previousValue,
      delta,
      deltaLabel,
    };
  });
}

export function formatMetricValue(value: number | null, unit: string): string {
  if (value == null) {
    return "—";
  }
  const formatted = Number.isInteger(value) ? String(value) : String(value);
  return `${formatted}${unit}`;
}
