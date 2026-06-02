"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  KNOWLEDGE_RECENTLY_VIEWED_KEY,
  type RecentlyViewedKnowledgeItem,
} from "@/lib/knowledge-base/recently-viewed";

export function KnowledgeRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedKnowledgeItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KNOWLEDGE_RECENTLY_VIEWED_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as RecentlyViewedKnowledgeItem[];
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  if (!items.length) {
    return (
      <p className="text-sm text-zinc-500">
        Concepts you open will appear here for quick return visits.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={`${item.entryId}-${item.viewedAt}`}>
          <Link
            href={`/dashboard/knowledge/${item.entryId}`}
            className="block rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-300 transition hover:border-cyan-500/30 hover:text-cyan-200"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
