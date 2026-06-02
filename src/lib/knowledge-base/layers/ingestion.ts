import { mergeKnowledgeEntries } from "@/lib/knowledge-base/catalog";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import { entryFromIngestionPayload } from "@/lib/knowledge-base/layers/ingestion-mapper";
import { assertNoForbiddenKnowledgeFields } from "@/lib/knowledge-base/privacy";
import type {
  KnowledgeEntry,
  KnowledgeIngestionPayload,
  KnowledgeSourceRegistryEntry,
} from "@/lib/knowledge-base/types";

export type IngestionValidationResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Knowledge Ingestion Layer — Sprint 24 foundation.
 * Accepts extracted knowledge only; rejects raw document payloads.
 */
export function validateIngestionPayload(
  payload: KnowledgeIngestionPayload & Record<string, unknown>,
): IngestionValidationResult {
  const errors: string[] = [];

  const forbidden = assertNoForbiddenKnowledgeFields(payload);
  if (forbidden.length) {
    errors.push(
      `Forbidden proprietary fields: ${forbidden.join(", ")}. Only extracted knowledge is allowed.`,
    );
  }

  if (!payload.id?.trim()) {
    errors.push("Missing entry id.");
  }
  if (!payload.knowledgeSummary?.trim()) {
    errors.push("Missing knowledgeSummary (extracted content required).");
  }
  if (!payload.sourceReference?.internalReferenceId?.trim()) {
    errors.push("Missing sourceReference.internalReferenceId for citation traceability.");
  }
  if (!payload.sourceReference?.sourceTitle?.trim()) {
    errors.push("Missing sourceReference.sourceTitle.");
  }

  if (payload.knowledgeSummary.length > 4000) {
    errors.push(
      "knowledgeSummary exceeds safe extracted limit (4000 chars). Split into multiple entries — never ingest full chapters.",
    );
  }

  return { valid: errors.length === 0, errors };
}

/** Merge validated extracted entry into catalog (admin pipeline / seeds) */
export function ingestExtractedEntry(
  payload: KnowledgeIngestionPayload,
  catalog: KnowledgeEntry[] = KNOWLEDGE_BASE_ENTRIES,
): { ok: true; catalog: KnowledgeEntry[] } | { ok: false; errors: string[] } {
  const validation = validateIngestionPayload(
    payload as KnowledgeIngestionPayload & Record<string, unknown>,
  );
  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  const entry = entryFromIngestionPayload(payload);
  return { ok: true, catalog: mergeKnowledgeEntries(catalog, [entry]) };
}

export function registerKnowledgeSource(
  source: KnowledgeSourceRegistryEntry,
  registry: KnowledgeSourceRegistryEntry[],
): KnowledgeSourceRegistryEntry[] {
  const map = new Map(registry.map((item) => [item.id, item]));
  map.set(source.id, source);
  return [...map.values()].sort((a, b) => a.sourceTitle.localeCompare(b.sourceTitle));
}
