import { getDocumentAdapter } from "@/lib/knowledge-base/pipeline/document-adapters";
import { parseStructuredIngestionBatch } from "@/lib/knowledge-base/pipeline/validate";
import type {
  KnowledgeDocumentInput,
  KnowledgeExtractionCandidate,
  KnowledgePipelineExtractionResult,
} from "@/lib/knowledge-base/pipeline/types";
import type { KnowledgeEntryKind } from "@/lib/knowledge-base/types";

function inferEntryKind(tags: string[]): KnowledgeEntryKind {
  const normalized = tags.map((tag) => tag.toLowerCase());
  if (normalized.some((tag) => tag.includes("sop"))) return "sop";
  if (normalized.some((tag) => tag.includes("diagnostic"))) return "diagnostic";
  if (normalized.some((tag) => tag.includes("rule"))) return "rule";
  if (normalized.some((tag) => tag.includes("corrective"))) return "corrective_action";
  return "concept";
}

/**
 * Extract structured knowledge candidates from an admin document input.
 * Raw document bytes/text are not retained after this function returns.
 */
export function extractKnowledgeFromDocument(
  input: KnowledgeDocumentInput,
): KnowledgePipelineExtractionResult {
  const adapter = getDocumentAdapter(input.format);
  if (!adapter) {
    return {
      ok: false,
      sourceId: input.sourceId,
      batchId: input.batchId,
      errors: [`No adapter registered for format: ${input.format}`],
    };
  }

  const parsed = adapter.parse(input);
  if (!parsed.ok) {
    return {
      ok: false,
      sourceId: input.sourceId,
      batchId: input.batchId,
      errors: parsed.errors,
    };
  }

  const batch = parseStructuredIngestionBatch(parsed.structuredJson);
  if (!batch.ok) {
    return {
      ok: false,
      sourceId: input.sourceId,
      batchId: input.batchId,
      errors: batch.errors,
    };
  }

  if (batch.sourceId !== input.sourceId) {
    return {
      ok: false,
      sourceId: input.sourceId,
      batchId: input.batchId,
      errors: [
        `Batch sourceId "${batch.sourceId}" does not match input sourceId "${input.sourceId}".`,
      ],
    };
  }

  const candidates: KnowledgeExtractionCandidate[] = batch.entries.map((payload) => ({
    kind: payload.entryKind ?? inferEntryKind(payload.tags),
    payload,
    extractionNotes: `Extracted via ${adapter.label} adapter (batch ${batch.batchId})`,
  }));

  const discardedInputBytes = new TextEncoder().encode(input.content).length;

  return {
    ok: true,
    sourceId: input.sourceId,
    batchId: batch.batchId,
    format: input.format,
    candidates,
    discardedInputBytes,
  };
}
