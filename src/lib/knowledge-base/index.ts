import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledge-base/categories";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import type {
  KnowledgeEntry,
  KnowledgeEntrySummary,
  KnowledgeFilterParams,
  KnowledgeSourceType,
} from "@/lib/knowledge-base/types";

export { KNOWLEDGE_CATEGORIES, KNOWLEDGE_BASE_ENTRIES };
export {
  KNOWLEDGE_PHASES,
  KNOWLEDGE_RELATED_METRICS,
  KNOWLEDGE_SOURCE_TYPE_LABELS,
} from "@/lib/knowledge-base/constants";
export {
  buildKnowledgeRagCatalog,
  buildKnowledgeRagDocument,
} from "@/lib/knowledge-base/rag";
export {
  RECOMMENDATION_METRIC_TO_KNOWLEDGE_ID,
  getKnowledgeEntriesForRecommendation,
  getKnowledgeEntryForRecommendationMetric,
  resolveKnowledgeEntryIdForRecommendationMetric,
} from "@/lib/knowledge-base/recommendations-bridge";
export type { KnowledgeCategory } from "@/lib/knowledge-base/categories";
export type {
  KnowledgeEntry,
  KnowledgeEntrySummary,
  KnowledgeFilterParams,
  KnowledgePriority,
  KnowledgeRagDocument,
  KnowledgeRecommendedRange,
  KnowledgeSourceMetadata,
  KnowledgeSourceType,
  GrowPhase,
} from "@/lib/knowledge-base/types";

function sortEntries(entries: KnowledgeEntry[]) {
  return [...entries].sort((left, right) => left.title.localeCompare(right.title));
}

export function getAllKnowledgeEntries(): KnowledgeEntry[] {
  return sortEntries(KNOWLEDGE_BASE_ENTRIES);
}

export function getKnowledgeEntryById(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE_ENTRIES.find((entry) => entry.id === id);
}

export function getKnowledgeEntriesByCategory(category: string): KnowledgeEntry[] {
  return sortEntries(
    KNOWLEDGE_BASE_ENTRIES.filter((entry) => entry.category === category),
  );
}

export function getKnowledgeEntriesByMetric(metric: string): KnowledgeEntry[] {
  const normalized = metric.toLowerCase();
  return sortEntries(
    KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
      entry.relatedMetrics.some((item) => item.toLowerCase() === normalized),
    ),
  );
}

export function getKnowledgeEntriesByPhase(phase: string): KnowledgeEntry[] {
  return sortEntries(
    KNOWLEDGE_BASE_ENTRIES.filter(
      (entry) =>
        entry.phaseRelevance.includes("All") ||
        entry.phaseRelevance.includes(phase as KnowledgeEntry["phaseRelevance"][number]),
    ),
  );
}

export function getKnowledgeEntriesBySourceType(
  sourceType: KnowledgeSourceType,
): KnowledgeEntry[] {
  return sortEntries(
    KNOWLEDGE_BASE_ENTRIES.filter((entry) => entry.sourceType === sourceType),
  );
}

export function filterKnowledgeEntries(params: KnowledgeFilterParams): KnowledgeEntry[] {
  let entries = getAllKnowledgeEntries();

  if (params.category?.trim()) {
    entries = entries.filter((entry) => entry.category === params.category?.trim());
  }

  if (params.phase?.trim()) {
    const phase = params.phase.trim();
    entries = entries.filter(
      (entry) =>
        entry.phaseRelevance.includes("All") ||
        entry.phaseRelevance.includes(phase as KnowledgeEntry["phaseRelevance"][number]),
    );
  }

  if (params.metric?.trim()) {
    const metric = params.metric.trim().toLowerCase();
    entries = entries.filter((entry) =>
      entry.relatedMetrics.some((item) => item.toLowerCase() === metric),
    );
  }

  if (params.sourceType) {
    entries = entries.filter((entry) => entry.sourceType === params.sourceType);
  }

  if (params.query?.trim()) {
    entries = searchKnowledgeEntries(params.query, entries);
  }

  return entries;
}

export function getKnowledgeEntrySummaries(): KnowledgeEntrySummary[] {
  return getAllKnowledgeEntries().map(toKnowledgeSummary);
}

export function toKnowledgeSummary(entry: KnowledgeEntry): KnowledgeEntrySummary {
  return {
    id: entry.id,
    title: entry.title,
    category: entry.category,
    shortSummary: entry.shortSummary,
    phaseRelevance: entry.phaseRelevance,
    relatedMetrics: entry.relatedMetrics,
    sourceType: entry.sourceType,
    priority: entry.priority,
  };
}

export function getCategoriesWithEntryCounts() {
  const counts = new Map<string, number>();

  for (const category of KNOWLEDGE_CATEGORIES) {
    counts.set(category, 0);
  }

  for (const entry of KNOWLEDGE_BASE_ENTRIES) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }

  return KNOWLEDGE_CATEGORIES.map((category) => ({
    category,
    count: counts.get(category) ?? 0,
  }));
}

export function getKnowledgeFilterFacets() {
  const sourceTypes = new Set<KnowledgeSourceType>();
  const phases = new Set<string>();
  const metrics = new Set<string>();

  for (const entry of KNOWLEDGE_BASE_ENTRIES) {
    sourceTypes.add(entry.sourceType);
    for (const phase of entry.phaseRelevance) {
      phases.add(phase);
    }
    for (const metric of entry.relatedMetrics) {
      metrics.add(metric);
    }
  }

  return {
    sourceTypes: [...sourceTypes].sort(),
    phases: [...phases].sort(),
    metrics: [...metrics].sort(),
  };
}

/** Future: merge imported book/article entries into the in-memory catalog */
export function mergeKnowledgeEntries(
  base: KnowledgeEntry[],
  imported: KnowledgeEntry[],
): KnowledgeEntry[] {
  const map = new Map<string, KnowledgeEntry>();

  for (const entry of base) {
    map.set(entry.id, entry);
  }

  for (const entry of imported) {
    map.set(entry.id, entry);
  }

  return sortEntries([...map.values()]);
}

export function searchKnowledgeEntries(
  query: string,
  catalog: KnowledgeEntry[] = KNOWLEDGE_BASE_ENTRIES,
): KnowledgeEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return sortEntries(catalog);
  }

  return sortEntries(
    catalog.filter((entry) => {
      const haystack = [
        entry.id,
        entry.title,
        entry.category,
        entry.shortSummary,
        entry.detailedContent,
        entry.botafarmNote ?? "",
        entry.sourceType,
        ...entry.tags,
        ...entry.relatedMetrics,
        ...entry.warnings,
        ...entry.practicalActions,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    }),
  );
}
