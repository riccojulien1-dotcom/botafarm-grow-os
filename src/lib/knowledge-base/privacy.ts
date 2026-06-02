import type { KnowledgeEntry, PublicKnowledgeEntry } from "@/lib/knowledge-base/types";

/** Fields that must never be exposed in user-facing APIs or UI */
const FORBIDDEN_PUBLIC_KEYS = [
  "rawContent",
  "rawDocumentText",
  "fullChapter",
  "pdfUrl",
  "documentUrl",
  "downloadUrl",
  "exportUrl",
] as const;

export function assertNoForbiddenKnowledgeFields(
  payload: Record<string, unknown>,
): string[] {
  return FORBIDDEN_PUBLIC_KEYS.filter((key) => key in payload && payload[key] != null);
}

/** Strips internal ingestion metadata — users see citations only */
export function toPublicKnowledgeEntry(entry: KnowledgeEntry): PublicKnowledgeEntry {
  const { sourceMetadata: _removed, ...publicEntry } = entry;
  return publicEntry;
}

export const KNOWLEDGE_ACCESS_POLICY = {
  allowsDocumentDownload: false,
  allowsFullChapterRead: false,
  allowsPdfBrowse: false,
  allowsRawSourceExport: false,
  allowsExtractedKnowledgeOnly: true,
} as const;
