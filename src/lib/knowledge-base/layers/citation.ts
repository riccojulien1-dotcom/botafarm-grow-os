import type { KnowledgeEntry, KnowledgeSourceReference } from "@/lib/knowledge-base/types";

export type KnowledgeCitation = {
  sourceType: string;
  sourceTitle: string;
  section?: string;
  internalReferenceId: string;
  catalogEntryId: string;
  displayLine: string;
};

/**
 * Source Citation Layer — citation strings only; never includes raw document content.
 */
export function buildKnowledgeCitation(entry: KnowledgeEntry): KnowledgeCitation {
  const ref = entry.sourceReference;
  const sectionPart = ref.section ? ` · ${ref.section}` : "";

  return {
    sourceType: ref.sourceType,
    sourceTitle: ref.sourceTitle,
    section: ref.section,
    internalReferenceId: ref.internalReferenceId,
    catalogEntryId: entry.id,
    displayLine: `${ref.sourceTitle}${sectionPart} · Ref ${ref.internalReferenceId}`,
  };
}

export function formatCitationBlock(entry: KnowledgeEntry): string {
  const citation = buildKnowledgeCitation(entry);
  return `Source: ${citation.sourceTitle}\nReference: ${citation.internalReferenceId}`;
}

export function citationsMatchSource(
  a: KnowledgeSourceReference,
  b: KnowledgeSourceReference,
): boolean {
  return (
    a.sourceTitle === b.sourceTitle &&
    a.internalReferenceId.split("-")[0] === b.internalReferenceId.split("-")[0]
  );
}
