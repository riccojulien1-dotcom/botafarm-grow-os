import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledge-base/categories";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/entries";
import type {
  KnowledgeEntry,
  KnowledgeEntrySummary,
} from "@/lib/knowledge-base/types";

export { KNOWLEDGE_CATEGORIES, KNOWLEDGE_BASE_ENTRIES };
export type {
  KnowledgeCategory,
} from "@/lib/knowledge-base/categories";
export type {
  KnowledgeEntry,
  KnowledgeEntrySummary,
  KnowledgeRecommendedRange,
  KnowledgeSourceType,
  GrowPhase,
} from "@/lib/knowledge-base/types";

export function getAllKnowledgeEntries(): KnowledgeEntry[] {
  return [...KNOWLEDGE_BASE_ENTRIES].sort((left, right) =>
    left.title.localeCompare(right.title),
  );
}

export function getKnowledgeEntryById(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE_ENTRIES.find((entry) => entry.id === id);
}

export function getKnowledgeEntriesByCategory(category: string): KnowledgeEntry[] {
  return KNOWLEDGE_BASE_ENTRIES.filter((entry) => entry.category === category).sort(
    (left, right) => left.title.localeCompare(right.title),
  );
}

export function getKnowledgeEntriesByMetric(metric: string): KnowledgeEntry[] {
  const normalized = metric.toLowerCase();
  return KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
    entry.relatedMetrics.some((item) => item.toLowerCase() === normalized),
  );
}

export function getKnowledgeEntrySummaries(): KnowledgeEntrySummary[] {
  return getAllKnowledgeEntries().map((entry) => ({
    id: entry.id,
    title: entry.title,
    category: entry.category,
    shortExplanation: entry.shortExplanation,
    phaseRelevance: entry.phaseRelevance,
    relatedMetrics: entry.relatedMetrics,
  }));
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

  return [...map.values()].sort((left, right) => left.title.localeCompare(right.title));
}

export function searchKnowledgeEntries(query: string): KnowledgeEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return getAllKnowledgeEntries();
  }

  return KNOWLEDGE_BASE_ENTRIES.filter((entry) => {
    const haystack = [
      entry.title,
      entry.category,
      entry.shortExplanation,
      entry.detailedExplanation,
      entry.botafarmNote,
      ...(entry.tags ?? []),
      ...entry.relatedMetrics,
      ...entry.warningSigns,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  }).sort((left, right) => left.title.localeCompare(right.title));
}
