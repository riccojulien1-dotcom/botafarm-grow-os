import { buildKnowledgeRagDocument } from "@/lib/knowledge-base/rag";
import type { KnowledgeEntry, KnowledgeRagDocument } from "@/lib/knowledge-base/types";

export type KnowledgeIndexRecord = {
  entryId: string;
  sourceReferenceId: string;
  category: string;
  subcategory: string;
  topic: string;
  tags: string[];
  metrics: string[];
  phases: string[];
  /** Searchable extracted text only */
  indexText: string;
  contentStatus: KnowledgeEntry["contentStatus"];
  confidenceLevel: KnowledgeEntry["confidenceLevel"];
};

/**
 * Knowledge Indexing Layer — prepares searchable index records without storing raw sources.
 */
export function buildKnowledgeIndexRecord(entry: KnowledgeEntry): KnowledgeIndexRecord {
  const indexText = [
    entry.title,
    entry.category,
    entry.subcategory,
    entry.topic,
    entry.subject,
    entry.shortSummary,
    entry.knowledgeSummary,
    ...entry.tags,
    ...entry.relatedMetrics,
    ...entry.practicalActions,
    ...entry.commonMistakes,
    ...entry.warnings,
  ].join(" ");

  return {
    entryId: entry.id,
    sourceReferenceId: entry.sourceReference.internalReferenceId,
    category: entry.category,
    subcategory: entry.subcategory,
    topic: entry.topic,
    tags: entry.tags,
    metrics: entry.relatedMetrics,
    phases: entry.phaseRelevance,
    indexText,
    contentStatus: entry.contentStatus,
    confidenceLevel: entry.confidenceLevel,
  };
}

export function buildKnowledgeIndex(
  entries: KnowledgeEntry[],
): KnowledgeIndexRecord[] {
  return entries.map(buildKnowledgeIndexRecord);
}

/** Future Sprint 25 — embedding input uses RAG document shape, not source PDFs */
export function buildEmbeddingCandidates(entries: KnowledgeEntry[]): KnowledgeRagDocument[] {
  return entries.map(buildKnowledgeRagDocument);
}
