import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import type { GrowPhase, KnowledgeEntry } from "@/lib/knowledge-base/types";

/**
 * Maps rule-engine recommendation metric labels to stable knowledge entry ids.
 * Extend as new recommendation rules and knowledge entries are added.
 */
export const RECOMMENDATION_METRIC_TO_KNOWLEDGE_ID: Record<string, string> = {
  "EC Management": "ec-runoff",
  Dryback: "dryback",
  VPD: "vpd",
  PPFD: "ppfd",
};

export function resolveKnowledgeEntryIdForRecommendationMetric(
  metric: string,
): string | undefined {
  return RECOMMENDATION_METRIC_TO_KNOWLEDGE_ID[metric];
}

export function getKnowledgeEntryForRecommendationMetric(
  metric: string,
): KnowledgeEntry | undefined {
  const id = resolveKnowledgeEntryIdForRecommendationMetric(metric);
  if (!id) {
    return undefined;
  }
  return KNOWLEDGE_BASE_ENTRIES.find((entry) => entry.id === id);
}

export function getKnowledgeEntriesForRecommendation(
  metric: string,
  roomPhase?: string,
): KnowledgeEntry[] {
  const primary = getKnowledgeEntryForRecommendationMetric(metric);
  const normalized = normalizeMetricKey(metric);
  const byMetric = KNOWLEDGE_BASE_ENTRIES.filter((entry) =>
    entry.relatedMetrics.some((item) => item.toLowerCase() === normalized),
  );

  const seen = new Set<string>();
  const merged: KnowledgeEntry[] = [];

  for (const entry of [primary, ...byMetric].filter(Boolean) as KnowledgeEntry[]) {
    if (seen.has(entry.id)) {
      continue;
    }
    seen.add(entry.id);
    if (roomPhase && !entryAppliesToPhase(entry, roomPhase)) {
      continue;
    }
    merged.push(entry);
  }

  return merged;
}

function normalizeMetricKey(metric: string): string {
  const map: Record<string, string> = {
    "EC Management": "ec_runoff",
    Dryback: "dryback_percent",
    VPD: "vpd",
    PPFD: "ppfd",
    pH: "ph_in",
  };
  return map[metric] ?? metric.toLowerCase().replace(/\s+/g, "_");
}

function entryAppliesToPhase(entry: KnowledgeEntry, roomPhase: string): boolean {
  if (entry.phaseRelevance.includes("All")) {
    return true;
  }
  return entry.phaseRelevance.includes(roomPhase as GrowPhase);
}
