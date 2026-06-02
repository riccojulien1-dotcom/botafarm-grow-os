import type { GrowPhase, KnowledgeSourceType } from "@/lib/knowledge-base/types";

export const SEED_TIMESTAMP = "2026-05-29T00:00:00.000Z";

/** Journal / recommendation metric keys used for filtering and cross-reference */
export const KNOWLEDGE_RELATED_METRICS = [
  "ppfd",
  "dli",
  "vpd",
  "ec_in",
  "ec_runoff",
  "ph_in",
  "ph_runoff",
  "dryback_percent",
  "runoff_percent",
  "irrigation_count",
  "irrigation_volume_per_event",
  "temperature",
  "humidity",
] as const;

export type KnowledgeRelatedMetric = (typeof KNOWLEDGE_RELATED_METRICS)[number];

export const KNOWLEDGE_PHASES: GrowPhase[] = [
  "Clone",
  "Mother",
  "Vegetative",
  "Pre-Flower",
  "Flower",
  "Drying",
  "Cure",
  "All",
];

export const KNOWLEDGE_SOURCE_TYPE_LABELS: Record<KnowledgeSourceType, string> = {
  book: "Book",
  SOP: "SOP",
  blog: "Blog",
  protocol: "Protocol",
  guide: "Guide",
  article: "Article",
  rule: "Rule",
};

export const KNOWLEDGE_CONTENT_STATUS_LABELS: Record<
  import("@/lib/knowledge-base/types").KnowledgeContentStatus,
  string
> = {
  extracted: "Extracted",
  draft: "Draft",
  reviewed: "Reviewed",
  published: "Published",
};

export const KNOWLEDGE_CONFIDENCE_LABELS: Record<
  import("@/lib/knowledge-base/types").KnowledgeConfidenceLevel,
  string
> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export { KNOWLEDGE_TOPIC_VALUES as KNOWLEDGE_TOPICS } from "@/lib/knowledge-base/types";
