import {
  HANDBOOK_FEED_BRAIN_CATEGORIES,
  HANDBOOK_TARGET_CONCEPTS,
  HANDBOOK_TARGET_ENTRY_COUNT,
  IRRIGATION_HANDBOOK_SOURCE_ID,
  IRRIGATION_HANDBOOK_TITLE,
} from "@/lib/knowledge-base/domains/irrigation-manifest";
import { getAllStagedPayloads } from "@/lib/knowledge-base/pipeline/staging-store";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import type { KnowledgeSourceCoverageReport } from "@/lib/knowledge-base/pipeline/types";
import type {
  KnowledgeEntry,
  KnowledgeIngestionPayload,
  KnowledgeSourceRegistryEntry,
} from "@/lib/knowledge-base/types";

type CatalogEntry = Pick<
  KnowledgeEntry | KnowledgeIngestionPayload,
  | "id"
  | "title"
  | "category"
  | "subcategory"
  | "sourceReference"
  | "relatedMetrics"
  | "phaseRelevance"
>;

function entriesForSourceTitle(sourceTitle: string, catalog: CatalogEntry[]) {
  return catalog.filter((entry) => entry.sourceReference.sourceTitle === sourceTitle);
}

function countConceptCoverage(
  entries: Array<{ id: string }>,
  sourceId: string,
): { conceptsCovered: number; targetConceptCount: number } {
  if (sourceId !== IRRIGATION_HANDBOOK_SOURCE_ID) {
    return { conceptsCovered: entries.length, targetConceptCount: entries.length || 1 };
  }

  const coveredSlugs = new Set<string>();
  for (const entry of entries) {
    if (HANDBOOK_TARGET_CONCEPTS.some((concept) => concept.slug === entry.id)) {
      coveredSlugs.add(entry.id);
    }
  }

  return {
    conceptsCovered: coveredSlugs.size,
    targetConceptCount: HANDBOOK_TARGET_ENTRY_COUNT,
  };
}

function computeCategoryCoveragePercent(categoriesCovered: string[], sourceId: string) {
  if (sourceId !== IRRIGATION_HANDBOOK_SOURCE_ID) {
    return categoriesCovered.length > 0 ? 100 : 0;
  }

  const targetCount = HANDBOOK_FEED_BRAIN_CATEGORIES.length;
  const matched = HANDBOOK_FEED_BRAIN_CATEGORIES.filter((category) =>
    categoriesCovered.includes(category),
  ).length;

  return Math.min(100, Math.round((matched / targetCount) * 100));
}

export function buildSourceCoverageReport(
  source: KnowledgeSourceRegistryEntry,
  catalog: CatalogEntry[] = [
    ...KNOWLEDGE_BASE_ENTRIES,
    ...getAllStagedPayloads(),
  ],
): KnowledgeSourceCoverageReport {
  const entries = entriesForSourceTitle(source.sourceTitle, catalog);
  const categoriesCovered = [...new Set(entries.map((entry) => entry.category))].sort();
  const metricsCovered = [
    ...new Set(entries.flatMap((entry) => entry.relatedMetrics ?? [])),
  ].sort();
  const phasesCovered = [
    ...new Set(entries.flatMap((entry) => entry.phaseRelevance ?? [])),
  ].sort();

  const { conceptsCovered, targetConceptCount } = countConceptCoverage(entries, source.id);

  const coveragePercent =
    targetConceptCount > 0
      ? Math.min(100, Math.round((conceptsCovered / targetConceptCount) * 100))
      : entries.length > 0
        ? 100
        : 0;

  const categoryCoveragePercent = computeCategoryCoveragePercent(
    categoriesCovered,
    source.id,
  );

  const targetCategories =
    source.id === IRRIGATION_HANDBOOK_SOURCE_ID
      ? HANDBOOK_FEED_BRAIN_CATEGORIES
      : ([source.sourceType] as readonly string[]);

  return {
    sourceId: source.id,
    sourceTitle: source.sourceTitle,
    ingestionStatus: source.ingestionStatus,
    entriesCreated: entries.length,
    categoriesCovered,
    targetCategories,
    categoryCoveragePercent,
    conceptsCovered,
    targetConceptCount,
    coveragePercent,
    metricsCovered,
    phasesCovered,
    feedsMultipleBrainDomains: categoriesCovered.length > 1,
    plannedForSprint: source.plannedForSprint,
  };
}

export function getHandbookCoveragePercent(): number {
  const report = buildSourceCoverageReport({
    id: IRRIGATION_HANDBOOK_SOURCE_ID,
    sourceTitle: IRRIGATION_HANDBOOK_TITLE,
    sourceType: "book",
    ingestionStatus: "not_ingested",
    extractedEntryCount: 0,
    internalReferencePrefix: "IRR",
    plannedForSprint: 26,
    targetEntryCount: HANDBOOK_TARGET_ENTRY_COUNT,
  });
  return report.coveragePercent;
}

/** @deprecated Use getHandbookCoveragePercent */
export const getIrrigationCoveragePercent = getHandbookCoveragePercent;

export function getAllSourceCoverageReports(
  sources: KnowledgeSourceRegistryEntry[],
): KnowledgeSourceCoverageReport[] {
  const catalog = [...KNOWLEDGE_BASE_ENTRIES, ...getAllStagedPayloads()];
  return sources.map((source) => buildSourceCoverageReport(source, catalog));
}
