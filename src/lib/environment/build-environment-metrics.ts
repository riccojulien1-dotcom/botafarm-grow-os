import { formatMetricReading } from "@/lib/environment/format-metric-display";
import {
  computeSeriesStats,
  computeTrend,
  evaluateTargetStatus,
  formatMetricValue,
  type MetricTrend,
  type TargetStatus,
} from "@/lib/environment/metric-stats";
import {
  getEcInReference,
  getEcRunoffReference,
  getHumidityReference,
  getPhRange,
  getTemperatureReference,
  getVpdRange,
  type MetricRange,
} from "@/lib/environment/target-ranges";

export type EnvironmentMetricKey =
  | "temperature"
  | "humidity"
  | "vpd"
  | "ec_in"
  | "ec_runoff"
  | "ph_in"
  | "ph_runoff";

export type EnvironmentMetricSnapshot = {
  key: EnvironmentMetricKey;
  label: string;
  unit: string;
  accent: "cyan" | "magenta";
  current: number | null;
  currentLabel: string;
  targetLabel: string;
  status: TargetStatus;
  statusLabel: string;
  trend: MetricTrend;
  trendLabel: string;
  series: number[];
  chartLabels: string[];
  min: number | null;
  max: number | null;
  avg: number | null;
  minLabel: string;
  maxLabel: string;
  avgLabel: string;
};

export type EnvironmentLogTrendRow = {
  log_date: string | null;
  logged_at: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
};

function buildMetric(
  config: {
    key: EnvironmentMetricKey;
    label: string;
    unit: string;
    accent: "cyan" | "magenta";
    decimals?: number;
    getRange: (status: string) => MetricRange | null;
    pick: (row: EnvironmentLogTrendRow) => number | null;
  },
  trendRows: EnvironmentLogTrendRow[],
  roomStatus: string,
): EnvironmentMetricSnapshot {
  const series = trendRows
    .map((row) => config.pick(row))
    .filter((value): value is number => value != null);
  const current = series.length ? series[series.length - 1] : null;
  const range = config.getRange(roomStatus);
  const stats = computeSeriesStats(series);
  const trend = computeTrend(series);
  const status = evaluateTargetStatus(
    current,
    range ? { min: range.min, max: range.max } : null,
  );

  return {
    key: config.key,
    label: config.label,
    unit: config.unit,
    accent: config.accent,
    current,
    currentLabel: formatMetricReading(current, config.key, config.decimals ?? 2),
    targetLabel: range?.label ?? "—",
    status: status.status,
    statusLabel: current == null ? "No data" : status.label,
    trend: trend.trend,
    trendLabel: trend.label,
    series,
    chartLabels: trendRows.map((row) =>
      (row.log_date ?? row.logged_at.slice(0, 10)).slice(5),
    ),
    min: stats.min,
    max: stats.max,
    avg: stats.avg,
    minLabel: formatMetricValue(stats.min, config.decimals ?? 2),
    maxLabel: formatMetricValue(stats.max, config.decimals ?? 2),
    avgLabel: formatMetricValue(stats.avg, config.decimals ?? 2),
  };
}

const METRIC_BUILDERS = [
  {
    key: "temperature" as const,
    label: "Temperature",
    unit: "°C",
    accent: "cyan" as const,
    decimals: 1,
    getRange: getTemperatureReference,
    pick: (row: EnvironmentLogTrendRow) => row.temperature,
  },
  {
    key: "humidity" as const,
    label: "Humidity",
    unit: "%",
    accent: "magenta" as const,
    decimals: 1,
    getRange: getHumidityReference,
    pick: (row: EnvironmentLogTrendRow) => row.humidity,
  },
  {
    key: "vpd" as const,
    label: "VPD",
    unit: "kPa",
    accent: "cyan" as const,
    decimals: 2,
    getRange: getVpdRange,
    pick: (row: EnvironmentLogTrendRow) => row.vpd,
  },
  {
    key: "ec_in" as const,
    label: "EC In",
    unit: "",
    accent: "cyan" as const,
    decimals: 2,
    getRange: getEcInReference,
    pick: (row: EnvironmentLogTrendRow) => row.ec_in,
  },
  {
    key: "ec_runoff" as const,
    label: "EC Out",
    unit: "",
    accent: "magenta" as const,
    decimals: 2,
    getRange: getEcRunoffReference,
    pick: (row: EnvironmentLogTrendRow) => row.ec_runoff,
  },
  {
    key: "ph_in" as const,
    label: "pH In",
    unit: "",
    accent: "cyan" as const,
    decimals: 2,
    getRange: getPhRange,
    pick: (row: EnvironmentLogTrendRow) => row.ph_in,
  },
  {
    key: "ph_runoff" as const,
    label: "pH Out",
    unit: "",
    accent: "magenta" as const,
    decimals: 2,
    getRange: getPhRange,
    pick: (row: EnvironmentLogTrendRow) => row.ph_runoff,
  },
];

export function buildEnvironmentMetrics(
  trendRows: EnvironmentLogTrendRow[],
  roomStatus: string,
): EnvironmentMetricSnapshot[] {
  return METRIC_BUILDERS.map((config) => buildMetric(config, trendRows, roomStatus));
}
