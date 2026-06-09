import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";
import { formatMetricValue, type MetricTrend } from "@/lib/environment/metric-stats";
import type { MetricRange } from "@/lib/environment/target-ranges";

export type SupervisionMetricStatus = "optimal" | "watch" | "drift" | "action" | "no_data";

export type SupervisionRoomStatus = "good" | "watch" | "drift" | "action" | "no_data";

type MetricRecommendationInput = {
  key: EnvironmentMetricKey;
  label: string;
  status: SupervisionMetricStatus;
  trendLabel: string;
  targetDisplay: string;
  currentDisplay: string;
  previousDisplay: string;
};

export function computeGrowerTrend(values: number[]): {
  trend: MetricTrend;
  label: string;
  isStrongMove: boolean;
} {
  if (!values.length) {
    return {
      trend: "unknown",
      label: "Not enough readings",
      isStrongMove: false,
    };
  }
  if (values.length < 2) {
    return { trend: "unknown", label: "Not enough readings", isStrongMove: false };
  }

  const last = values[values.length - 1];
  const previous = values[values.length - 2];
  const delta = last - previous;
  const ref = Math.max(Math.abs(previous), Math.abs(last), 0.01);
  const pctChange = Math.abs(delta) / ref;

  if (pctChange <= 0.02) {
    return { trend: "stable", label: "Stable", isStrongMove: false };
  }
  if (delta > 0) {
    return {
      trend: "rising",
      label: "Increasing",
      isStrongMove: pctChange > 0.08,
    };
  }
  return {
    trend: "falling",
    label: "Decreasing",
    isStrongMove: pctChange > 0.08,
  };
}

export function deltaDirection(
  delta: number | null,
): "up" | "down" | "flat" | "none" {
  if (delta == null) {
    return "none";
  }
  if (Math.abs(delta) < 0.001) {
    return "flat";
  }
  return delta > 0 ? "up" : "down";
}

export function formatDeltaSinceLastLog(
  current: number | null,
  previous: number | null,
  unit: string,
  decimals: number,
  metricKey: EnvironmentMetricKey,
): string {
  if (current == null) {
    return "No reading on latest log";
  }
  if (previous == null) {
    return "Not enough readings";
  }

  const delta = current - previous;
  const rounded = Number(delta.toFixed(decimals));
  const sign = rounded > 0 ? "+" : "";

  if (metricKey === "temperature") {
    return `${sign}${rounded}°C since last log`;
  }
  if (metricKey === "humidity") {
    return `${sign}${rounded}% since last log`;
  }
  if (metricKey === "vpd") {
    return `${sign}${rounded} kPa since last log`;
  }
  if (metricKey === "ec_in" || metricKey === "ec_runoff") {
    return `${sign}${formatMetricValue(rounded, decimals)} EC since last log`;
  }
  if (metricKey === "ph_in" || metricKey === "ph_runoff") {
    return `${sign}${formatMetricValue(rounded, decimals)} pH since last log`;
  }
  return `${sign}${formatMetricValue(rounded, decimals)}${unit ? unit : ""} since last log`;
}

export function resolveMetricSupervisionStatus(
  current: number | null,
  range: MetricRange | null,
  trendLabel: string,
  isStrongMove: boolean,
): { status: SupervisionMetricStatus; label: string } {
  if (current == null) {
    return { status: "no_data", label: "No reading" };
  }
  if (!range) {
    return { status: "watch", label: "Watch" };
  }

  const span = range.max - range.min || 1;
  const below = current < range.min;
  const above = current > range.max;

  if (below || above) {
    const deviation = below ? range.min - current : current - range.max;
    if (deviation > span * 0.12) {
      return { status: "action", label: "Action" };
    }
    return { status: "watch", label: "Watch" };
  }

  if (trendLabel === "Increasing" || trendLabel === "Decreasing") {
    if (isStrongMove) {
      return { status: "drift", label: "Drift" };
    }
    return { status: "watch", label: "Watch" };
  }

  return { status: "optimal", label: "Good" };
}

export function buildMetricInterpretation(
  label: string,
  status: SupervisionMetricStatus,
  trendLabel: string,
  targetLabel: string,
  deltaLabel: string,
): string {
  if (status === "no_data") {
    return `${label} was not logged on your latest journal entry. Add it on your next room log.`;
  }
  if (status === "action") {
    return `${label} is outside the target range (${targetLabel}). Check the room and adjust before the next feed.`;
  }
  if (status === "drift") {
    return `${label} is still within target (${targetLabel}) but ${trendLabel.toLowerCase()}. ${deltaLabel}.`;
  }
  if (status === "watch") {
    return `${label} needs a closer look. ${deltaLabel}. Target: ${targetLabel}.`;
  }
  if (trendLabel === "Stable") {
    return `${label} is stable and within target (${targetLabel}).`;
  }
  return `${label} is within target (${targetLabel}) and ${trendLabel.toLowerCase()}. ${deltaLabel}.`;
}

