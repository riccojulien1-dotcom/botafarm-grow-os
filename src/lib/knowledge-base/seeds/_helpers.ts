import { SEED_TIMESTAMP } from "@/lib/knowledge-base/constants";
import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

export function seedEntry(
  entry: Omit<KnowledgeEntry, "createdAt" | "updatedAt"> &
    Partial<Pick<KnowledgeEntry, "createdAt" | "updatedAt">>,
): KnowledgeEntry {
  return {
    ...entry,
    createdAt: entry.createdAt ?? SEED_TIMESTAMP,
    updatedAt: entry.updatedAt ?? SEED_TIMESTAMP,
  };
}
