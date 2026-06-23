import type { useTranslations } from "next-intl";

import { cultivationTerm } from "@/i18n/glossary";
import type { JournalV1MetricKey } from "@/lib/journal/journal-types";

type MetricTranslator = ReturnType<typeof useTranslations<"journal.metrics">>;

export function journalMetricLabel(
  t: MetricTranslator,
  key: JournalV1MetricKey,
): string {
  switch (key) {
    case "temperature":
      return t("temperature");
    case "humidity":
      return t("humidity");
    case "vpd":
      return cultivationTerm("vpd");
    case "ec_in":
      return t("ecIn", { ec: cultivationTerm("ec") });
    case "ec_runoff":
      return t("ecOut", { ec: cultivationTerm("ec") });
    case "ph_in":
      return t("phIn");
    case "ph_runoff":
      return t("phOut");
    case "irrigation_volume_per_event":
      return t("irrigation");
    case "dryback_percent":
      return cultivationTerm("dryback");
    default:
      return key;
  }
}

export function applyJournalMetricLabels<T extends { key: JournalV1MetricKey; label: string }>(
  t: MetricTranslator,
  metrics: T[],
): T[] {
  return metrics.map((metric) => ({
    ...metric,
    label: journalMetricLabel(t, metric.key),
  }));
}
