import { EnvironmentMetricTile } from "@/components/environment/environment-metric-tile";
import type {
  EnvironmentMetricKey,
  EnvironmentMetricSnapshot,
} from "@/lib/environment/get-environment-intelligence";

const CLIMATE_KEYS: EnvironmentMetricKey[] = ["temperature", "humidity", "vpd"];
const IRRIGATION_ROW_KEYS: EnvironmentMetricKey[] = ["ec_in", "ec_runoff", "ph_in"];
const IRRIGATION_FULL_KEYS: EnvironmentMetricKey[] = ["ph_runoff"];

type EnvironmentMetricsGridProps = {
  metrics: EnvironmentMetricSnapshot[];
  compact?: boolean;
  showChart?: boolean;
};

function metricMap(metrics: EnvironmentMetricSnapshot[]) {
  return new Map(metrics.map((metric) => [metric.key, metric]));
}

function GroupLabel({ children }: { children: string }) {
  return (
    <p className="bf-lab-label border-b border-white/[0.06] pb-2 text-zinc-500">{children}</p>
  );
}

export function EnvironmentMetricsGrid({
  metrics,
  compact = false,
  showChart = false,
}: EnvironmentMetricsGridProps) {
  const byKey = metricMap(metrics);

  const climate = CLIMATE_KEYS.map((key) => byKey.get(key)).filter(
    (metric): metric is EnvironmentMetricSnapshot => metric != null,
  );
  const irrigationRow = IRRIGATION_ROW_KEYS.map((key) => byKey.get(key)).filter(
    (metric): metric is EnvironmentMetricSnapshot => metric != null,
  );
  const irrigationFull = IRRIGATION_FULL_KEYS.map((key) => byKey.get(key)).filter(
    (metric): metric is EnvironmentMetricSnapshot => metric != null,
  );

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      <div className="space-y-2">
        <GroupLabel>Climate</GroupLabel>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {climate.map((metric) => (
            <EnvironmentMetricTile
              key={metric.key}
              metric={metric}
              compact={compact}
              showChart={showChart}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <GroupLabel>Irrigation</GroupLabel>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {irrigationRow.map((metric) => (
            <EnvironmentMetricTile
              key={metric.key}
              metric={metric}
              compact={compact}
              showChart={showChart}
            />
          ))}
        </div>
        {irrigationFull.map((metric) => (
          <EnvironmentMetricTile
            key={metric.key}
            metric={metric}
            compact={compact}
            showChart={showChart}
          />
        ))}
      </div>
    </div>
  );
}
