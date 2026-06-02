import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import {
  filterKnowledgeEntries,
  getKnowledgeEntriesByPhase,
  getKnowledgeEntryById,
  searchKnowledgeEntries,
} from "@/lib/knowledge-base/catalog";
import { resolveMetricSearchKeys } from "@/lib/knowledge-base/metric-aliases";
import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base/constants";
import type {
  GrowPhase,
  KnowledgeEntry,
  KnowledgeFilterParams,
} from "@/lib/knowledge-base/types";

export type KnowledgeAlertContext = {
  metric?: string;
  phase?: string;
  topic?: string;
  tag?: string;
};

export type KnowledgeRoomContext = {
  status: string;
  /** Optional focus metrics from latest log or UI selection */
  metrics?: string[];
};

function sortByPriority(entries: KnowledgeEntry[]): KnowledgeEntry[] {
  const weight = { high: 0, medium: 1, low: 2 };
  return [...entries].sort((left, right) => {
    const priorityDelta = weight[left.priority] - weight[right.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }
    return left.title.localeCompare(right.title);
  });
}

function entryMatchesPhase(entry: KnowledgeEntry, phase: string): boolean {
  return (
    entry.phaseRelevance.includes("All") ||
    entry.phaseRelevance.includes(phase as GrowPhase)
  );
}

function entryMatchesMetric(entry: KnowledgeEntry, metricKeys: string[]): boolean {
  const normalized = new Set(entry.relatedMetrics.map((item) => item.toLowerCase()));
  return metricKeys.some((key) => normalized.has(key.toLowerCase()));
}

function entryMatchesTopic(entry: KnowledgeEntry, topic: string): boolean {
  const normalized = topic.trim().toLowerCase();
  return (
    (entry.topic?.toLowerCase() ?? "") === normalized ||
    entry.category.toLowerCase().includes(normalized) ||
    entry.tags.some((tag) => tag.toLowerCase() === normalized)
  );
}

/** Primary search — catalog only; never synthesizes content */
export function searchKnowledge(
  query: string,
  params: Omit<KnowledgeFilterParams, "query"> = {},
): KnowledgeEntry[] {
  const filtered = filterKnowledgeEntries(params);
  return searchKnowledgeEntries(query, filtered);
}

export function getKnowledgeByMetric(metric: string): KnowledgeEntry[] {
  const keys = resolveMetricSearchKeys(metric);
  const matches = KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
    entryMatchesMetric(entry, keys),
  );
  return sortByPriority(matches);
}

export function getKnowledgeByTopic(topic: string): KnowledgeEntry[] {
  return sortByPriority(
    KNOWLEDGE_BASE_ENTRIES.filter((entry) => entryMatchesTopic(entry, topic)),
  );
}

export function getKnowledgeByPhase(phase: string): KnowledgeEntry[] {
  return sortByPriority(getKnowledgeEntriesByPhase(phase));
}

/** Related by shared metrics, tags, category, or topic — excludes self */
export function getRelatedKnowledge(entryId: string, limit = 6): KnowledgeEntry[] {
  const entry = getKnowledgeEntryById(entryId);
  if (!entry) {
    return [];
  }

  const scored = KNOWLEDGE_BASE_ENTRIES.filter((candidate) => candidate.id !== entryId).map(
    (candidate) => {
      let score = 0;
      const sharedMetrics = candidate.relatedMetrics.filter((metric) =>
        entry.relatedMetrics.includes(metric),
      );
      score += sharedMetrics.length * 3;

      const sharedTags = candidate.tags.filter((tag) => entry.tags.includes(tag));
      score += sharedTags.length * 2;

      if (candidate.category === entry.category) {
        score += 2;
      }
      if (candidate.topic && candidate.topic === entry.topic) {
        score += 2;
      }

      const sharedPhases = candidate.phaseRelevance.filter((phase) =>
        entry.phaseRelevance.includes(phase),
      );
      score += sharedPhases.length;

      return { candidate, score };
    },
  );

  return sortByPriority(
    scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.candidate),
  );
}

/** Future alerts engine — returns only catalog entries applicable to context */
export function retrieveKnowledgeForAlert(
  context: KnowledgeAlertContext,
): KnowledgeEntry[] {
  let entries = [...KNOWLEDGE_BASE_ENTRIES];

  if (context.metric) {
    const keys = resolveMetricSearchKeys(context.metric);
    entries = entries.filter((entry) => entryMatchesMetric(entry, keys));
  }

  if (context.phase) {
    entries = entries.filter((entry) => entryMatchesPhase(entry, context.phase!));
  }

  if (context.topic) {
    entries = entries.filter((entry) => entryMatchesTopic(entry, context.topic!));
  }

  if (context.tag) {
    const tag = context.tag.trim().toLowerCase();
    entries = entries.filter((entry) =>
      entry.tags.some((item) => item.toLowerCase() === tag),
    );
  }

  return sortByPriority(entries);
}

/** Future room intelligence — phase-aware catalog slice */
export function retrieveKnowledgeForRoom(context: KnowledgeRoomContext): KnowledgeEntry[] {
  let entries = KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
    entryMatchesPhase(entry, context.status),
  );

  if (context.metrics?.length) {
    const keys = context.metrics.flatMap((metric) => resolveMetricSearchKeys(metric));
    const metricMatches = KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
      entryMatchesMetric(entry, keys),
    );
    const ids = new Set(metricMatches.map((entry) => entry.id));
    entries = entries.filter((entry) => ids.has(entry.id));
  }

  return sortByPriority(entries);
}

export function getKnowledgeForRoomMetric(
  metricId: string,
  roomPhase: string,
): KnowledgeEntry[] {
  return sortByPriority(
    getKnowledgeByMetric(metricId).filter((entry) => entryMatchesPhase(entry, roomPhase)),
  );
}

export function formatKnowledgeSourceCitation(entry: KnowledgeEntry): string {
  const meta = entry.sourceMetadata;
  const parts: string[] = [];

  if (meta?.documentTitle) {
    parts.push(meta.documentTitle);
  }
  if (meta?.author) {
    parts.push(meta.author);
  }
  if (meta?.chapter) {
    parts.push(meta.chapter);
  }
  if (meta?.section) {
    parts.push(meta.section);
  }

  if (parts.length) {
    return parts.join(" · ");
  }

  return `${KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]} · ${entry.category} · ID ${entry.id}`;
}
