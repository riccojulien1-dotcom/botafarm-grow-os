/** Internal Botafarm knowledge categories — extend as the library grows */
export const KNOWLEDGE_CATEGORIES = [
  "PPFD",
  "DLI",
  "EC",
  "pH",
  "VPD",
  "Dryback",
  "Runoff",
  "Irrigation strategy",
  "P1 / P2 / P3 irrigation",
  "Vegetative steering",
  "Generative steering",
  "Crop steering",
  "Flowering phases",
  "Stretch",
  "Harvest window",
  "Variety behavior",
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];
