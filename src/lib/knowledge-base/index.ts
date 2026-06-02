export { KNOWLEDGE_CATEGORIES } from "@/lib/knowledge-base/categories";
export { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
export {
  KNOWLEDGE_PHASES,
  KNOWLEDGE_RELATED_METRICS,
  KNOWLEDGE_SOURCE_TYPE_LABELS,
  KNOWLEDGE_CONTENT_STATUS_LABELS,
  KNOWLEDGE_CONFIDENCE_LABELS,
  KNOWLEDGE_TOPICS,
} from "@/lib/knowledge-base/constants";
export {
  KNOWLEDGE_ACCESS_POLICY,
  assertNoForbiddenKnowledgeFields,
  toPublicKnowledgeEntry,
} from "@/lib/knowledge-base/privacy";
export {
  getCitedKnowledgeSources,
  getKnowledgeBrainStats,
  getKnowledgeSourceRegistry,
  RESERVED_BOTAFARM_SOURCES,
} from "@/lib/knowledge-base/sources/registry";
export {
  validateIngestionPayload,
  ingestExtractedEntry,
  registerKnowledgeSource,
} from "@/lib/knowledge-base/layers/ingestion";
export {
  buildKnowledgeIndex,
  buildKnowledgeIndexRecord,
  buildEmbeddingCandidates,
} from "@/lib/knowledge-base/layers/indexing";
export {
  searchPublicKnowledge,
  retrievePublicKnowledgeForRoom,
  retrievePublicKnowledgeForAlert,
  getPublicKnowledgeByMetric,
  getPublicRelatedKnowledge,
  getKnowledgeIndexSnapshot,
} from "@/lib/knowledge-base/layers/retrieval";
export {
  buildKnowledgeCitation,
  formatCitationBlock,
} from "@/lib/knowledge-base/layers/citation";
export {
  buildKnowledgeRelationships,
  getKnowledgeRelationshipsForEntry,
  countKnowledgeRelationships,
} from "@/lib/knowledge-base/layers/relationships";
export {
  buildKnowledgeRagCatalog,
  buildKnowledgeRagDocument,
} from "@/lib/knowledge-base/rag";
export {
  RECOMMENDATION_METRIC_TO_KNOWLEDGE_ID,
  getKnowledgeEntriesForRecommendation,
  getKnowledgeEntryForRecommendationMetric,
  getKnowledgeLinkForRecommendationMetric,
  resolveKnowledgeEntryIdForRecommendationMetric,
} from "@/lib/knowledge-base/recommendations-bridge";
export {
  filterKnowledgeEntries,
  getAllKnowledgeEntries,
  getCategoriesWithEntryCounts,
  getKnowledgeEntriesByCategory,
  getKnowledgeEntriesByMetric,
  getKnowledgeEntriesByPhase,
  getKnowledgeEntriesBySourceType,
  getKnowledgeEntryById,
  getKnowledgeEntrySummaries,
  getKnowledgeFilterFacets,
  mergeKnowledgeEntries,
  searchKnowledgeEntries,
  toKnowledgeSummary,
} from "@/lib/knowledge-base/catalog";
export {
  formatKnowledgeSourceCitation,
  getKnowledgeByMetric,
  getKnowledgeByPhase,
  getKnowledgeByTopic,
  getKnowledgeForRoomMetric,
  getRelatedKnowledge,
  retrieveKnowledgeForAlert,
  retrieveKnowledgeForRoom,
  searchKnowledge,
} from "@/lib/knowledge-base/brain";
export { ROOM_CULTIVATION_METRICS } from "@/lib/knowledge-base/metric-aliases";
export type { KnowledgeRecommendationLink } from "@/lib/knowledge-base/recommendations-bridge";
export type { KnowledgeCategory } from "@/lib/knowledge-base/categories";
export type {
  KnowledgeAlertContext,
  KnowledgeRoomContext,
} from "@/lib/knowledge-base/brain";
export type { RoomCultivationMetricId } from "@/lib/knowledge-base/metric-aliases";
export type {
  KnowledgeEntry,
  KnowledgeEntrySummary,
  PublicKnowledgeEntry,
  KnowledgeFilterParams,
  KnowledgePriority,
  KnowledgeRagDocument,
  KnowledgeRecommendedRange,
  KnowledgeSourceMetadata,
  KnowledgeSourceReference,
  KnowledgeSourceType,
  KnowledgeTopic,
  KnowledgeBrainCategory,
  KnowledgeBrainStats,
  KnowledgeContentStatus,
  KnowledgeConfidenceLevel,
  KnowledgeIngestionPayload,
  KnowledgeSourceRegistryEntry,
  GrowPhase,
} from "@/lib/knowledge-base/types";
export type { KnowledgeCitation } from "@/lib/knowledge-base/layers/citation";
export type { KnowledgeRelationship } from "@/lib/knowledge-base/layers/relationships";
