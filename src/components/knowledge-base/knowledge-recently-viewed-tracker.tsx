"use client";

import { useEffect } from "react";

import {
  KNOWLEDGE_RECENTLY_VIEWED_KEY,
  KNOWLEDGE_RECENTLY_VIEWED_MAX,
  type RecentlyViewedKnowledgeItem,
} from "@/lib/knowledge-base/recently-viewed";

type KnowledgeRecentlyViewedTrackerProps = {
  entryId: string;
  title: string;
};

export function KnowledgeRecentlyViewedTracker({
  entryId,
  title,
}: KnowledgeRecentlyViewedTrackerProps) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KNOWLEDGE_RECENTLY_VIEWED_KEY);
      const existing: RecentlyViewedKnowledgeItem[] = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(existing) ? existing : [];

      const next: RecentlyViewedKnowledgeItem[] = [
        { entryId, title, viewedAt: new Date().toISOString() },
        ...list.filter((item) => item.entryId !== entryId),
      ].slice(0, KNOWLEDGE_RECENTLY_VIEWED_MAX);

      localStorage.setItem(KNOWLEDGE_RECENTLY_VIEWED_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage errors */
    }
  }, [entryId, title]);

  return null;
}
