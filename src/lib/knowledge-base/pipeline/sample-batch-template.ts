import {
  IRRIGATION_HANDBOOK_SOURCE_ID,
  IRRIGATION_HANDBOOK_TITLE,
} from "@/lib/knowledge-base/domains/irrigation-manifest";

/**
 * Multi-domain extraction envelope — each entry carries its own category,
 * metrics, and phases. Sprint 26 template only; no book content loaded.
 */
export const HANDBOOK_EXTRACTION_BATCH_TEMPLATE = {
  sourceId: IRRIGATION_HANDBOOK_SOURCE_ID,
  batchId: "irr-batch-001",
  format: "structured_text" as const,
  entries: [
    {
      id: "dryback",
      title: "Dryback",
      entryKind: "concept" as const,
      sourceReference: {
        sourceType: "book" as const,
        sourceTitle: IRRIGATION_HANDBOOK_TITLE,
        section: "Dryback fundamentals",
        internalReferenceId: "IRR-017",
      },
      category: "Irrigation",
      subcategory: "Dryback",
      topic: "Irrigation",
      subject: "Substrate dryback between irrigation events",
      phaseRelevance: ["Flower", "Vegetative"] as const,
      relatedMetrics: ["dryback_percent", "irrigation_count"],
      shortSummary: "Replace with extracted summary — max 500 chars.",
      knowledgeSummary:
        "Replace with extracted operational knowledge — never paste full chapter text.",
      practicalActions: ["Replace with actionable steps from extraction."],
      commonMistakes: ["Replace with common mistakes."],
      warnings: ["Replace with warnings."],
      tags: ["dryback", "irrigation", "crop-steering"],
      contentStatus: "extracted" as const,
      confidenceLevel: "high" as const,
    },
    {
      id: "vpd",
      title: "VPD",
      entryKind: "concept" as const,
      sourceReference: {
        sourceType: "book" as const,
        sourceTitle: IRRIGATION_HANDBOOK_TITLE,
        section: "VPD and transpiration",
        internalReferenceId: "IRR-003",
      },
      category: "Environment",
      subcategory: "VPD",
      topic: "Environment",
      subject: "Vapor pressure deficit and canopy transpiration",
      phaseRelevance: ["Vegetative", "Flower", "All"] as const,
      relatedMetrics: ["vpd", "temperature", "humidity"],
      shortSummary: "Replace with extracted summary.",
      knowledgeSummary: "Replace with extracted knowledge.",
      practicalActions: ["Replace with practical actions."],
      commonMistakes: [],
      warnings: [],
      tags: ["vpd", "environment"],
      contentStatus: "extracted" as const,
      confidenceLevel: "high" as const,
    },
    {
      id: "generative-steering",
      title: "Generative Steering",
      entryKind: "sop" as const,
      sourceReference: {
        sourceType: "book" as const,
        sourceTitle: IRRIGATION_HANDBOOK_TITLE,
        section: "Generative steering program",
        internalReferenceId: "IRR-012",
      },
      category: "Crop Steering",
      subcategory: "Steering",
      topic: "Crop steering",
      subject: "Generative irrigation and environment steering",
      phaseRelevance: ["Flower"] as const,
      relatedMetrics: ["dryback_percent", "ec_runoff", "vpd"],
      shortSummary: "Replace with extracted summary.",
      knowledgeSummary: "Replace with extracted knowledge.",
      practicalActions: ["Replace with practical actions."],
      commonMistakes: [],
      warnings: [],
      tags: ["crop-steering", "generative"],
      contentStatus: "extracted" as const,
      confidenceLevel: "high" as const,
    },
  ],
};

/** @deprecated Use HANDBOOK_EXTRACTION_BATCH_TEMPLATE */
export const IRRIGATION_EXTRACTION_BATCH_TEMPLATE = HANDBOOK_EXTRACTION_BATCH_TEMPLATE;

export function formatHandbookBatchTemplateJson() {
  return JSON.stringify(HANDBOOK_EXTRACTION_BATCH_TEMPLATE, null, 2);
}

/** @deprecated Use formatHandbookBatchTemplateJson */
export const formatIrrigationBatchTemplateJson = formatHandbookBatchTemplateJson;
