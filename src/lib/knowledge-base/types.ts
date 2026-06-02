/** Source types aligned with Botafarm content library and future RAG ingestion */
export const KNOWLEDGE_SOURCE_TYPES = [
  "book",
  "SOP",
  "blog",
  "protocol",
  "guide",
  "article",
  "rule",
] as const;

/** Sprint 24 Brain categories — ingestion-ready, no raw documents */
export const KNOWLEDGE_BRAIN_CATEGORIES = [
  "Irrigation",
  "Crop Steering",
  "Environment",
  "Nutrition",
  "Genetics",
  "Breeding",
  "Tissue Culture",
  "Harvest",
  "Drying",
  "Curing",
  "SOPs",
] as const;

export type KnowledgeBrainCategory = (typeof KNOWLEDGE_BRAIN_CATEGORIES)[number];

/** High-level Botafarm knowledge domains for Brain retrieval */
export const KNOWLEDGE_TOPIC_VALUES = [
  "Environment",
  "Irrigation",
  "Crop steering",
  "Nutrition",
  "Lighting",
  "Genetics",
  "Harvest",
  "Curing",
  "Breeding",
  "Tissue culture",
  "General cultivation",
] as const;

export type KnowledgeTopic = (typeof KNOWLEDGE_TOPIC_VALUES)[number];

export type KnowledgeSourceType = (typeof KNOWLEDGE_SOURCE_TYPES)[number];

export const KNOWLEDGE_PRIORITIES = ["low", "medium", "high"] as const;

export type KnowledgePriority = (typeof KNOWLEDGE_PRIORITIES)[number];

export const KNOWLEDGE_CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export type KnowledgeConfidenceLevel = (typeof KNOWLEDGE_CONFIDENCE_LEVELS)[number];

export const KNOWLEDGE_CONTENT_STATUSES = [
  "extracted",
  "draft",
  "reviewed",
  "published",
] as const;

export type KnowledgeContentStatus = (typeof KNOWLEDGE_CONTENT_STATUSES)[number];

export const KNOWLEDGE_DOCUMENT_FORMATS = [
  "pdf",
  "docx",
  "markdown",
  "structured_text",
] as const;

export type KnowledgeDocumentFormat = (typeof KNOWLEDGE_DOCUMENT_FORMATS)[number];

export const KNOWLEDGE_ENTRY_KINDS = [
  "concept",
  "sop",
  "rule",
  "diagnostic",
  "corrective_action",
  "warning",
] as const;

export type KnowledgeEntryKind = (typeof KNOWLEDGE_ENTRY_KINDS)[number];

export const KNOWLEDGE_SOURCE_INGESTION_STATUSES = [
  "not_ingested",
  "registered",
  "ingesting",
  "indexed",
] as const;

export type KnowledgeSourceIngestionStatus =
  (typeof KNOWLEDGE_SOURCE_INGESTION_STATUSES)[number];

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

/**
 * Citation-only source reference — never exposes raw document text, PDFs, or chapters.
 */
export type KnowledgeSourceReference = {
  sourceType: KnowledgeSourceType;
  sourceTitle: string;
  section?: string;
  internalReferenceId: string;
};

/** Internal ingestion metadata — not shown to users */
export type KnowledgeSourceMetadata = {
  documentTitle?: string;
  author?: string;
  edition?: string;
  chapter?: string;
  section?: string;
  documentId?: string;
  importedBatchId?: string;
  locale?: string;
  /** Blocked from user UI — ingestion pipeline only */
  ingestionOnly?: boolean;
};

/**
 * Canonical extracted knowledge entry — never contains full book chapters or raw source text.
 */
