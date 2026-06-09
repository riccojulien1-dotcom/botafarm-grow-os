import {
  type EnvironmentLogTrendRow,
  type EnvironmentMetricKey,
} from "@/lib/environment/build-environment-metrics";
import {
  buildMetricInterpretation,
  buildMetricRecommendation,
  computeGrowerTrend,
  deltaDirection,
  formatDeltaSinceLastLog,
  resolveMetricSupervisionStatus,
  type SupervisionMetricStatus,
} from "@/lib/environment/metric-insights";
import {
  formatMetricReading,
  formatTargetDisplay,
} from "@/lib/environment/format-metric-display";
import { computeSeriesStats, formatMetricValue } from "@/lib/environment/metric-stats";
import {
  getEcInReference,
  getEcRunoffReference,
  getHumidityReference,
  getPhRange,
  getTemperatureReference,
  getVpdRange,
  type MetricRange,
} from "@/lib/environment/target-ranges";

export type SupervisionMetricPoint = {
  date: string;
  dateLabel: string;
  value: number;
};

export type SupervisionMetric = {
  key: EnvironmentMetricKey;
  label: string;
  unit: string;
  decimals: number;
  accent: "cyan" | "magenta";
  group: "climate" | "irrigation";
  current: number | null;
  currentDisplay: string;
  previous: number | null;
  previousDisplay: string;
  delta: number | null;
  deltaLabel: string;
  targetLabel: string;
  targetDisplay: string;
  trendLabel: string;
  status: SupervisionMetricStatus;
  statusLabel: string;
  interpretation: string;
  recommendation: string;
  series: number[];
  chartLabels: string[];
  points: SupervisionMetricPoint[];
  min: number | null;
  max: number | null;
  avg: number | null;
  minLabel: string;
  maxLabel: string;
  avgLabel: string;
  firstValue: number | null;
  latestValue: number | null;
  periodChange: number | null;
  periodChangeLabel: string;
  deltaDirection: "up" | "down" | "flat" | "none";
  deltaShortLabel: string;
};

