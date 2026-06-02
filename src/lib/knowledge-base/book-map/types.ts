import type { GrowPhase, KnowledgeBrainCategory } from "@/lib/knowledge-base/types";

/** Pedagogical chapters vs lookup tables / bonus deep-dives */
export type BookMapChapterRole = "learning_path" | "reference";

export type BookMapSectionRole = "learning_path" | "reference";

export type BookMapNodeKind =
  | "concept"
  | "rule"
  | "action"
  | "warning"
  | "metric";

export type BookMapNode = {
  /** Global handbook reference — e.g. IRR-042 */
  irrId: string;
  kind: BookMapNodeKind;
  slug: string;
  label: string;
  /** Short pedagogical summary — never raw handbook text */
  summary: string;
  /** Prior IRR ids that should be understood first */
  dependsOn?: string[];
  relatedMetrics?: string[];
  phases?: GrowPhase[];
  /** Links to Sprint 26 handbook target concept slug when applicable */
  targetConceptSlug?: string;
  brainCategory?: KnowledgeBrainCategory;
};

export type BookMapSection = {
  id: string;
  order: number;
  titleFr: string;
  titleEn: string;
  role: BookMapSectionRole;
  pageStart?: number;
  pageEnd?: number;
  purpose: string;
  nodes: BookMapNode[];
};

export type BookMapChapter = {
  id: string;
  /** Sommaire order (1–13); bonus uses 0 */
  number: number;
  order: number;
  titleFr: string;
  titleEn: string;
  role: BookMapChapterRole;
  pageStart: number;
  pageEnd?: number;
  purpose: string;
  /** Chapter-level prerequisites in learning order */
  dependsOnChapterIds?: string[];
  sections: BookMapSection[];
};

export type BookMap = {
  sourceId: string;
  titleFr: string;
  titleEn: string;
  author: string;
  totalPages: number;
  documentLanguage: "fr";
  referencePrefix: "IRR";
  /** Derived from real PDF — not stored in repo */
  sourceDocumentHint: string;
  chapters: BookMapChapter[];
};

export type BookMapIndexRecord = {
  irrId: string;
  chapterId: string;
  chapterNumber: number;
  chapterRole: BookMapChapterRole;
  sectionId: string;
  sectionRole: BookMapSectionRole;
  node: BookMapNode;
};

export type BookMapStats = {
  chapterCount: number;
  learningPathChapterCount: number;
  referenceChapterCount: number;
  sectionCount: number;
  nodeCount: number;
  conceptCount: number;
  ruleCount: number;
  actionCount: number;
  warningCount: number;
  metricCount: number;
  irrIdRange: { first: string; last: string };
};

export type BookMapLearningPathStep = {
  irrId: string;
  chapterId: string;
  sectionId: string;
  label: string;
  summary: string;
  dependsOn: string[];
};

export type BookMapMetricContext = {
  metric: string;
  irrIds: string[];
  chapters: string[];
  phases: GrowPhase[];
};
