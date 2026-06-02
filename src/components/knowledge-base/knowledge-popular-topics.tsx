import Link from "next/link";

import { getKnowledgeEntryById } from "@/lib/knowledge-base";
import {
  POPULAR_KNOWLEDGE_TOPICS,
  getPopularTopicHref,
} from "@/lib/knowledge-base/popular-topics";

export function KnowledgePopularTopics() {
  const topics = POPULAR_KNOWLEDGE_TOPICS.map((topic) => ({
    ...topic,
    entry: getKnowledgeEntryById(topic.entryId),
  })).filter((topic) => topic.entry != null);

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <Link
          key={topic.entryId}
          href={getPopularTopicHref(topic.entryId)}
          className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-950/25 px-4 py-2 text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-400/50 hover:bg-fuchsia-900/30"
        >
          {topic.label}
        </Link>
      ))}
    </div>
  );
}
