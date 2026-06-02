export {
  IRRIGATION_HANDBOOK_BOOK_MAP,
} from "@/lib/knowledge-base/book-map/irrigation-handbook-map";
export {
  assignGlobalIrrIds,
  draftNode,
  rewireDependsOnToIrrIds,
} from "@/lib/knowledge-base/book-map/assign-irr-ids";
export {
  buildBookMapIndex,
  getBookMapNodeByIrrId,
  getBookMapNodesByConceptSlug,
  getBookMapStats,
} from "@/lib/knowledge-base/book-map/build-index";
export {
  resolveLearningPath,
  resolveLearningPathForChapter,
  getChapterPrerequisites,
} from "@/lib/knowledge-base/book-map/resolve-learning-path";
export {
  resolveMetricContext,
  resolveAllMetricContexts,
} from "@/lib/knowledge-base/book-map/resolve-metric-context";
export {
  assertValidBookMap,
  collectAllNodes,
  validateBookMap,
} from "@/lib/knowledge-base/book-map/validate-book-map";
export type {
  BookMap,
  BookMapChapter,
  BookMapChapterRole,
  BookMapIndexRecord,
  BookMapLearningPathStep,
  BookMapMetricContext,
  BookMapNode,
  BookMapNodeKind,
  BookMapSection,
  BookMapSectionRole,
  BookMapStats,
} from "@/lib/knowledge-base/book-map/types";

import { IRRIGATION_HANDBOOK_BOOK_MAP } from "@/lib/knowledge-base/book-map/irrigation-handbook-map";
import { getBookMapStats } from "@/lib/knowledge-base/book-map/build-index";

export function getIrrigationHandbookBookMap() {
  return IRRIGATION_HANDBOOK_BOOK_MAP;
}

export function getIrrigationHandbookBookMapStats() {
  return getBookMapStats(IRRIGATION_HANDBOOK_BOOK_MAP);
}
