/** Source types aligned with Botafarm content library and future RAG ingestion */
export const KNOWLEDGE_SOURCE_TYPES = [
  "book",
  "SOP",
  "blog",
  "protocol",
  "rule",
] as const;

export type KnowledgeSourceType = (typeof KNOWLEDGE_SOURCE_TYPES)[number];

export const KNOWLEDGE_PRIORITIES = ["low", "medium", "high"] as const;

export type KnowledgePriority = (typeof KNOWLEDGE_PRIORITIES)[number];

export type GrowPhase =
  | "Clone"
  | "Mother"
  | "Vegetative"
  | "Pre-Flower"
  | "Flower"
  | "Drying"
  | "Cure"
  | "All";

export type KnowledgeRecommendedRange = {
  phase?: GrowPhase | string;
  label: string;
  min?: number;
  max?: number;
  unit?: string;
  notes?: string;
};

/** Provenance for books, SOPs, articles — used by future import pipelines and RAG citations */
export type KnowledgeSourceMetadata = {
  documentTitle?: string;
  author?: string;
  edition?: string;
  chapter?: string;
  section?: string;
  url?: string;
  documentId?: string;
  importedBatchId?: string;
  locale?: string;
};

/**
 * Canonical knowledge entry — stored in lib catalog today; same shape for DB/RAG later.
 */
export type KnowledgeEntry = {
  /** Stable slug for URLs, recommendations, and vector store document ids */
  id: string;
  title: string;
  sourceType: KnowledgeSourceType;
  category: string;
  phaseRelevance: GrowPhase[];
  relatedMetrics: string[];
  shortSummary: string;
  detailedContent: string;
  practicalActions: string[];
  warnings: string[];
  recommendedRanges: KnowledgeRecommendedRange[];
  tags: string[];
  priority: KnowledgePriority;
  sourceMetadata?: KnowledgeSourceMetadata;
  /** Optional Botafarm operational note for Grow OS context */
  botafarmNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeEntrySummary = Pick<
  KnowledgeEntry,
  | "id"
  | "title"
  | "category"
  | "shortSummary"
  | "phaseRelevance"
  | "relatedMetrics"
  | "sourceType"
  | "priority"
>;

export type KnowledgeFilterParams = {
  category?: string;
  phase?: string;
  metric?: string;
  sourceType?: KnowledgeSourceType;
  query?: string;
};

/** Flat document shape for future embedding / RAG chunking */
export type KnowledgeRagDocument = {
  id: string;
  title: string;
  sourceType: KnowledgeSourceType;
  category: string;
  phaseRelevance: GrowPhase[];
  relatedMetrics: string[];
  priority: KnowledgePriority;
  content: string;
  metadata: KnowledgeSourceMetadata & {
    tags: string[];
    practicalActions: string[];
    warnings: string[];
    createdAt: string;
    updatedAt: string;
  };
};
