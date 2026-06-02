import { getKnowledgeEntryById } from "@/lib/knowledge-base/catalog";

/** Room / environment metrics → primary Brain concept entry */
export const CULTIVATION_METRIC_CONCEPTS = [
  { metricId: "vpd", label: "VPD", entryId: "vpd" },
  { metricId: "temperature", label: "Temperature", entryId: "vpd" },
  { metricId: "humidity", label: "Humidity", entryId: "vpd" },
  { metricId: "ec_in", label: "EC In", entryId: "ec-runoff" },
  { metricId: "ec_out", label: "EC Out", entryId: "ec-runoff" },
  { metricId: "ph_in", label: "pH In", entryId: "ph" },
  { metricId: "ph_out", label: "pH Out", entryId: "ph" },
] as const;

export type CultivationMetricId = (typeof CULTIVATION_METRIC_CONCEPTS)[number]["metricId"];

export function getConceptHref(entryId: string) {
  return `/dashboard/knowledge/${entryId}`;
}

export function resolveConceptForMetric(metricId: string) {
  const config = CULTIVATION_METRIC_CONCEPTS.find((item) => item.metricId === metricId);
  if (!config) {
    return null;
  }
  const entry = getKnowledgeEntryById(config.entryId);
  if (!entry) {
    return null;
  }
  return {
    ...config,
    title: entry.title,
    shortSummary: entry.shortSummary,
    href: getConceptHref(config.entryId),
  };
}

export function getAvailableMetricConcepts() {
  return CULTIVATION_METRIC_CONCEPTS.map((config) => resolveConceptForMetric(config.metricId)).filter(
    (item): item is NonNullable<typeof item> => item != null,
  );
}
