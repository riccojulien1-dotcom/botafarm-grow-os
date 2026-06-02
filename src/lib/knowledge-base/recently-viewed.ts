export const KNOWLEDGE_RECENTLY_VIEWED_KEY = "bf-knowledge-recently-viewed";

export const KNOWLEDGE_RECENTLY_VIEWED_MAX = 8;

export type RecentlyViewedKnowledgeItem = {
  entryId: string;
  title: string;
  viewedAt: string;
};
