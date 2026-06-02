import type { GrowPhase, KnowledgeBrainCategory } from "@/lib/knowledge-base/types";

/**
 * Sprint 26 — Botafarm Irrigation Handbook ingestion manifest.
 * The handbook is a multi-domain source: entries are classified independently
 * into Brain categories (Irrigation, Crop Steering, Environment, etc.).
 * No book content is stored here — only target concepts and default classifications.
 */

export const IRRIGATION_HANDBOOK_SOURCE_ID = "irrigation-handbook" as const;

export const IRRIGATION_HANDBOOK_TITLE = "Botafarm Irrigation Handbook" as const;

export const IRRIGATION_REFERENCE_PREFIX = "IRR" as const;

/** Brain categories this single handbook source is expected to feed */
export const HANDBOOK_FEED_BRAIN_CATEGORIES = [
  "Irrigation",
  "Crop Steering",
  "Environment",
  "Nutrition",
] as const satisfies readonly KnowledgeBrainCategory[];

/** @deprecated Use HANDBOOK_FEED_BRAIN_CATEGORIES */
export const IRRIGATION_BRAIN_CATEGORIES = HANDBOOK_FEED_BRAIN_CATEGORIES;

export type HandbookTargetConcept = {
  slug: string;
  label: string;
  /** Suggested primary Brain category — extractors may override per entry */
  category: KnowledgeBrainCategory;
  subcategory: string;
  topic: string;
  relatedMetrics: string[];
  phaseRelevance: GrowPhase[];
};

/** Target concepts for first handbook ingestion (multi-category) */
export const HANDBOOK_TARGET_CONCEPTS: HandbookTargetConcept[] = [
  {
    slug: "dryback",
    label: "Dryback",
    category: "Irrigation",
    subcategory: "Dryback",
    topic: "Irrigation",
    relatedMetrics: ["dryback_percent", "irrigation_count"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "ec-runoff",
    label: "EC Runoff",
    category: "Irrigation",
    subcategory: "EC Management",
    topic: "Irrigation",
    relatedMetrics: ["ec_in", "ec_runoff", "runoff_percent"],
    phaseRelevance: ["Flower", "Vegetative"],
  },
  {
    slug: "ph",
    label: "pH",
    category: "Nutrition",
    subcategory: "pH Management",
    topic: "Nutrition",
    relatedMetrics: ["ph_in", "ph_runoff"],
    phaseRelevance: ["Vegetative", "Flower", "All"],
  },
  {
    slug: "vpd",
    label: "VPD",
    category: "Environment",
    subcategory: "VPD",
    topic: "Environment",
    relatedMetrics: ["vpd", "temperature", "humidity"],
    phaseRelevance: ["Vegetative", "Flower", "All"],
  },
  {
    slug: "temperature",
    label: "Temperature",
    category: "Environment",
    subcategory: "Temperature",
    topic: "Environment",
    relatedMetrics: ["temperature"],
    phaseRelevance: ["All"],
  },
  {
    slug: "humidity",
    label: "Humidity",
    category: "Environment",
    subcategory: "Humidity",
    topic: "Environment",
    relatedMetrics: ["humidity"],
    phaseRelevance: ["All"],
  },
  {
    slug: "p1-irrigation",
    label: "P1 Irrigation",
    category: "Irrigation",
    subcategory: "P1/P2/P3",
    topic: "Irrigation",
    relatedMetrics: ["irrigation_count", "irrigation_volume_per_event"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "p2-irrigation",
    label: "P2 Irrigation",
    category: "Irrigation",
    subcategory: "P1/P2/P3",
    topic: "Irrigation",
    relatedMetrics: ["irrigation_count", "irrigation_volume_per_event"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "p3-irrigation",
    label: "P3 Irrigation",
    category: "Irrigation",
    subcategory: "P1/P2/P3",
    topic: "Irrigation",
    relatedMetrics: ["irrigation_count", "dryback_percent"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "field-capacity",
    label: "Field Capacity",
    category: "Irrigation",
    subcategory: "Substrate",
    topic: "Irrigation",
    relatedMetrics: ["dryback_percent", "runoff_percent"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "generative-steering",
    label: "Generative Steering",
    category: "Crop Steering",
    subcategory: "Steering",
    topic: "Crop steering",
    relatedMetrics: ["dryback_percent", "ec_runoff", "vpd"],
    phaseRelevance: ["Flower"],
  },
  {
    slug: "vegetative-steering",
    label: "Vegetative Steering",
    category: "Crop Steering",
    subcategory: "Steering",
    topic: "Crop steering",
    relatedMetrics: ["dryback_percent", "ec_runoff", "vpd"],
    phaseRelevance: ["Vegetative"],
  },
  {
    slug: "first-shot-timing",
    label: "First Shot Timing",
    category: "Irrigation",
    subcategory: "Timing",
    topic: "Irrigation",
    relatedMetrics: ["irrigation_count"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "last-shot-timing",
    label: "Last Shot Timing",
    category: "Irrigation",
    subcategory: "Timing",
    topic: "Irrigation",
    relatedMetrics: ["irrigation_count", "dryback_percent"],
    phaseRelevance: ["Flower"],
  },
  {
    slug: "overnight-dryback",
    label: "Overnight Dryback",
    category: "Irrigation",
    subcategory: "Dryback",
    topic: "Irrigation",
    relatedMetrics: ["dryback_percent"],
    phaseRelevance: ["Flower"],
  },
  {
    slug: "root-zone-oxygenation",
    label: "Root Zone Management",
    category: "Irrigation",
    subcategory: "Root Zone",
    topic: "Irrigation",
    relatedMetrics: ["dryback_percent", "runoff_percent", "ec_runoff"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "irrigation-strategy",
    label: "Irrigation Strategy",
    category: "Irrigation",
    subcategory: "Strategy",
    topic: "Irrigation",
    relatedMetrics: ["irrigation_count", "irrigation_volume_per_event", "runoff_percent"],
    phaseRelevance: ["Vegetative", "Flower"],
  },
  {
    slug: "runoff-percent",
    label: "Runoff",
    category: "Irrigation",
    subcategory: "Runoff",
    topic: "Irrigation",
    relatedMetrics: ["runoff_percent", "ec_runoff"],
    phaseRelevance: ["Flower", "Vegetative"],
  },
];

/** @deprecated Use HANDBOOK_TARGET_CONCEPTS */
export const IRRIGATION_TARGET_CONCEPTS = HANDBOOK_TARGET_CONCEPTS;

export const HANDBOOK_TARGET_ENTRY_COUNT = HANDBOOK_TARGET_CONCEPTS.length;

/** @deprecated Use HANDBOOK_TARGET_ENTRY_COUNT */
export const IRRIGATION_TARGET_ENTRY_COUNT = HANDBOOK_TARGET_ENTRY_COUNT;

export function getHandbookConceptBySlug(slug: string): HandbookTargetConcept | undefined {
  return HANDBOOK_TARGET_CONCEPTS.find((concept) => concept.slug === slug);
}
