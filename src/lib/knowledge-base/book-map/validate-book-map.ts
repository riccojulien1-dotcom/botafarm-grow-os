import type { BookMap, BookMapNode } from "./types";

export type BookMapValidationIssue = {
  code: string;
  message: string;
  path?: string;
};

export function validateBookMap(bookMap: BookMap): BookMapValidationIssue[] {
  const issues: BookMapValidationIssue[] = [];
  const irrIds = new Set<string>();
  const slugs = new Set<string>();
  const chapterIds = new Set(bookMap.chapters.map((chapter) => chapter.id));

  let expectedSequence = 1;

  for (const chapter of bookMap.chapters) {
    for (const dep of chapter.dependsOnChapterIds ?? []) {
      if (!chapterIds.has(dep)) {
        issues.push({
          code: "missing_chapter_dependency",
          message: `Chapter ${chapter.id} depends on unknown chapter ${dep}`,
          path: chapter.id,
        });
      }
    }

    for (const section of chapter.sections) {
      for (const node of section.nodes) {
        if (irrIds.has(node.irrId)) {
          issues.push({
            code: "duplicate_irr_id",
            message: `Duplicate IRR id ${node.irrId}`,
            path: `${chapter.id}/${section.id}/${node.slug}`,
          });
        }
        irrIds.add(node.irrId);

        const match = node.irrId.match(/^IRR-(\d{3})$/);
        if (!match) {
          issues.push({
            code: "invalid_irr_format",
            message: `Invalid IRR id format: ${node.irrId}`,
            path: node.slug,
          });
        } else if (Number(match[1]) !== expectedSequence) {
          issues.push({
            code: "irr_sequence_gap",
            message: `Expected IRR-${String(expectedSequence).padStart(3, "0")}, got ${node.irrId}`,
            path: node.slug,
          });
        }
        expectedSequence += 1;

        if (slugs.has(node.slug)) {
          issues.push({
            code: "duplicate_node_slug",
            message: `Duplicate node slug ${node.slug}`,
          });
        }
        slugs.add(node.slug);

        for (const dep of node.dependsOn ?? []) {
          if (!dep.startsWith("IRR-") && !slugs.has(dep)) {
            issues.push({
              code: "unresolved_dependency",
              message: `Node ${node.irrId} depends on unresolved ${dep}`,
              path: node.slug,
            });
          }
        }
      }
    }
  }

  return issues;
}

export function assertValidBookMap(bookMap: BookMap): void {
  const issues = validateBookMap(bookMap);
  if (issues.length > 0) {
    throw new Error(
      `Invalid irrigation handbook book map: ${issues.map((issue) => issue.message).join("; ")}`,
    );
  }
}

export function collectAllNodes(bookMap: BookMap): BookMapNode[] {
  return bookMap.chapters.flatMap((chapter) =>
    chapter.sections.flatMap((section) => section.nodes),
  );
}
