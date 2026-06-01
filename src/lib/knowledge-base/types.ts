export const KNOWLEDGE_SOURCE_TYPES = ["static", "book", "article"] as const;

export type KnowledgeSourceType = (typeof KNOWLEDGE_SOURCE_TYPES)[number];

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
 * Core knowledge entry shape — designed for static seed data today and
 * book/article imports + AI retrieval later.
 */
export type KnowledgeEntry = {
  /** Stable slug used in URLs and cross-references from recommendations/AI */
  id: string;
  title: string;
  category: string;
  shortExplanation: string;
  detailedExplanation: string;
  phaseRelevance: GrowPhase[];
  relatedMetrics: string[];
  recommendedRanges: KnowledgeRecommendedRange[];
  warningSigns: string[];
  botafarmNote: string;
  sourceType: KnowledgeSourceType;
  /** Future: external book id, article url hash, import batch id */
  sourceRef?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeEntrySummary = Pick<
  KnowledgeEntry,
  "id" | "title" | "category" | "shortExplanation" | "phaseRelevance" | "relatedMetrics"
>;
