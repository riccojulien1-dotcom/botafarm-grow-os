"use client";

import { cultivationTerm } from "@/i18n/glossary";
import type { DailyLogFieldValues } from "@/lib/journal/daily-log-fields";
import { useTranslations } from "next-intl";

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
  const tSections = useTranslations("journal.form.sections");
  const tMetrics = useTranslations("journal.metrics");
  const ec = cultivationTerm("ec");

  return (
    <div className="mt-3 space-y-4">
      <MetricGroup
        title={tSections("environment")}
        items={[
          { label: tMetrics("temperature"), value: formatDisplay(log.temperature, " °C") },
          { label: tMetrics("humidityFull"), value: formatDisplay(log.humidity, " %") },
          { label: tMetrics("vpd"), value: formatDisplay(log.vpd, " kPa") },
          { label: tMetrics("ppfd"), value: formatDisplay(log.ppfd, " µmol") },
          { label: tMetrics("dli"), value: formatDisplay(log.dli, " mol") },
        ]}
      />
      <MetricGroup
        title={tSections("nutrition")}
        items={[
          { label: tMetrics("ecIn", { ec }), value: formatDisplay(log.ec_in) },
          { label: tMetrics("phIn"), value: formatDisplay(log.ph_in) },
          { label: tMetrics("ecRunoff", { ec }), value: formatDisplay(log.ec_runoff) },
          { label: tMetrics("phOut"), value: formatDisplay(log.ph_runoff) },
        ]}
      />
      <MetricGroup
        title={tSections("irrigation")}
        items={[
          { label: tMetrics("count"), value: formatDisplay(log.irrigation_count) },
          {
            label: tMetrics("volumePerEvent"),
            value: formatDisplay(log.irrigation_volume_per_event, " L"),
          },
          { label: tMetrics("runoff"), value: formatDisplay(log.runoff_percent, " %") },
          { label: tMetrics("dryback"), value: formatDisplay(log.dryback_percent, " %") },
        ]}
      />
      <MetricGroup
        title={tSections("plantDevelopment")}
        items={[
          { label: tMetrics("height"), value: formatDisplay(log.plant_height_cm, " cm") },
          { label: tMetrics("stretch"), value: formatDisplay(log.stretch_percent, " %") },
        ]}
      />
      {log.notes ? (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {tSections("observations")}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{log.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
