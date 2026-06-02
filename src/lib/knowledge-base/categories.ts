/** Internal Botafarm knowledge categories — extend as the library grows */
export const KNOWLEDGE_CATEGORIES = [
  "PPFD",
  "DLI",
  "EC",
  "pH",
  "VPD",
  "Environment",
  "Dryback",
  "Runoff",
  "Irrigation strategy",
  "P1 / P2 / P3 irrigation",
  "Vegetative steering",
  "Generative steering",
  "Crop steering",
  "Nutrition",
  "Flowering phases",
  "Stretch",
  "Harvest window",
  "Harvest",
  "Curing",
  "Breeding",
  "Tissue culture",
  "Variety behavior",
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];
