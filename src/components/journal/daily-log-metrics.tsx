import type { DailyLogFieldValues } from "@/lib/journal/daily-log-fields";

type DailyLogMetricsProps = {
  log: DailyLogFieldValues;
};

function formatDisplay(value: string | number | null | undefined, suffix = "") {
  if (value == null || value === "") {
    return "—";
  }
  return `${value}${suffix}`;
}

function MetricGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
        {items.map((item) => (
          <p key={item.label}>
            <span className="text-zinc-500">{item.label}: </span>
            {item.value}
          </p>
        ))}
      </div>
    </div>
  );
}

export function DailyLogMetrics({ log }: DailyLogMetricsProps) {
  return (
    <div className="mt-3 space-y-4">
      <MetricGroup
        title="Environment"
        items={[
          { label: "Temp", value: formatDisplay(log.temperature, " °C") },
          { label: "Humidity", value: formatDisplay(log.humidity, " %") },
          { label: "VPD", value: formatDisplay(log.vpd, " kPa") },
          { label: "PPFD", value: formatDisplay(log.ppfd, " µmol") },
          { label: "DLI", value: formatDisplay(log.dli, " mol") },
        ]}
      />
      <MetricGroup
        title="Nutrition"
        items={[
          { label: "EC in", value: formatDisplay(log.ec_in) },
          { label: "pH in", value: formatDisplay(log.ph_in) },
          { label: "EC runoff", value: formatDisplay(log.ec_runoff) },
          { label: "pH runoff", value: formatDisplay(log.ph_runoff) },
        ]}
      />
      <MetricGroup
        title="Irrigation"
        items={[
          { label: "Count", value: formatDisplay(log.irrigation_count) },
          { label: "Vol / event", value: formatDisplay(log.irrigation_volume_per_event, " L") },
          { label: "Runoff", value: formatDisplay(log.runoff_percent, " %") },
          { label: "Dryback", value: formatDisplay(log.dryback_percent, " %") },
        ]}
      />
      <MetricGroup
        title="Plant development"
        items={[
          { label: "Height", value: formatDisplay(log.plant_height_cm, " cm") },
          { label: "Stretch", value: formatDisplay(log.stretch_percent, " %") },
        ]}
      />
      {log.notes ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Observations
          </p>
          <p className="mt-1 text-sm text-zinc-400">{log.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
