import type { BookMap, BookMapIndexRecord, BookMapStats } from "./types";
import { collectAllNodes } from "./validate-book-map";

export function buildBookMapIndex(bookMap: BookMap): BookMapIndexRecord[] {
  const records: BookMapIndexRecord[] = [];

  for (const chapter of bookMap.chapters) {
    for (const section of chapter.sections) {
      for (const node of section.nodes) {
        records.push({
          irrId: node.irrId,
          chapterId: chapter.id,
          chapterNumber: chapter.number,
          chapterRole: chapter.role,
          sectionId: section.id,
          sectionRole: section.role,
          node,
        });
      }
    }
  }

  return records;
}

export function getBookMapStats(bookMap: BookMap): BookMapStats {
  const nodes = collectAllNodes(bookMap);
  const irrIds = nodes.map((node) => node.irrId).sort();

  return {
    chapterCount: bookMap.chapters.length,
    learningPathChapterCount: bookMap.chapters.filter((chapter) => chapter.role === "learning_path")
      .length,
    referenceChapterCount: bookMap.chapters.filter((chapter) => chapter.role === "reference").length,
    sectionCount: bookMap.chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0),
    nodeCount: nodes.length,
    conceptCount: nodes.filter((node) => node.kind === "concept").length,
    ruleCount: nodes.filter((node) => node.kind === "rule").length,
    actionCount: nodes.filter((node) => node.kind === "action").length,
    warningCount: nodes.filter((node) => node.kind === "warning").length,
    metricCount: nodes.filter((node) => node.kind === "metric").length,
    irrIdRange: {
      first: irrIds[0] ?? "IRR-000",
      last: irrIds[irrIds.length - 1] ?? "IRR-000",
    },
  };
}

export function getBookMapNodeByIrrId(
  bookMap: BookMap,
  irrId: string,
): BookMapIndexRecord | undefined {
  return buildBookMapIndex(bookMap).find((record) => record.irrId === irrId);
}

export function getBookMapNodesByConceptSlug(bookMap: BookMap, slug: string) {
  return buildBookMapIndex(bookMap).filter((record) => record.node.targetConceptSlug === slug);
}
