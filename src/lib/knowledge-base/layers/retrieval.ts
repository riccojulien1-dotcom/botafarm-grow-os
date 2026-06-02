import {
  getKnowledgeByMetric,
  getKnowledgeByPhase,
  getKnowledgeByTopic,
  getRelatedKnowledge,
  retrieveKnowledgeForAlert,
  retrieveKnowledgeForRoom,
  searchKnowledge,
  type KnowledgeAlertContext,
  type KnowledgeRoomContext,
} from "@/lib/knowledge-base/brain";
import { buildKnowledgeIndex, buildKnowledgeIndexRecord } from "@/lib/knowledge-base/layers/indexing";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import { toPublicKnowledgeEntry } from "@/lib/knowledge-base/privacy";
import type {
  KnowledgeEntry,
  KnowledgeFilterParams,
  PublicKnowledgeEntry,
} from "@/lib/knowledge-base/types";

/**
 * Knowledge Retrieval Layer — user-facing results are always public (extracted) entries.
 */
export function searchPublicKnowledge(
  query: string,
  params: Omit<KnowledgeFilterParams, "query"> = {},
): PublicKnowledgeEntry[] {
  return searchKnowledge(query, params).map(toPublicKnowledgeEntry);
}

export function retrievePublicKnowledgeForRoom(
  context: KnowledgeRoomContext,
): PublicKnowledgeEntry[] {
  return retrieveKnowledgeForRoom(context).map(toPublicKnowledgeEntry);
}

export function retrievePublicKnowledgeForAlert(
  context: KnowledgeAlertContext,
): PublicKnowledgeEntry[] {
  return retrieveKnowledgeForAlert(context).map(toPublicKnowledgeEntry);
}

export function getPublicKnowledgeByMetric(metric: string): PublicKnowledgeEntry[] {
  return getKnowledgeByMetric(metric).map(toPublicKnowledgeEntry);
}

export function getPublicKnowledgeByTopic(topic: string): PublicKnowledgeEntry[] {
  return getKnowledgeByTopic(topic).map(toPublicKnowledgeEntry);
}

export function getPublicKnowledgeByPhase(phase: string): PublicKnowledgeEntry[] {
  return getKnowledgeByPhase(phase).map(toPublicKnowledgeEntry);
}

export function getPublicRelatedKnowledge(entryId: string): PublicKnowledgeEntry[] {
  return getRelatedKnowledge(entryId).map(toPublicKnowledgeEntry);
}

export function getKnowledgeIndexSnapshot() {
  return buildKnowledgeIndex(KNOWLEDGE_BASE_ENTRIES);
}

export function getKnowledgeIndexRecord(entry: KnowledgeEntry) {
  return buildKnowledgeIndexRecord(entry);
}
