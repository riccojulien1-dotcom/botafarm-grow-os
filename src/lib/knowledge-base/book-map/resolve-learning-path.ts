import type { BookMap, BookMapLearningPathStep } from "./types";
import { buildBookMapIndex } from "./build-index";

/** Ordered learning-path nodes (skips reference-only chapters unless included) */
export function resolveLearningPath(
  bookMap: BookMap,
  options?: { includeReferenceChapters?: boolean },
): BookMapLearningPathStep[] {
  const includeReference = options?.includeReferenceChapters ?? false;
  const index = buildBookMapIndex(bookMap);
  const slugToIrr = new Map(index.map((record) => [record.node.slug, record.irrId]));

  const steps: BookMapLearningPathStep[] = [];

  for (const chapter of [...bookMap.chapters].sort((a, b) => a.order - b.order)) {
    if (chapter.role === "reference" && !includeReference) {
      continue;
    }

    for (const section of [...chapter.sections].sort((a, b) => a.order - b.order)) {
      if (section.role === "reference" && !includeReference) {
        continue;
      }

      for (const node of section.nodes) {
        steps.push({
          irrId: node.irrId,
          chapterId: chapter.id,
          sectionId: section.id,
          label: node.label,
          summary: node.summary,
          dependsOn: (node.dependsOn ?? []).map((dep) =>
            dep.startsWith("IRR-") ? dep : (slugToIrr.get(dep) ?? dep),
          ),
        });
      }
    }
  }

  return steps;
}

export function resolveLearningPathForChapter(
  bookMap: BookMap,
  chapterId: string,
): BookMapLearningPathStep[] {
  return resolveLearningPath(bookMap, { includeReferenceChapters: true }).filter(
    (step) => step.chapterId === chapterId,
  );
}

export function getChapterPrerequisites(bookMap: BookMap, chapterId: string): string[] {
  const chapter = bookMap.chapters.find((item) => item.id === chapterId);
  if (!chapter?.dependsOnChapterIds?.length) {
    return [];
  }

  const index = buildBookMapIndex(bookMap);
  return chapter.dependsOnChapterIds.flatMap((depId) => {
    const depChapter = bookMap.chapters.find((item) => item.id === depId);
    if (!depChapter) {
      return [];
    }
    const lastSection = [...depChapter.sections].sort((a, b) => b.order - a.order)[0];
    const lastNode = lastSection?.nodes[lastSection.nodes.length - 1];
    if (!lastNode) {
      return [];
    }
    return [lastNode.irrId];
  });
}