const METRIC_CONFIGS = [
  {
    key: "temperature" as const,
    label: "Temperature",
    unit: "°C",
    accent: "cyan" as const,
    group: "climate" as const,
    decimals: 1,
    getRange: getTemperatureReference,
    pick: (row: EnvironmentLogTrendRow) => row.temperature,
  },
  {
    key: "humidity" as const,
    label: "Humidity",
    unit: "%",
    accent: "magenta" as const,
    group: "climate" as const,
    decimals: 1,
    getRange: getHumidityReference,
    pick: (row: EnvironmentLogTrendRow) => row.humidity,
  },
  {
    key: "vpd" as const,
    label: "VPD",
    unit: "kPa",
    accent: "cyan" as const,
    group: "climate" as const,
    decimals: 2,
    getRange: getVpdRange,
    pick: (row: EnvironmentLogTrendRow) => row.vpd,
  },
  {
    key: "ec_in" as const,
    label: "EC In",
    unit: "",
    accent: "cyan" as const,
    group: "irrigation" as const,
    decimals: 2,
    getRange: () => getEcInReference(),
    pick: (row: EnvironmentLogTrendRow) => row.ec_in,
  },
  {
    key: "ec_runoff" as const,
    label: "EC Out",
    unit: "",
    accent: "magenta" as const,
    group: "irrigation" as const,
    decimals: 2,
    getRange: () => getEcRunoffReference(),
    pick: (row: EnvironmentLogTrendRow) => row.ec_runoff,
  },
  {
    key: "ph_in" as const,
    label: "pH In",
    unit: "",
    accent: "cyan" as const,
    group: "irrigation" as const,
    decimals: 2,
    getRange: () => getPhRange(),
    pick: (row: EnvironmentLogTrendRow) => row.ph_in,
  },
  {
    key: "ph_runoff" as const,
    label: "pH Out",
    unit: "",
    accent: "magenta" as const,
    group: "irrigation" as const,
    decimals: 2,
    getRange: () => getPhRange(),
    pick: (row: EnvironmentLogTrendRow) => row.ph_runoff,
  },
];

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date.slice(5);
  }
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildSupervisionMetric(
  config: (typeof METRIC_CONFIGS)[number],
  trendRows: EnvironmentLogTrendRow[],
  roomStatus: string,
): SupervisionMetric {
  const range = config.getRange(roomStatus);
  const points: SupervisionMetricPoint[] = [];

  for (const row of trendRows) {
    const value = config.pick(row);
    if (value == null) {
      continue;
    }
    const date = row.log_date ?? row.logged_at.slice(0, 10);
    points.push({
      date,
      dateLabel: formatDateLabel(date),
      value,
    });
  }

  const series = points.map((point) => point.value);
  const chartLabels = points.map((point) => point.dateLabel);
  const current = series.length ? series[series.length - 1] : null;
  const previous = series.length > 1 ? series[series.length - 2] : null;
  const firstValue = series.length ? series[0] : null;
  const latestValue = current;
  const periodChange =
    firstValue != null && latestValue != null ? latestValue - firstValue : null;
  const stats = computeSeriesStats(series);
  const { label: trendLabel, isStrongMove } = computeGrowerTrend(series);
  const { status, label: statusLabel } = resolveMetricSupervisionStatus(
    current,
    range,
    trendLabel,
    isStrongMove,
  );
  const delta = current != null && previous != null ? current - previous : null;
  const deltaLabel = formatDeltaSinceLastLog(
    current,
    previous,
    config.unit,
    config.decimals,
    config.key,
  );

  const periodChangeLabel =
    periodChange == null
      ? "Not enough readings"
      : `${formatMetricReading(periodChange, config.key, config.decimals)} over logged period`;

  const direction = deltaDirection(delta);
  const deltaShortLabel =
    delta == null
      ? "Not enough readings"
      : direction === "flat"
        ? "No change since last log"
        : `${direction === "up" ? "↑" : "↓"} ${formatDeltaSinceLastLog(current, previous, config.unit, config.decimals, config.key)}`;

  return {
    key: config.key,
    label: config.label,
    unit: config.unit,
    decimals: config.decimals,
    accent: config.accent,
    group: config.group,
    current,
    currentDisplay: formatMetricReading(current, config.key, config.decimals),
    previous,
    previousDisplay: formatMetricReading(previous, config.key, config.decimals),
    delta,
    deltaLabel,
    targetLabel: range?.label ?? "—",
    targetDisplay: formatTargetDisplay(config.key, range?.label),
    trendLabel,
    status,
    statusLabel,
    interpretation: buildMetricInterpretation(
      config.label,
      status,
      trendLabel,
      range?.label ?? "—",
      deltaLabel,
    ),
    recommendation: buildMetricRecommendation({
      key: config.key,
      label: config.label,
      status,
      trendLabel,
      targetDisplay: formatTargetDisplay(config.key, range?.label),
      currentDisplay: formatMetricReading(current, config.key, config.decimals),
      previousDisplay: formatMetricReading(previous, config.key, config.decimals),
    }),
    series,
    chartLabels,
    points,
    min: stats.min,
    max: stats.max,
    avg: stats.avg,
    minLabel: formatMetricReading(stats.min, config.key, config.decimals),
    maxLabel: formatMetricReading(stats.max, config.key, config.decimals),
    avgLabel: formatMetricReading(stats.avg, config.key, config.decimals),
    firstValue,
    latestValue,
    periodChange,
    periodChangeLabel,
    deltaDirection: direction,
    deltaShortLabel,
  };
}

export function buildSupervisionMetrics(
  trendRows: EnvironmentLogTrendRow[],
  roomStatus: string,
): SupervisionMetric[] {
  return METRIC_CONFIGS.map((config) => buildSupervisionMetric(config, trendRows, roomStatus));
}

export function getMetricRangeForKey(
  key: EnvironmentMetricKey,
  roomStatus: string,
): MetricRange | null {
  const config = METRIC_CONFIGS.find((entry) => entry.key === key);
  return config ? config.getRange(roomStatus) : null;
}
