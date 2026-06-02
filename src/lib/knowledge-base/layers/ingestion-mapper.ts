import { SEED_TIMESTAMP } from "@/lib/knowledge-base/constants";
import type { KnowledgeEntry, KnowledgeIngestionPayload } from "@/lib/knowledge-base/types";

export function entryFromIngestionPayload(payload: KnowledgeIngestionPayload): KnowledgeEntry {
  return {
    id: payload.id,
    title: payload.title,
    entryKind: payload.entryKind,
    sourceType: payload.sourceReference.sourceType,
    category: payload.category,
    subcategory: payload.subcategory,
    topic: payload.topic,
    subject: payload.subject,
    phaseRelevance: payload.phaseRelevance,
    relatedMetrics: payload.relatedMetrics,
    shortSummary: payload.shortSummary,
    knowledgeSummary: payload.knowledgeSummary,
    practicalActions: payload.practicalActions,
    commonMistakes: payload.commonMistakes,
    warnings: payload.warnings,
    recommendedRanges: payload.recommendedRanges ?? [],
    tags: payload.tags,
    priority: payload.priority ?? "medium",
    confidenceLevel: payload.confidenceLevel ?? "high",
    contentStatus: payload.contentStatus ?? "reviewed",
    sourceReference: payload.sourceReference,
    sourceMetadata: { ingestionOnly: true },
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  };
}
