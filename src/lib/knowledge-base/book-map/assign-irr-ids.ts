import { IRRIGATION_REFERENCE_PREFIX } from "@/lib/knowledge-base/domains/irrigation-manifest";

import type { BookMap, BookMapChapter, BookMapNode, BookMapSection } from "./types";

function formatIrrId(sequence: number): string {
  return `${IRRIGATION_REFERENCE_PREFIX}-${String(sequence).padStart(3, "0")}`;
}

function assignSectionNodes(
  sections: BookMapSection[],
  nextSequence: { value: number },
): BookMapSection[] {
  return sections.map((section) => ({
    ...section,
    nodes: section.nodes.map((node) => {
      const irrId = formatIrrId(nextSequence.value);
      nextSequence.value += 1;
      return { ...node, irrId };
    }),
  }));
}

/** Assign global sequential IRR ids in chapter → section → node order */
export function assignGlobalIrrIds(bookMap: Omit<BookMap, "chapters"> & { chapters: BookMapChapter[] }): BookMap {
  const nextSequence = { value: 1 };
  const chapters = [...bookMap.chapters]
    .sort((a, b) => a.order - b.order)
    .map((chapter) => ({
      ...chapter,
      sections: assignSectionNodes(chapter.sections, nextSequence),
    }));

  return { ...bookMap, chapters };
}

export function rewireDependsOnToIrrIds(bookMap: BookMap): BookMap {
  const slugToIrr = new Map<string, string>();
  for (const chapter of bookMap.chapters) {
    for (const section of chapter.sections) {
      for (const node of section.nodes) {
        slugToIrr.set(node.slug, node.irrId);
      }
    }
  }

  const chapters = bookMap.chapters.map((chapter) => ({
    ...chapter,
    sections: chapter.sections.map((section) => ({
      ...section,
      nodes: section.nodes.map((node) => ({
        ...node,
        dependsOn: node.dependsOn
          ?.map((dep) => (dep.startsWith("IRR-") ? dep : slugToIrr.get(dep)))
          .filter((dep): dep is string => Boolean(dep)),
      })),
    })),
  }));

  return { ...bookMap, chapters };
}

export type BookMapNodeDraft = Omit<BookMapNode, "irrId"> & { irrId?: string };

export function draftNode(node: BookMapNodeDraft): BookMapNodeDraft {
  return node;
}
