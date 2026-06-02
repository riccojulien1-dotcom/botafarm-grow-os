import {
  HANDBOOK_FEED_BRAIN_CATEGORIES,
  IRRIGATION_HANDBOOK_SOURCE_ID,
  IRRIGATION_REFERENCE_PREFIX,
  getHandbookConceptBySlug,
} from "@/lib/knowledge-base/domains/irrigation-manifest";
import {
  KNOWLEDGE_BRAIN_CATEGORIES,
  type GrowPhase,
  type KnowledgeBrainCategory,
  type KnowledgeIngestionPayload,
} from "@/lib/knowledge-base/types";

export type EntryClassification = {
  entryId: string;
  title: string;
  category: string;
  subcategory: string;
  topic: string;
  relatedMetrics: string[];
  phaseRelevance: GrowPhase[];
};

export type BatchClassificationSummary = {
  categories: string[];
  metrics: string[];
  phases: GrowPhase[];
  feedsMultipleCategories: boolean;
  feedsMultipleMetrics: boolean;
  feedsMultiplePhases: boolean;
  entries: EntryClassification[];
};

export function isValidBrainCategory(
  category: string,
): category is KnowledgeBrainCategory {
  return (KNOWLEDGE_BRAIN_CATEGORIES as readonly string[]).includes(category);
}

export function summarizeBatchClassification(
  payloads: KnowledgeIngestionPayload[],
): BatchClassificationSummary {
  const categories = new Set<string>();
  const metrics = new Set<string>();
  const phases = new Set<GrowPhase>();

  const entries: EntryClassification[] = payloads.map((payload) => {
    categories.add(payload.category);
    for (const metric of payload.relatedMetrics) {
      metrics.add(metric);
    }
    for (const phase of payload.phaseRelevance) {
      phases.add(phase);
    }

    return {
      entryId: payload.id,
      title: payload.title,
      category: payload.category,
      subcategory: payload.subcategory,
      topic: payload.topic,
      relatedMetrics: payload.relatedMetrics,
      phaseRelevance: payload.phaseRelevance,
    };
  });

  return {
    categories: [...categories].sort(),
    metrics: [...metrics].sort(),
    phases: [...phases].sort(),
    feedsMultipleCategories: categories.size > 1,
    feedsMultipleMetrics: metrics.size > 1,
    feedsMultiplePhases: phases.size > 1,
    entries,
  };
}

/**
 * Per-entry rules: independent classification into any valid Brain category.
 * Handbook source only enforces citation prefix — not a single domain category.
 */
export function validateIndependentEntryClassification(
  payload: KnowledgeIngestionPayload,
  sourceId: string,
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isValidBrainCategory(payload.category)) {
    errors.push(
      `Invalid category "${payload.category}". Must be a Brain category: ${KNOWLEDGE_BRAIN_CATEGORIES.join(", ")}`,
    );
  }

  if (!payload.topic.trim()) {
    errors.push("topic is required for Brain retrieval.");
  }

  if (!payload.relatedMetrics.length) {
    errors.push("relatedMetrics must include at least one metric per entry.");
  }

  if (!payload.phaseRelevance.length) {
    errors.push("phaseRelevance must include at least one growth phase per entry.");
  }

  if (!payload.practicalActions.length) {
    errors.push("At least one practical action is required.");
  }

  if (sourceId === IRRIGATION_HANDBOOK_SOURCE_ID) {
    const ref = payload.sourceReference.internalReferenceId;
    if (!ref.startsWith(`${IRRIGATION_REFERENCE_PREFIX}-`)) {
      errors.push(
        `Handbook entries must use internalReferenceId prefix ${IRRIGATION_REFERENCE_PREFIX}-* (citation traceability).`,
      );
    }

    const manifestConcept = getHandbookConceptBySlug(payload.id);
    if (manifestConcept && manifestConcept.category !== payload.category) {
      warnings.push(
        `Entry "${payload.id}" is classified as "${payload.category}"; manifest suggests "${manifestConcept.category}". Independent classification is allowed — verify intentionally.`,
      );
    }
  }

  return { errors, warnings };
}

export function validateHandbookFeedsBrainDomains(
  payloads: KnowledgeIngestionPayload[],
  sourceId: string,
): string[] {
  if (sourceId !== IRRIGATION_HANDBOOK_SOURCE_ID || payloads.length < 2) {
    return [];
  }

  const summary = summarizeBatchClassification(payloads);
  const warnings: string[] = [];

  if (!summary.feedsMultipleCategories) {
    warnings.push(
      "Batch only feeds one Brain category. The handbook is expected to span Irrigation, Crop Steering, Environment, and Nutrition across entries.",
    );
  }

  const missingFeedCategories = HANDBOOK_FEED_BRAIN_CATEGORIES.filter(
    (category) => !summary.categories.includes(category),
  );
  if (missingFeedCategories.length === HANDBOOK_FEED_BRAIN_CATEGORIES.length) {
    warnings.push("No expected handbook feed categories are represented in this batch.");
  }

  return warnings;
}
