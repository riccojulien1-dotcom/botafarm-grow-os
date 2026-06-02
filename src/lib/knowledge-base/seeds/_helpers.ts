import { SEED_TIMESTAMP } from "@/lib/knowledge-base/constants";
import type {
  KnowledgeEntry,
  KnowledgeSourceReference,
  KnowledgeSourceType,
} from "@/lib/knowledge-base/types";

type SeedInput = Omit<
  KnowledgeEntry,
  | "createdAt"
  | "updatedAt"
  | "knowledgeSummary"
  | "commonMistakes"
  | "subcategory"
  | "confidenceLevel"
  | "contentStatus"
  | "sourceReference"
  | "topic"
  | "subject"
> &
  Partial<
    Pick<
      KnowledgeEntry,
      | "createdAt"
      | "updatedAt"
      | "knowledgeSummary"
      | "commonMistakes"
      | "subcategory"
      | "confidenceLevel"
      | "contentStatus"
      | "sourceReference"
      | "topic"
      | "subject"
    >
  > & {
    /** @deprecated Use knowledgeSummary — legacy seed field */
    detailedContent?: string;
  };

function defaultSourceReference(
  entry: SeedInput,
): KnowledgeSourceReference {
  const meta = entry.sourceMetadata;
  return {
    sourceType: entry.sourceType,
    sourceTitle: meta?.documentTitle ?? `Botafarm ${entry.category}`,
    section: meta?.section,
    internalReferenceId: meta?.documentId ?? entry.id.toUpperCase().replace(/-/g, "-"),
  };
}

export function seedEntry(entry: SeedInput): KnowledgeEntry {
  const knowledgeSummary = entry.knowledgeSummary ?? entry.detailedContent ?? "";

  return {
    ...entry,
    topic: entry.topic ?? "General cultivation",
    subject: entry.subject ?? entry.category,
    subcategory: entry.subcategory ?? entry.category,
    commonMistakes: entry.commonMistakes ?? [],
    confidenceLevel: entry.confidenceLevel ?? "high",
    contentStatus: entry.contentStatus ?? "published",
    sourceReference: entry.sourceReference ?? defaultSourceReference(entry),
    knowledgeSummary,
    createdAt: entry.createdAt ?? SEED_TIMESTAMP,
    updatedAt: entry.updatedAt ?? SEED_TIMESTAMP,
  };
}

export function sourceRef(
  sourceType: KnowledgeSourceType,
  sourceTitle: string,
  internalReferenceId: string,
  section?: string,
): KnowledgeSourceReference {
  return { sourceType, sourceTitle, internalReferenceId, section };
}
