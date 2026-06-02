import type { BookMap, BookMapMetricContext } from "./types";
import { buildBookMapIndex } from "./build-index";

export function resolveMetricContext(
  bookMap: BookMap,
  metric: string,
): BookMapMetricContext | undefined {
  const normalized = metric.trim().toLowerCase();
  const records = buildBookMapIndex(bookMap).filter((record) =>
    record.node.relatedMetrics?.some((item) => item.toLowerCase() === normalized),
  );

  if (records.length === 0) {
    return undefined;
  }

  const phases = new Set(records.flatMap((record) => record.node.phases ?? []));

  return {
    metric: normalized,
    irrIds: records.map((record) => record.irrId),
    chapters: [...new Set(records.map((record) => record.chapterId))],
    phases: [...phases],
  };
}

export function resolveAllMetricContexts(bookMap: BookMap): BookMapMetricContext[] {
  const metrics = new Set<string>();

  for (const record of buildBookMapIndex(bookMap)) {
    for (const metric of record.node.relatedMetrics ?? []) {
      metrics.add(metric.toLowerCase());
    }
  }

  return [...metrics]
    .map((metric) => resolveMetricContext(bookMap, metric))
    .filter((context): context is BookMapMetricContext => Boolean(context))
    .sort((a, b) => a.metric.localeCompare(b.metric));
}
