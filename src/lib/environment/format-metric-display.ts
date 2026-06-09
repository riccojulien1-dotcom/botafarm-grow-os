import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";
import { formatMetricValue } from "@/lib/environment/metric-stats";

export function formatMetricReading(
  value: number | null,
  key: EnvironmentMetricKey,
  decimals: number,
): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }

  const formatted = formatMetricValue(value, decimals);

  switch (key) {
    case "temperature":
      return `${formatted}°C`;
    case "humidity":
      return `${formatted}%`;
    case "vpd":
      return `${formatted} kPa`;
    case "ec_in":
    case "ec_runoff":
      return `${formatted} EC`;
    case "ph_in":
    case "ph_runoff":
      return `${formatted} pH`;
    default:
      return formatted;
  }
}

export function formatTargetDisplay(
  key: EnvironmentMetricKey,
  targetLabel: string | null | undefined,
): string {
  if (!targetLabel || targetLabel === "—") {
    return "Target not set for this room phase";
  }

  return `Target ${normalizeTargetLabel(key, targetLabel)}`;
}

function normalizeTargetLabel(key: EnvironmentMetricKey, label: string): string {
  const compact = label.replace(/\s+/g, "").replace(/–/g, "–");

  switch (key) {
    case "temperature":
      return compact.includes("°C") ? compact : `${compact}°C`;
    case "humidity":
      return compact.includes("%") ? compact : `${compact}%`;
    case "vpd":
      return compact.includes("kPa") ? compact : `${compact} kPa`;
    case "ec_in":
    case "ec_runoff":
      return compact.includes("EC") ? compact : `${compact} EC`;
    case "ph_in":
    case "ph_runoff":
      return compact.includes("pH") ? compact : `${compact} pH`;
    default:
      return label;
  }
}
