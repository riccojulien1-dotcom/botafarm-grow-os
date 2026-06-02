import { z } from "zod";

import {
  KNOWLEDGE_BRAIN_CATEGORIES,
  KNOWLEDGE_CONFIDENCE_LEVELS,
  KNOWLEDGE_CONTENT_STATUSES,
  KNOWLEDGE_ENTRY_KINDS,
  KNOWLEDGE_PRIORITIES,
  KNOWLEDGE_SOURCE_TYPES,
} from "@/lib/knowledge-base/types";

const growPhaseSchema = z.enum([
  "Clone",
  "Mother",
  "Vegetative",
  "Pre-Flower",
  "Flower",
  "Drying",
  "Cure",
  "All",
]);

export const knowledgeSourceReferenceSchema = z.object({
  sourceType: z.enum(KNOWLEDGE_SOURCE_TYPES),
  sourceTitle: z.string().min(1),
  section: z.string().optional(),
  internalReferenceId: z.string().min(1),
});

export const knowledgeIngestionPayloadSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  title: z.string().min(1),
  entryKind: z.enum(KNOWLEDGE_ENTRY_KINDS).optional(),
  sourceReference: knowledgeSourceReferenceSchema,
  category: z.enum(KNOWLEDGE_BRAIN_CATEGORIES),
  subcategory: z.string().min(1),
  topic: z.string().min(1),
  subject: z.string().min(1),
  phaseRelevance: z.array(growPhaseSchema).min(1),
  relatedMetrics: z.array(z.string().min(1)),
  shortSummary: z.string().min(1).max(500),
  knowledgeSummary: z.string().min(1).max(4000),
  practicalActions: z.array(z.string().min(1)).min(1),
  commonMistakes: z.array(z.string().min(1)),
  warnings: z.array(z.string().min(1)),
  recommendedRanges: z
    .array(
      z.object({
        phase: z.union([growPhaseSchema, z.string()]).optional(),
        label: z.string(),
        min: z.number().optional(),
        max: z.number().optional(),
        unit: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
  tags: z.array(z.string().min(1)).min(1),
  priority: z.enum(KNOWLEDGE_PRIORITIES).optional(),
  confidenceLevel: z.enum(KNOWLEDGE_CONFIDENCE_LEVELS).optional(),
  contentStatus: z.enum(KNOWLEDGE_CONTENT_STATUSES).optional(),
});

export const structuredIngestionBatchSchema = z.object({
  sourceId: z.string().min(1),
  batchId: z.string().min(1),
  format: z.enum(["structured_text", "markdown", "pdf", "docx"]).optional(),
  entries: z.array(knowledgeIngestionPayloadSchema).min(1),
});
