import type { KnowledgeEntry, KnowledgeRagDocument } from "@/lib/knowledge-base/types";

/** Builds a single RAG-ready document from a catalog entry (embedding pipeline input) */
export function buildKnowledgeRagDocument(entry: KnowledgeEntry): KnowledgeRagDocument {
  const contentSections = [
    `# ${entry.title}`,
    `Category: ${entry.category}`,
    `Topic: ${entry.topic}`,
    `Subject: ${entry.subject}`,
    `Source: ${entry.sourceType}`,
    `Phases: ${entry.phaseRelevance.join(", ")}`,
    `Metrics: ${entry.relatedMetrics.join(", ")}`,
    "",
    "## Summary",
    entry.shortSummary,
    "",
    "## Extracted knowledge",
    entry.knowledgeSummary,
    "",
    "## Practical actions",
    ...entry.practicalActions.map((action) => `- ${action}`),
    "",
    "## Warnings",
    ...entry.warnings.map((warning) => `- ${warning}`),
  ];

  if (entry.recommendedRanges.length) {
    contentSections.push(
      "",
      "## Recommended ranges",
      ...entry.recommendedRanges.map((range) => {
        const bounds =
          range.min != null && range.max != null
            ? `${range.min}–${range.max}${range.unit ? ` ${range.unit}` : ""}`
            : (range.notes ?? "");
        return `- ${range.label}${range.phase ? ` (${range.phase})` : ""}: ${bounds}`;
      }),
    );
  }

  if (entry.botafarmNote) {
    contentSections.push("", "## Botafarm note", entry.botafarmNote);
  }

  return {
    id: entry.id,
    title: entry.title,
    sourceType: entry.sourceType,
    category: entry.category,
    phaseRelevance: entry.phaseRelevance,
    relatedMetrics: entry.relatedMetrics,
    priority: entry.priority,
    content: contentSections.join("\n"),
    metadata: {
      sourceReference: entry.sourceReference,
      tags: entry.tags,
      practicalActions: entry.practicalActions,
      commonMistakes: entry.commonMistakes,
      warnings: entry.warnings,
      confidenceLevel: entry.confidenceLevel,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    },
  };
}

export function buildKnowledgeRagCatalog(entries: KnowledgeEntry[]): KnowledgeRagDocument[] {
  return entries.map(buildKnowledgeRagDocument);
}
