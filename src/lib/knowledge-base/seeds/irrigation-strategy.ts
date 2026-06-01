import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const irrigationStrategyEntry = seedEntry({
  id: "irrigation-strategy",
  title: "Irrigation Strategy",
  sourceType: "SOP",
  category: "Irrigation strategy",
  shortSummary:
    "Framework for shot timing, volume, runoff targets, and phase-appropriate substrate moisture management.",
  detailedContent:
    "A Botafarm irrigation strategy defines how many events occur per day, what percent of container volume each shot represents, and what runoff percent confirms passage without chronic saturation. Strategy must align with crop phase: vegetative programs prioritize consistent moisture and moderate dryback; flower programs layer generative dryback and EC steering on top of stable timing.",
  phaseRelevance: ["Vegetative", "Pre-Flower", "Flower"],
  relatedMetrics: [
    "dryback_percent",
    "ec_in",
    "ec_runoff",
    "runoff_percent",
    "irrigation_count",
    "irrigation_volume_per_event",
  ],
  practicalActions: [
    "Document P1 / P2 / P3 shot schedule per room and phase.",
    "Set target runoff percent range before changing EC or dryback goals.",
    "Review irrigation count and volume when dryback drifts outside band for 3+ days.",
    "Pair strategy changes with PPFD and VPD adjustments to avoid compounding stress.",
  ],
  warnings: [
    "Increasing shot volume without measuring runoff percent",
    "Changing EC and irrigation count on the same day without baseline logs",
    "Chronic low dryback with rising EC accumulation",
  ],
  recommendedRanges: [
    {
      label: "Target runoff percent",
      min: 10,
      max: 25,
      unit: "%",
      notes: "Adjust per substrate and cultivar; confirm with EC runoff trend.",
    },
  ],
  tags: ["irrigation", "SOP", "substrate"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Irrigation SOP",
    section: "Room irrigation strategy",
    documentId: "sop-irrigation-001",
  },
  botafarmNote:
    "Parent entry for P1/P2/P3 protocols and crop steering rules in the knowledge library.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
