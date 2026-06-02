import { KNOWLEDGE_BRAIN_CATEGORIES } from "@/lib/knowledge-base/types";

/** Primary Brain categories for ingestion and library filters */
export const KNOWLEDGE_CATEGORIES = KNOWLEDGE_BRAIN_CATEGORIES;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];
