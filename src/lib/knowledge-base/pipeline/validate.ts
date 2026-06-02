import { z } from "zod";

import {
  summarizeBatchClassification,
  validateHandbookFeedsBrainDomains,
  validateIndependentEntryClassification,
} from "@/lib/knowledge-base/pipeline/classification";
import { validateIngestionPayload } from "@/lib/knowledge-base/layers/ingestion";
import { assertNoForbiddenKnowledgeFields } from "@/lib/knowledge-base/privacy";
import {
  knowledgeIngestionPayloadSchema,
  structuredIngestionBatchSchema,
} from "@/lib/knowledge-base/pipeline/schemas";
import type {
  KnowledgeBatchValidationReport,
  KnowledgeBatchValidationRow,
} from "@/lib/knowledge-base/pipeline/types";
import type { KnowledgeIngestionPayload } from "@/lib/knowledge-base/types";

const MAX_DOCUMENT_INPUT_BYTES = 512_000;
const MAX_BATCH_ENTRIES = 200;

const EXTRA_FORBIDDEN_DOCUMENT_KEYS = [
  "rawContent",
  "rawDocumentText",
  "fullChapter",
  "chapterText",
  "fullText",
  "pdfUrl",
  "documentUrl",
  "downloadUrl",
  "exportUrl",
  "pageContent",
  "pages",
] as const;

export function assertNoForbiddenDocumentFields(
  payload: Record<string, unknown>,
): string[] {
  const base = assertNoForbiddenKnowledgeFields(payload);
  const extra = EXTRA_FORBIDDEN_DOCUMENT_KEYS.filter(
    (key) => key in payload && payload[key] != null,
  );
  return [...base, ...extra];
}

export function validateDocumentInputSize(content: string): string[] {
  const bytes = new TextEncoder().encode(content).length;
  if (bytes > MAX_DOCUMENT_INPUT_BYTES) {
    return [
      `Document input exceeds ${MAX_DOCUMENT_INPUT_BYTES} bytes. Split extraction offline — never upload full books.`,
    ];
  }
  return [];
}

export function validateSingleIngestionPayload(
  payload: KnowledgeIngestionPayload & Record<string, unknown>,
  sourceId: string,
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const forbidden = assertNoForbiddenDocumentFields(payload);
  if (forbidden.length) {
    errors.push(`Forbidden fields: ${forbidden.join(", ")}`);
  }

  const zod = knowledgeIngestionPayloadSchema.safeParse(payload);
  if (!zod.success) {
    errors.push(...zod.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`));
  }

  const legacy = validateIngestionPayload(payload);
  if (!legacy.valid) {
    errors.push(...legacy.errors);
  }

  const classification = validateIndependentEntryClassification(payload, sourceId);
  errors.push(...classification.errors);
  warnings.push(...classification.warnings);

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
  };
}

export function validateIngestionBatch(
  payloads: KnowledgeIngestionPayload[],
  sourceId: string,
  batchId = "inline",
): KnowledgeBatchValidationReport {
  const rows: KnowledgeBatchValidationRow[] = payloads.map((payload, index) => {
    const result = validateSingleIngestionPayload(
      payload as KnowledgeIngestionPayload & Record<string, unknown>,
      sourceId,
    );
    return {
      index,
      entryId: payload.id,
      title: payload.title,
      category: payload.category,
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
    };
  });

  const validCount = rows.filter((row) => row.valid).length;
  const batchWarnings = validateHandbookFeedsBrainDomains(payloads, sourceId);

  return {
    sourceId,
    batchId,
    total: rows.length,
    validCount,
    invalidCount: rows.length - validCount,
    rows,
    classificationSummary: summarizeBatchClassification(payloads),
    batchWarnings,
  };
}

export function parseStructuredIngestionBatch(content: string): {
  ok: true;
  sourceId: string;
  batchId: string;
  entries: KnowledgeIngestionPayload[];
} | {
  ok: false;
  errors: string[];
} {
  const sizeErrors = validateDocumentInputSize(content);
  if (sizeErrors.length) {
    return { ok: false, errors: sizeErrors };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, errors: ["Invalid JSON. Expected structured extraction batch."] };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, errors: ["Batch root must be an object."] };
  }

  const forbidden = assertNoForbiddenDocumentFields(parsed as Record<string, unknown>);
  if (forbidden.length) {
    return {
      ok: false,
      errors: [`Forbidden document fields in batch: ${forbidden.join(", ")}`],
    };
  }

  const zod = structuredIngestionBatchSchema.safeParse(parsed);
  if (!zod.success) {
    return {
      ok: false,
      errors: zod.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }

  if (zod.data.entries.length > MAX_BATCH_ENTRIES) {
    return {
      ok: false,
      errors: [`Batch exceeds maximum of ${MAX_BATCH_ENTRIES} entries per run.`],
    };
  }

  return {
    ok: true,
    sourceId: zod.data.sourceId,
    batchId: zod.data.batchId,
    entries: zod.data.entries,
  };
}
