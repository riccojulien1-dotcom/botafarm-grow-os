import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";

export type ChartMetricKey =
  | "temperature"
  | "humidity"
  | "vpd"
  | "ppfd"
  | "dli"
  | "ec_in"
  | "ec_runoff"
  | "ph_in"
  | "ph_runoff"
  | "dryback_percent"
  | "runoff_percent"
  | "plant_height_cm"
  | "stretch_percent";

export type ChartPoint = {
  date: string;
  label: string;
  value: number;
};

export function resolveLogDate(log: Pick<DailyLogRecord, "log_date" | "logged_at">) {
  if (log.log_date) {
    return log.log_date;
  }
  return new Date(log.logged_at).toISOString().slice(0, 10);
}

function formatChartLabel(isoDate: string) {
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function compareLogDates(
  left: Pick<DailyLogRecord, "log_date" | "logged_at">,
  right: Pick<DailyLogRecord, "log_date" | "logged_at">,
) {
  return resolveLogDate(left).localeCompare(resolveLogDate(right));
}

export function buildMetricSeries(
  logs: DailyLogRecord[],
  metric: ChartMetricKey,
): ChartPoint[] {
  return logs
    .slice()
    .sort(compareLogDates)
    .map((log) => {
      const rawValue = log[metric];
      if (rawValue == null || Number.isNaN(Number(rawValue))) {
        return null;
      }

      const date = resolveLogDate(log);
      return {
        date,
        label: formatChartLabel(date),
        value: Number(rawValue),
      };
    })
    .filter((point): point is ChartPoint => point !== null);
}

export type ChartMetricConfig = {
  key: ChartMetricKey;
  title: string;
  unit?: string;
  color: string;
};

export const CHART_SECTIONS: { title: string; metrics: ChartMetricConfig[] }[] = [
  {
    title: "Environment",
    metrics: [
      { key: "temperature", title: "Temperature", unit: "°C", color: "#f472b6" },
      { key: "humidity", title: "Humidity", unit: "%", color: "#c084fc" },
      { key: "vpd", title: "VPD", unit: "kPa", color: "#a78bfa" },
      { key: "ppfd", title: "PPFD", unit: "µmol", color: "#818cf8" },
      { key: "dli", title: "DLI", unit: "mol", color: "#60a5fa" },
    ],
  },
  {
    title: "Nutrition",
    metrics: [
      { key: "ec_in", title: "EC In", color: "#34d399" },
      { key: "ec_runoff", title: "EC Runoff", color: "#2dd4bf" },
      { key: "ph_in", title: "pH In", color: "#4ade80" },
      { key: "ph_runoff", title: "pH Runoff", color: "#a3e635" },
    ],
  },
  {
    title: "Irrigation",
    metrics: [
      { key: "dryback_percent", title: "Dryback", unit: "%", color: "#38bdf8" },
      { key: "runoff_percent", title: "Runoff", unit: "%", color: "#22d3ee" },
    ],
  },
  {
    title: "Plant development",
    metrics: [
      { key: "plant_height_cm", title: "Height", unit: "cm", color: "#fb923c" },
      { key: "stretch_percent", title: "Stretch", unit: "%", color: "#fbbf24" },
    ],
  },
];
