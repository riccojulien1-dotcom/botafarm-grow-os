import type { KnowledgeEntry, KnowledgeTopic } from "@/lib/knowledge-base/types";
import { sourceRef } from "@/lib/knowledge-base/seeds/_helpers";

type BrainMeta = {
  topic: KnowledgeTopic;
  subject: string;
  category: string;
  subcategory: string;
  sourceReference: ReturnType<typeof sourceRef>;
};

const ENTRY_BRAIN_METADATA: Record<string, BrainMeta> = {
  "irrigation-strategy": {
    topic: "Irrigation",
    subject: "Irrigation strategy",
    category: "Irrigation",
    subcategory: "Irrigation strategy",
    sourceReference: sourceRef("protocol", "Botafarm Irrigation Handbook", "IRR-001", "Strategy overview"),
  },
  dryback: {
    topic: "Irrigation",
    subject: "Dryback",
    category: "Irrigation",
    subcategory: "Dryback",
    sourceReference: sourceRef("book", "Botafarm Irrigation Handbook", "IRR-017", "Dryback targets"),
  },
  "ec-runoff": {
    topic: "Irrigation",
    subject: "EC runoff",
    category: "Irrigation",
    subcategory: "Runoff",
    sourceReference: sourceRef("book", "Botafarm Irrigation Handbook", "IRR-009", "Runoff EC"),
  },
  vpd: {
    topic: "Environment",
    subject: "Vapor pressure deficit",
    category: "Environment",
    subcategory: "VPD",
    sourceReference: sourceRef("rule", "Botafarm Environment Rules", "ENV-003", "VPD bands"),
  },
  ppfd: {
    topic: "Lighting",
    subject: "PPFD",
    category: "Environment",
    subcategory: "PPFD",
    sourceReference: sourceRef("guide", "Botafarm Lighting Guide", "ENV-011", "PPFD targets"),
  },
  ph: {
    topic: "Nutrition",
    subject: "pH",
    category: "Nutrition",
    subcategory: "pH",
    sourceReference: sourceRef("book", "Botafarm Irrigation Handbook", "IRR-004", "Feed and runoff pH"),
  },
  "p1-p2-p3": {
    topic: "Crop steering",
    subject: "P1 / P2 / P3 irrigation",
    category: "Crop Steering",
    subcategory: "P1 / P2 / P3",
    sourceReference: sourceRef("protocol", "Botafarm Crop Steering Protocol", "CS-004", "Phase irrigation"),
  },
  "generative-steering": {
    topic: "Crop steering",
    subject: "Generative steering",
    category: "Crop Steering",
    subcategory: "Generative steering",
    sourceReference: sourceRef("protocol", "Botafarm Crop Steering Protocol", "CS-012", "Generative steering"),
  },
  "vegetative-steering": {
    topic: "Crop steering",
    subject: "Vegetative steering",
    category: "Crop Steering",
    subcategory: "Vegetative steering",
    sourceReference: sourceRef("protocol", "Botafarm Crop Steering Protocol", "CS-002", "Vegetative steering"),
  },
};

export function enrichKnowledgeEntry(entry: KnowledgeEntry): KnowledgeEntry {
  const meta = ENTRY_BRAIN_METADATA[entry.id];
  if (!meta) {
    return {
      ...entry,
      topic: entry.topic ?? "General cultivation",
      subject: entry.subject ?? entry.category,
      subcategory: entry.subcategory ?? entry.category,
    };
  }

  return {
    ...entry,
    topic: meta.topic,
    subject: meta.subject,
    category: meta.category,
    subcategory: meta.subcategory,
    sourceReference: meta.sourceReference,
  };
}
