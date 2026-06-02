import type { KnowledgeEntry, KnowledgeTopic } from "@/lib/knowledge-base/types";

const ENTRY_BRAIN_METADATA: Record<
  string,
  { topic: KnowledgeTopic; subject: string }
> = {
  "irrigation-strategy": {
    topic: "Irrigation",
    subject: "Irrigation strategy",
  },
  dryback: {
    topic: "Irrigation",
    subject: "Dryback",
  },
  "ec-runoff": {
    topic: "Irrigation",
    subject: "EC runoff",
  },
  vpd: {
    topic: "Environment",
    subject: "Vapor pressure deficit",
  },
  ppfd: {
    topic: "Lighting",
    subject: "PPFD",
  },
  ph: {
    topic: "Nutrition",
    subject: "pH",
  },
  "p1-p2-p3": {
    topic: "Crop steering",
    subject: "P1 / P2 / P3 irrigation",
  },
  "generative-steering": {
    topic: "Crop steering",
    subject: "Generative steering",
  },
  "vegetative-steering": {
    topic: "Crop steering",
    subject: "Vegetative steering",
  },
};

export function enrichKnowledgeEntry(entry: KnowledgeEntry): KnowledgeEntry {
  const meta = ENTRY_BRAIN_METADATA[entry.id];
  if (!meta) {
    return {
      ...entry,
      topic: entry.topic ?? "General cultivation",
      subject: entry.subject ?? entry.category,
    };
  }

  return {
    ...entry,
    topic: meta.topic,
    subject: meta.subject,
  };
}
