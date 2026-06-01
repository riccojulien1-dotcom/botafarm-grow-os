import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const ppfdEntry = seedEntry({
  id: "ppfd",
  title: "PPFD (Photosynthetic Photon Flux Density)",
  sourceType: "protocol",
  category: "PPFD",
  shortSummary:
    "Instantaneous light intensity at canopy level (µmol/m²/s). Drives photosynthesis when paired with photoperiod.",
  detailedContent:
    "PPFD describes how many photosynthetically active photons reach the canopy each second. It is the primary lighting metric for tuning intensity without guessing from wattage alone. PPFD should be measured at canopy height and tracked through phase changes because plant tolerance and demand shift from vegetative to generative growth.",
  phaseRelevance: ["Vegetative", "Pre-Flower", "Flower"],
  relatedMetrics: ["ppfd", "dli"],
  practicalActions: [
    "Measure PPFD at uniform canopy height after any dimmer or rack change.",
    "Log PPFD in the daily journal when adjusting light intensity or photoperiod.",
    "Acclimate plants in steps when increasing PPFD more than 10–15%.",
  ],
  warnings: [
    "Bleaching or tacoing on upper leaves",
    "Stunted new growth under high PPFD without acclimation",
    "Loose internodes and pale growth under low PPFD in flower",
  ],
  recommendedRanges: [
    {
      phase: "Vegetative",
      label: "Vegetative target",
      min: 300,
      max: 700,
      unit: "µmol/m²/s",
    },
    {
      phase: "Flower",
      label: "Flower target",
      min: 700,
      max: 1100,
      unit: "µmol/m²/s",
    },
  ],
  tags: ["lighting", "environment"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Lighting Protocol",
    section: "Canopy intensity",
  },
  botafarmNote:
    "Botafarm rooms should log PPFD daily when changing dimmer height, spectrum, or plant density.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
