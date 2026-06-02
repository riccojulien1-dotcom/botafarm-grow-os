import { drybackEntry } from "@/lib/knowledge-base/seeds/dryback";
import { ecRunoffEntry } from "@/lib/knowledge-base/seeds/ec-runoff";
import { generativeSteeringEntry } from "@/lib/knowledge-base/seeds/generative-steering";
import { irrigationStrategyEntry } from "@/lib/knowledge-base/seeds/irrigation-strategy";
import { p1P2P3Entry } from "@/lib/knowledge-base/seeds/p1-p2-p3";
import { phEntry } from "@/lib/knowledge-base/seeds/ph";
import { ppfdEntry } from "@/lib/knowledge-base/seeds/ppfd";
import { vegetativeSteeringEntry } from "@/lib/knowledge-base/seeds/vegetative-steering";
import { vpdEntry } from "@/lib/knowledge-base/seeds/vpd";
import { enrichKnowledgeEntry } from "@/lib/knowledge-base/seeds/enrich";
import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

const RAW_ENTRIES: KnowledgeEntry[] = [
  irrigationStrategyEntry,
  drybackEntry,
  ecRunoffEntry,
  vpdEntry,
  ppfdEntry,
  phEntry,
  p1P2P3Entry,
  generativeSteeringEntry,
  vegetativeSteeringEntry,
];

/** Canonical in-memory catalog — replaceable by DB/API import without UI changes */
export const KNOWLEDGE_BASE_ENTRIES: KnowledgeEntry[] = RAW_ENTRIES.map(enrichKnowledgeEntry);
