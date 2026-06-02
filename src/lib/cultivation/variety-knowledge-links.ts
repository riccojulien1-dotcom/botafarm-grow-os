import { getKnowledgeEntryById } from "@/lib/knowledge-base/catalog";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

export type VarietyKnowledgeLink = {
  entryId: string;
  label: string;
  shortSummary: string;
};

const KNOWLEDGE_LINK_CANDIDATES: Array<{
  entryId: string;
  label: string;
  when: (variety: RoomVarietyRecord) => boolean;
}> = [
  { entryId: "dryback", label: "Dryback", when: () => true },
  {
    entryId: "ec-runoff",
    label: "EC Runoff",
    when: (variety) => variety.ec_sensitivity !== "low",
  },
  {
    entryId: "generative-steering",
    label: "Generative Steering",
    when: (variety) => variety.stretch === "high" || variety.stretch === "medium",
  },
  {
    entryId: "vegetative-steering",
    label: "Vegetative Steering",
    when: (variety) => variety.variety_type === "Sativa",
  },
  {
    entryId: "vpd",
    label: "VPD",
    when: (variety) => variety.stretch !== "low",
  },
  {
    entryId: "p1-p2-p3",
    label: "P1/P2/P3 Irrigation",
    when: (variety) => variety.irrigation_sensitivity !== "low",
  },
  {
    entryId: "ph",
    label: "pH",
    when: (variety) => variety.ec_sensitivity === "high",
  },
];

export function getVarietyKnowledgeLinks(variety: RoomVarietyRecord): VarietyKnowledgeLink[] {
  const seen = new Set<string>();
  const links: VarietyKnowledgeLink[] = [];

  for (const candidate of KNOWLEDGE_LINK_CANDIDATES) {
    if (!candidate.when(variety) || seen.has(candidate.entryId)) {
      continue;
    }
    const entry = getKnowledgeEntryById(candidate.entryId);
    if (!entry) {
      continue;
    }
    seen.add(candidate.entryId);
    links.push({
      entryId: entry.id,
      label: candidate.label,
      shortSummary: entry.shortSummary,
    });
  }

  return links;
}
