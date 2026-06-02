import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const drybackEntry = seedEntry({
  id: "dryback",
  title: "Dryback",
  sourceType: "rule",
  category: "Dryback",
  shortSummary:
    "Percent moisture loss in substrate between irrigation events. Key lever for root oxygen, uptake rhythm, and crop steering.",
  knowledgeSummary:
    "Dryback expresses how much the substrate dries between feeds. Low dryback keeps roots wetter and favors vegetative momentum; higher controlled dryback increases oxygen and can support generative development when paired with stable EC and runoff strategy. Dryback must be interpreted with irrigation count, shot size, and room phase.",
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
    "Record dryback percent in every daily journal entry after the first feed.",
    "Compare dryback trend with EC runoff and plant turgor before changing shot size.",
    "Adjust irrigation count before chasing extreme dryback targets.",
  ],
  commonMistakes: [
    "Chasing dryback targets without logging EC In and EC Out on the same day",
    "Increasing shot size when runoff percent is already declining",
    "Ignoring phase — applying late-flower dryback targets during vegetative growth",
    "Treating a single low dryback reading as a substrate failure without trend context",
  ],
  warnings: [
    "Dryback below 8% with sluggish growth or weak roots",
    "Dryback above 30% with wilting or uneven uptake",
    "Oscillating dryback without stable irrigation timing",
  ],
  recommendedRanges: [
    {
      phase: "Vegetative",
      label: "Vegetative dryback",
      min: 8,
      max: 15,
      unit: "%",
    },
    {
      phase: "Flower",
      label: "Mid-flower dryback",
      min: 12,
      max: 20,
      unit: "%",
      notes: "Steering programs may push higher in late flower by design.",
    },
  ],
  tags: ["irrigation", "substrate", "crop-steering"],
  priority: "high",
  botafarmNote:
    "Grow OS rule engine uses dryback from the daily journal for watch and action alerts.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
