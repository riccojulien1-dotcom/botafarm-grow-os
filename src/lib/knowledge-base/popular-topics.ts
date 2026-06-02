/** User-facing popular concepts — stable links for Knowledge Center */
export const POPULAR_KNOWLEDGE_TOPICS = [
  { entryId: "dryback", label: "Dryback" },
  { entryId: "vpd", label: "VPD" },
  { entryId: "p1-p2-p3", label: "P1/P2/P3 Irrigation" },
  { entryId: "ec-runoff", label: "EC Runoff" },
  { entryId: "vegetative-steering", label: "Vegetative Steering" },
  { entryId: "generative-steering", label: "Generative Steering" },
  { entryId: "ppfd", label: "PPFD" },
] as const;

export function getPopularTopicHref(entryId: string) {
  return `/dashboard/knowledge/${entryId}`;
}
