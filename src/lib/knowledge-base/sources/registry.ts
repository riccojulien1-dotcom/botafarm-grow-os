import {
  IRRIGATION_HANDBOOK_SOURCE_ID,
  HANDBOOK_TARGET_ENTRY_COUNT,
} from "@/lib/knowledge-base/domains/irrigation-manifest";
import { getStagedEntryCount } from "@/lib/knowledge-base/pipeline/staging-store";
import {
  buildSourceCoverageReport,
  getAllSourceCoverageReports,
  getHandbookCoveragePercent,
} from "@/lib/knowledge-base/sources/coverage";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import { countKnowledgeRelationships } from "@/lib/knowledge-base/layers/relationships";
import { KNOWLEDGE_BRAIN_CATEGORIES } from "@/lib/knowledge-base/types";
import type {
  KnowledgeBrainStats,
  KnowledgeSourceRegistryEntry,
} from "@/lib/knowledge-base/types";

export { getAllSourceCoverageReports, buildSourceCoverageReport };

/** Reserved Botafarm sources — registered for Sprint 25, no documents loaded in Sprint 24 */
export const RESERVED_BOTAFARM_SOURCES: KnowledgeSourceRegistryEntry[] = [
  {
    id: "irrigation-handbook",
    sourceTitle: "Botafarm Irrigation Handbook",
    sourceType: "book",
    ingestionStatus: "not_ingested",
    extractedEntryCount: 0,
    internalReferencePrefix: "IRR",
    targetEntryCount: HANDBOOK_TARGET_ENTRY_COUNT,
    plannedForSprint: 26,
  },
  {
    id: "crop-steering-protocol",
    sourceTitle: "Botafarm Crop Steering Protocol",
    sourceType: "protocol",
    ingestionStatus: "not_ingested",
    extractedEntryCount: 0,
    internalReferencePrefix: "CS",
    plannedForSprint: 25,
  },
  {
    id: "environment-handbook",
    sourceTitle: "Botafarm Environment Handbook",
    sourceType: "book",
    ingestionStatus: "not_ingested",
    extractedEntryCount: 0,
    internalReferencePrefix: "ENV",
    plannedForSprint: 25,
  },
  {
    id: "breeding-guide",
    sourceTitle: "Botafarm Breeding Guide",
    sourceType: "guide",
    ingestionStatus: "not_ingested",
    extractedEntryCount: 0,
    internalReferencePrefix: "BRD",
    plannedForSprint: 25,
  },
  {
    id: "tissue-culture-sop",
    sourceTitle: "Botafarm Tissue Culture SOP",
    sourceType: "SOP",
    ingestionStatus: "not_ingested",
    extractedEntryCount: 0,
    internalReferencePrefix: "TC",
    plannedForSprint: 25,
  },
];

function countActiveCategories(): number {
  const active = new Set(KNOWLEDGE_BASE_ENTRIES.map((entry) => entry.category));
  return KNOWLEDGE_BRAIN_CATEGORIES.filter((category) => active.has(category)).length;
}

/** Sources cited by extracted entries (citation registry, not document library) */
export function getCitedKnowledgeSources(): KnowledgeSourceRegistryEntry[] {
  const byTitle = new Map<string, KnowledgeSourceRegistryEntry>();

  for (const entry of KNOWLEDGE_BASE_ENTRIES) {
    const title = entry.sourceReference.sourceTitle;
    const existing = byTitle.get(title);

    if (existing) {
      existing.extractedEntryCount += 1;
      continue;
    }

    byTitle.set(title, {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sourceTitle: title,
      sourceType: entry.sourceReference.sourceType,
      ingestionStatus: "indexed",
      extractedEntryCount: 1,
      internalReferencePrefix: entry.sourceReference.internalReferenceId.split("-")[0],
    });
  }

  return [...byTitle.values()].sort((a, b) => a.sourceTitle.localeCompare(b.sourceTitle));
}

function attachCoverageFields(
  source: KnowledgeSourceRegistryEntry,
): KnowledgeSourceRegistryEntry {
  const report = buildSourceCoverageReport(source);
  return {
    ...source,
    extractedEntryCount: report.entriesCreated,
    categoriesCovered: report.categoriesCovered,
    coveragePercent: report.coveragePercent,
    targetEntryCount: report.targetConceptCount,
    ingestionStatus:
      source.id === IRRIGATION_HANDBOOK_SOURCE_ID && report.entriesCreated > 0
        ? report.coveragePercent >= 100
          ? "indexed"
          : "ingesting"
        : source.ingestionStatus,
  };
}

export function getKnowledgeSourceRegistry(): KnowledgeSourceRegistryEntry[] {
  const cited = getCitedKnowledgeSources();
  const citedTitles = new Set(cited.map((source) => source.sourceTitle));

  const reserved = RESERVED_BOTAFARM_SOURCES.filter(
    (source) => !citedTitles.has(source.sourceTitle),
  );

  return [...cited, ...reserved].map(attachCoverageFields);
}

export function getKnowledgeBrainStats(): KnowledgeBrainStats {
  const registry = getKnowledgeSourceRegistry();

  return {
    sourceCount: registry.length,
    entryCount: KNOWLEDGE_BASE_ENTRIES.length,
    categoryCount: countActiveCategories(),
    documentsLoaded: 0,
    relationshipsMapped: countKnowledgeRelationships(),
    stagedEntryCount: getStagedEntryCount(),
    irrigationCoveragePercent: getHandbookCoveragePercent(),
    handbookCoveragePercent: getHandbookCoveragePercent(),
  };
}