export type KnowledgeEntry = {
  id: string;
  title: string;
  entryKind?: KnowledgeEntryKind;
  sourceType: KnowledgeSourceType;
  category: string;
  subcategory: string;
  topic: KnowledgeTopic | string;
  subject: string;
  phaseRelevance: GrowPhase[];
  relatedMetrics: string[];
  shortSummary: string;
  /** Extracted knowledge only — not original proprietary document text */
  knowledgeSummary: string;
  practicalActions: string[];
  commonMistakes: string[];
  warnings: string[];
  recommendedRanges: KnowledgeRecommendedRange[];
  tags: string[];
  priority: KnowledgePriority;
  confidenceLevel: KnowledgeConfidenceLevel;
  contentStatus: KnowledgeContentStatus;
  sourceReference: KnowledgeSourceReference;
  sourceMetadata?: KnowledgeSourceMetadata;
  botafarmNote?: string;
  createdAt: string;
  updatedAt: string;
};

/** User-safe view — strips internal-only ingestion fields */
export type PublicKnowledgeEntry = Omit<KnowledgeEntry, "sourceMetadata">;

export type KnowledgeEntrySummary = Pick<
  PublicKnowledgeEntry,
  | "id"
  | "title"
  | "category"
  | "subcategory"
  | "topic"
  | "subject"
  | "shortSummary"
  | "phaseRelevance"
  | "relatedMetrics"
  | "sourceType"
  | "priority"
  | "tags"
  | "confidenceLevel"
  | "contentStatus"
  | "sourceReference"
>;

export type KnowledgeFilterParams = {
  category?: string;
  subcategory?: string;
  phase?: string;
  metric?: string;
  topic?: string;
  tag?: string;
  sourceType?: KnowledgeSourceType;
  query?: string;
};

/** Registry row — source exists as citation anchor, not as a readable document */
export const BOOK_MAP_STATUSES = ["mapped", "pending"] as const;

export type BookMapStatus = (typeof BOOK_MAP_STATUSES)[number];

export type KnowledgeSourceRegistryEntry = {
  id: string;
  sourceTitle: string;
  sourceType: KnowledgeSourceType;
  ingestionStatus: KnowledgeSourceIngestionStatus;
  extractedEntryCount: number;
  categoriesCovered?: string[];
  coveragePercent?: number;
  targetEntryCount?: number;
  internalReferencePrefix?: string;
  plannedForSprint?: number;
  bookMapStatus?: BookMapStatus;
  bookMapNodeCount?: number;
  bookMapChapterCount?: number;
};

export type KnowledgeBrainStats = {
  sourceCount: number;
  entryCount: number;
  categoryCount: number;
  documentsLoaded: number;
  relationshipsMapped: number;
  stagedEntryCount: number;
  irrigationCoveragePercent: number;
  handbookCoveragePercent: number;
};

/** Future ingestion payload — extracted fields only */
export type KnowledgeIngestionPayload = {
  id: string;
  title: string;
  entryKind?: KnowledgeEntryKind;
  sourceReference: KnowledgeSourceReference;
  category: string;
  subcategory: string;
  topic: string;
  subject: string;
  phaseRelevance: GrowPhase[];
  relatedMetrics: string[];
  shortSummary: string;
  knowledgeSummary: string;
  practicalActions: string[];
  commonMistakes: string[];
  warnings: string[];
  recommendedRanges?: KnowledgeRecommendedRange[];
  tags: string[];
  priority?: KnowledgePriority;
  confidenceLevel?: KnowledgeConfidenceLevel;
  contentStatus?: KnowledgeContentStatus;
};

/** Flat document shape for future embedding / RAG chunking (pipeline-internal) */
export type KnowledgeRagDocument = {
  id: string;
  title: string;
  sourceType: KnowledgeSourceType;
  category: string;
  phaseRelevance: GrowPhase[];
  relatedMetrics: string[];
  priority: KnowledgePriority;
  content: string;
  metadata: {
    sourceReference: KnowledgeSourceReference;
    tags: string[];
    practicalActions: string[];
    commonMistakes: string[];
    warnings: string[];
    confidenceLevel: KnowledgeConfidenceLevel;
    createdAt: string;
    updatedAt: string;
  };
};
