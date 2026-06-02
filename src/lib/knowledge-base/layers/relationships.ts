import { getRelatedKnowledge } from "@/lib/knowledge-base/brain";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

export type KnowledgeRelationship = {
  fromEntryId: string;
  toEntryId: string;
  type: "shared_metric" | "shared_tag" | "same_category" | "same_topic" | "same_source";
  strength: number;
};

/**
 * Knowledge Relationship Layer — maps extracted entry relationships (not document structure).
 */
export function buildKnowledgeRelationships(
  entries: KnowledgeEntry[] = KNOWLEDGE_BASE_ENTRIES,
): KnowledgeRelationship[] {
  const relationships: KnowledgeRelationship[] = [];

  for (const entry of entries) {
    for (const other of entries) {
      if (other.id === entry.id) {
        continue;
      }

      const sharedMetrics = entry.relatedMetrics.filter((metric) =>
        other.relatedMetrics.includes(metric),
      );
      if (sharedMetrics.length) {
        relationships.push({
          fromEntryId: entry.id,
          toEntryId: other.id,
          type: "shared_metric",
          strength: sharedMetrics.length,
        });
      }

      const sharedTags = entry.tags.filter((tag) => other.tags.includes(tag));
      if (sharedTags.length) {
        relationships.push({
          fromEntryId: entry.id,
          toEntryId: other.id,
          type: "shared_tag",
          strength: sharedTags.length,
        });
      }

      if (entry.category === other.category) {
        relationships.push({
          fromEntryId: entry.id,
          toEntryId: other.id,
          type: "same_category",
          strength: 1,
        });
      }

      if (entry.topic === other.topic) {
        relationships.push({
          fromEntryId: entry.id,
          toEntryId: other.id,
          type: "same_topic",
          strength: 1,
        });
      }

      if (
        entry.sourceReference.sourceTitle === other.sourceReference.sourceTitle
      ) {
        relationships.push({
          fromEntryId: entry.id,
          toEntryId: other.id,
          type: "same_source",
          strength: 1,
        });
      }
    }
  }

  return relationships;
}

export function getKnowledgeRelationshipsForEntry(entryId: string): KnowledgeRelationship[] {
  return buildKnowledgeRelationships().filter(
    (relationship) => relationship.fromEntryId === entryId,
  );
}

export function getRelatedEntriesViaRelationships(entryId: string): KnowledgeEntry[] {
  return getRelatedKnowledge(entryId);
}

export function countKnowledgeRelationships(): number {
  return buildKnowledgeRelationships().length;
}
