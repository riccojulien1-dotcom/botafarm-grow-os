import { EnvironmentMetricTile } from "@/components/environment/environment-metric-tile";
import type {
  EnvironmentMetricKey,
  EnvironmentMetricSnapshot,
} from "@/lib/environment/get-environment-intelligence";

const CLIMATE_KEYS: EnvironmentMetricKey[] = ["temperature", "humidity", "vpd"];
const IRRIGATION_KEYS: EnvironmentMetricKey[] = [
  "ec_in",
  "ec_runoff",
  "ph_in",
  "ph_runoff",
];

type EnvironmentMetricsGridProps = {
  metrics: EnvironmentMetricSnapshot[];
  variant?: "cockpit" | "deck";
};

function metricMap(metrics: EnvironmentMetricSnapshot[]) {
  return new Map(metrics.map((metric) => [metric.key, metric]));
}

function CockpitSectionHeader({
  title,
  accent,
}: {
  title: string;
  accent: "cyan" | "magenta";
}) {
  const line =
    accent === "cyan"
      ? "from-cyan-500/50 via-cyan-500/20"
      : "from-fuchsia-500/50 via-fuchsia-500/20";
  const text = accent === "cyan" ? "text-cyan-400/90" : "text-fuchsia-400/90";

  return (
    <div className="flex items-center gap-3">
      <div className={`h-px flex-1 bg-gradient-to-r ${line} to-transparent`} />
      <p className={`font-mono text-[10px] uppercase tracking-[0.28em] ${text}`}>{title}</p>
      <div className={`h-px flex-1 bg-gradient-to-l ${line} to-transparent`} />
    </div>
  );
}

export function EnvironmentMetricsGrid({
  metrics,
  variant = "cockpit",
}: EnvironmentMetricsGridProps) {
  const byKey = metricMap(metrics);

  const climate = CLIMATE_KEYS.map((key) => byKey.get(key)).filter(
    (metric): metric is EnvironmentMetricSnapshot => metric != null,
  );
  const irrigation = IRRIGATION_KEYS.map((key) => byKey.get(key)).filter(
    (metric): metric is EnvironmentMetricSnapshot => metric != null,
  );

  const gap = variant === "cockpit" ? "gap-2 sm:gap-2.5" : "gap-3 sm:gap-4";

  return (
    <div className={variant === "cockpit" ? "space-y-3" : "space-y-5"}>
      <div className="space-y-2">
        <CockpitSectionHeader title="Climate" accent="cyan" />
        <div className={`grid grid-cols-3 ${gap}`}>
          {climate.map((metric) => (
            <EnvironmentMetricTile key={metric.key} metric={metric} variant={variant} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <CockpitSectionHeader title="Irrigation" accent="magenta" />
        <div className={`grid grid-cols-2 ${gap}`}>
          {irrigation.map((metric) => (
            <EnvironmentMetricTile key={metric.key} metric={metric} variant={variant} />
          ))}
        </div>
      </div>
    </div>
  );
}
