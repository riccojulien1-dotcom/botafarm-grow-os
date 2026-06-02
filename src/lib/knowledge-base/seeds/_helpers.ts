import { SEED_TIMESTAMP } from "@/lib/knowledge-base/constants";
import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

export function seedEntry(
  entry: Omit<KnowledgeEntry, "createdAt" | "updatedAt" | "topic" | "subject"> &
    Partial<Pick<KnowledgeEntry, "createdAt" | "updatedAt" | "topic" | "subject">>,
): KnowledgeEntry {
  return {
    topic: entry.topic ?? "General cultivation",
    subject: entry.subject ?? entry.category,
    ...entry,
    createdAt: entry.createdAt ?? SEED_TIMESTAMP,
    updatedAt: entry.updatedAt ?? SEED_TIMESTAMP,
  };
}