export function buildMetricRecommendation(input: MetricRecommendationInput): string {
  const {
    key,
    label,
    status,
    trendLabel,
    targetDisplay,
    currentDisplay,
    previousDisplay,
  } = input;

  if (status === "no_data") {
    return `Log ${label.toLowerCase()} on your next journal entry to track this room.`;
  }

  if (key === "ec_runoff") {
    if (trendLabel === "Increasing" && previousDisplay !== "—") {
      return `${label} increased from ${previousDisplay} to ${currentDisplay}. Consider increasing runoff volume at the next feed.`;
    }
    if (status === "action") {
      return `${label} is ${currentDisplay} (${targetDisplay}). Reduce feed EC or increase runoff to bring salts back in range.`;
    }
    if (status === "drift" || status === "watch") {
      return `${label} is ${currentDisplay} and ${trendLabel.toLowerCase()}. Log runoff on the next feed and adjust irrigation if it keeps climbing.`;
    }
  }

  if (key === "ec_in") {
    if (status === "action") {
      return `${label} is ${currentDisplay} (${targetDisplay}). Adjust your nutrient strength before the next irrigation.`;
    }
    if (trendLabel === "Increasing" && previousDisplay !== "—") {
      return `${label} rose from ${previousDisplay} to ${currentDisplay}. Confirm your feed recipe matches the current growth stage.`;
    }
  }

  if (key === "ph_in" || key === "ph_runoff") {
    if (status === "action") {
      return `${label} is ${currentDisplay} (${targetDisplay}). Adjust pH up or down before the next feed and recheck runoff.`;
    }
    if (trendLabel === "Increasing" || trendLabel === "Decreasing") {
      return `${label} moved from ${previousDisplay} to ${currentDisplay}. Calibrate your pH pen and adjust the next feed.`;
    }
  }

  if (key === "vpd") {
    if (status === "action") {
      return `VPD is ${currentDisplay} (${targetDisplay}). Adjust temperature or humidity to bring VPD back into range.`;
    }
    if (trendLabel === "Increasing") {
      return `VPD rose from ${previousDisplay} to ${currentDisplay}. Check humidity and temperature before lights-on.`;
    }
    if (trendLabel === "Decreasing") {
      return `VPD dropped from ${previousDisplay} to ${currentDisplay}. Increase airflow or adjust humidity if plants look sluggish.`;
    }
  }

  if (key === "temperature") {
    if (status === "action") {
      return `Temperature is ${currentDisplay} (${targetDisplay}). Adjust HVAC or lighting offset before the next light cycle.`;
    }
    if (trendLabel === "Increasing" && previousDisplay !== "—") {
      return `Temperature rose from ${previousDisplay} to ${currentDisplay}. Check cooling/airflow before the next shift.`;
    }
  }

  if (key === "humidity") {
    if (status === "action") {
      return `Humidity is ${currentDisplay} (${targetDisplay}). Run dehumidification or humidification to stabilize the room.`;
    }
    if (trendLabel === "Increasing" && previousDisplay !== "—") {
      return `Humidity rose from ${previousDisplay} to ${currentDisplay}. Increase airflow or dehumidify before the next irrigation.`;
    }
    if (trendLabel === "Decreasing" && previousDisplay !== "—") {
      return `Humidity dropped from ${previousDisplay} to ${currentDisplay}. Add humidity if VPD is climbing too fast.`;
    }
  }

  if (status === "action") {
    return `${label} is ${currentDisplay} (${targetDisplay}). Adjust the room before the next irrigation cycle.`;
  }
  if (status === "drift" && trendLabel === "Increasing" && previousDisplay !== "—") {
    return `${label} increased from ${previousDisplay} to ${currentDisplay}. Watch the next two logs and plan an adjustment if it keeps rising.`;
  }
  if (status === "drift" && trendLabel === "Decreasing" && previousDisplay !== "—") {
    return `${label} decreased from ${previousDisplay} to ${currentDisplay}. Watch the next two logs and plan an adjustment if it keeps falling.`;
  }
  if (status === "watch") {
    return `${label} is ${currentDisplay} (${targetDisplay}). Walk the room on your next round and log again today.`;
  }
  if (trendLabel === "Stable") {
    return `No action needed. ${label} is steady at ${currentDisplay} and on target.`;
  }
  return `Log ${label.toLowerCase()} again on the next journal entry. Currently ${currentDisplay}.`;
}

const METRIC_STATUS_RANK: Record<SupervisionMetricStatus, number> = {
  action: 0,
  drift: 1,
  watch: 2,
  optimal: 3,
  no_data: 4,
};

export function resolveRoomSupervisionStatus(
  hasJournalEntries: boolean,
  metricStatuses: SupervisionMetricStatus[],
): { status: SupervisionRoomStatus; label: string; healthEmoji: string } {
  if (!hasJournalEntries) {
    return { status: "no_data", label: "Not enough readings", healthEmoji: "⚪" };
  }

  const ranked = metricStatuses
    .filter((status) => status !== "no_data")
    .sort((left, right) => METRIC_STATUS_RANK[left] - METRIC_STATUS_RANK[right]);

  const worst = ranked[0] ?? "optimal";

  if (worst === "action") {
    return { status: "action", label: "Action required", healthEmoji: "🔴" };
  }
  if (worst === "drift" || worst === "watch") {
    return { status: "watch", label: "Watch", healthEmoji: "🟡" };
  }
  return { status: "good", label: "Good", healthEmoji: "🟢" };
}
