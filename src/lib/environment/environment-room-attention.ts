import type { EnvironmentMetricSnapshot } from "@/lib/environment/build-environment-metrics";
import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import type { SupervisionMetricStatus } from "@/lib/environment/metric-insights";

const METRIC_STATUS_RANK: Record<SupervisionMetricStatus, number> = {
  action: 0,
  drift: 1,
  watch: 2,
  optimal: 3,
  no_data: 4,
};

const SNAPSHOT_STATUS_RANK: Record<string, number> = {
  above_target: 0,
  below_target: 0,
  no_target: 2,
  on_target: 3,
  no_data: 4,
};

export function pickPrimarySupervisionMetric(
  metrics: SupervisionMetric[],
): SupervisionMetric | null {
  const candidates = metrics
    .filter((metric) => metric.status !== "optimal" && metric.status !== "no_data")
    .sort(
      (left, right) => METRIC_STATUS_RANK[left.status] - METRIC_STATUS_RANK[right.status],
    );

  return candidates[0] ?? null;
}

export function pickPrimarySnapshotMetric(
  metrics: EnvironmentMetricSnapshot[],
): EnvironmentMetricSnapshot | null {
  const candidates = metrics
    .filter((metric) => metric.status !== "on_target" && metric.status !== "no_data")
    .sort(
      (left, right) =>
        (SNAPSHOT_STATUS_RANK[left.status] ?? 5) - (SNAPSHOT_STATUS_RANK[right.status] ?? 5),
    );

  return candidates[0] ?? null;
}

export function describeSupervisionMetricIssue(metric: SupervisionMetric): string {
  if (metric.status === "action") {
    if (metric.current != null && metric.targetLabel.includes("–")) {
      const parts = metric.targetLabel.match(/([\d.]+)\s*–\s*([\d.]+)/);
      if (parts) {
        const max = Number(parts[2]);
        const min = Number(parts[1]);
        if (metric.current > max) {
          return `${metric.label} is ${metric.currentDisplay} — above ${metric.targetDisplay.replace(/^Target /, "")}`;
        }
        if (metric.current < min) {
          return `${metric.label} is ${metric.currentDisplay} — below ${metric.targetDisplay.replace(/^Target /, "")}`;
        }
      }
    }
    return `${metric.label} is ${metric.currentDisplay} — outside target`;
  }

  if (metric.trendLabel === "Increasing" && metric.previousDisplay !== "—") {
    return `${metric.label} rose from ${metric.previousDisplay} to ${metric.currentDisplay}`;
  }
  if (metric.trendLabel === "Decreasing" && metric.previousDisplay !== "—") {
    return `${metric.label} dropped from ${metric.previousDisplay} to ${metric.currentDisplay}`;
  }

  if (metric.status === "drift" || metric.status === "watch") {
    return `${metric.label} at ${metric.currentDisplay} — ${metric.trendLabel.toLowerCase()}`;
  }

  return `${metric.label} at ${metric.currentDisplay}`;
}

export function describeSnapshotMetricIssue(metric: EnvironmentMetricSnapshot): string {
  if (metric.status === "above_target" || metric.status === "below_target") {
    const direction = metric.status === "above_target" ? "above" : "below";
    return `${metric.label} is ${metric.currentLabel} — ${direction} target (${metric.targetLabel})`;
  }

  if (metric.trendLabel === "Increasing" || metric.trendLabel === "Decreasing") {
    return `${metric.label} is ${metric.currentLabel} — ${metric.trendLabel.toLowerCase()}`;
  }

  return `${metric.label} is ${metric.currentLabel}`;
}

export function getSupervisionRoomAttentionReason(
  hasJournalEntries: boolean,
  roomStatus: "good" | "watch" | "drift" | "action" | "no_data",
  metrics: SupervisionMetric[],
): string | null {
  if (!hasJournalEntries) {
    return "Not enough readings — add a journal log";
  }
  if (roomStatus === "good") {
    return "All metrics within target";
  }

  const primary = pickPrimarySupervisionMetric(metrics);
  return primary ? describeSupervisionMetricIssue(primary) : "Review climate and irrigation";
}
