import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledge-base/categories";
import { resolveMetricSearchKeys } from "@/lib/knowledge-base/metric-aliases";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import type {
  KnowledgeEntry,
  KnowledgeEntrySummary,
  KnowledgeFilterParams,
  KnowledgeSourceType,
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
  const keys = resolveMetricSearchKeys(metric);
  return sortEntries(
    KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
      entry.relatedMetrics.some((item) => keys.includes(item.toLowerCase())),
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
    const category = params.category.trim();
    entries = entries.filter(
      (entry) => entry.category === category || entry.subcategory === category,
    );
  }

  if (params.subcategory?.trim()) {
    entries = entries.filter((entry) => entry.subcategory === params.subcategory?.trim());
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
    const keys = resolveMetricSearchKeys(params.metric.trim());
    entries = entries.filter((entry) =>
      entry.relatedMetrics.some((item) => keys.includes(item.toLowerCase())),
    );
  }

  if (params.topic?.trim()) {
    const topic = params.topic.trim().toLowerCase();
    entries = entries.filter(
      (entry) =>
        (entry.topic?.toLowerCase() ?? "") === topic ||
        entry.tags.some((tag) => tag.toLowerCase() === topic),
    );
  }

  if (params.tag?.trim()) {
    const tag = params.tag.trim().toLowerCase();
    entries = entries.filter((entry) =>
      entry.tags.some((item) => item.toLowerCase() === tag),
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

export function toKnowledgeSummary(entry: KnowledgeEntry): KnowledgeEntrySummary {
  return {
    id: entry.id,
    title: entry.title,
    category: entry.category,
    subcategory: entry.subcategory,
    topic: entry.topic,
    subject: entry.subject,
    shortSummary: entry.shortSummary,
    phaseRelevance: entry.phaseRelevance,
    relatedMetrics: entry.relatedMetrics,
    sourceType: entry.sourceType,
    priority: entry.priority,
    tags: entry.tags,
    confidenceLevel: entry.confidenceLevel,
    contentStatus: entry.contentStatus,
    sourceReference: entry.sourceReference,
  };
}

export function getKnowledgeEntrySummaries(): KnowledgeEntrySummary[] {
  return getAllKnowledgeEntries().map(toKnowledgeSummary);
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
  const topics = new Set<string>();
  const tags = new Set<string>();
  const subcategories = new Set<string>();

  for (const entry of KNOWLEDGE_BASE_ENTRIES) {
    sourceTypes.add(entry.sourceType);
    if (entry.topic) {
      topics.add(entry.topic);
    }
    for (const phase of entry.phaseRelevance) {
      phases.add(phase);
    }
    for (const metric of entry.relatedMetrics) {
      metrics.add(metric);
    }
    for (const tag of entry.tags) {
      tags.add(tag);
    }
    subcategories.add(entry.subcategory);
  }

  return {
    sourceTypes: [...sourceTypes].sort(),
    phases: [...phases].sort(),
    metrics: [...metrics].sort(),
    topics: [...topics].sort(),
    tags: [...tags].sort(),
    subcategories: [...subcategories].sort(),
  };
}

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
        entry.topic ?? "",
        entry.subject ?? "",
        entry.shortSummary,
        entry.knowledgeSummary,
        ...entry.commonMistakes,
        entry.botafarmNote ?? "",
        entry.sourceType,
        entry.sourceMetadata?.author ?? "",
        entry.sourceMetadata?.chapter ?? "",
        entry.sourceMetadata?.section ?? "",
        entry.sourceMetadata?.documentTitle ?? "",
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
