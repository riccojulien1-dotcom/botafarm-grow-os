import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const vpdEntry = seedEntry({
  id: "vpd",
  title: "VPD (Vapor Pressure Deficit)",
  sourceType: "rule",
  category: "VPD",
  shortSummary:
    "Driver of transpiration and calcium mobility. Target bands differ between vegetative and flower phases.",
  detailedContent:
    "VPD combines temperature and humidity into a single transpiration demand signal. Too low reduces uptake and can favor pathogens; too high stresses stomata and can slow growth. VPD should be staged with crop phase rather than held constant across the entire cycle.",
  phaseRelevance: ["Vegetative", "Pre-Flower", "Flower"],
  relatedMetrics: ["vpd", "temperature", "humidity"],
  practicalActions: [
    "Log VPD with temperature and humidity in the daily journal.",
    "Adjust dehumidification or HVAC setpoints in small steps (0.05–0.1 kPa).",
    "Stage VPD targets when flipping from veg to flower.",
  ],
  warnings: [
    "Calcium spotting when VPD is too low in flower",
    "Leaf curl or edge burn when VPD exceeds band by more than 0.3 kPa",
    "Slow drying between irrigations with unstable VPD swings",
  ],
  recommendedRanges: [
    {
      phase: "Vegetative",
      label: "Vegetative VPD",
      min: 0.8,
      max: 1.2,
      unit: "kPa",
    },
    {
      phase: "Flower",
      label: "Flower VPD",
      min: 1.1,
      max: 1.5,
      unit: "kPa",
    },
  ],
  tags: ["environment", "climate"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Environment Rules",
    section: "VPD bands",
  },
  botafarmNote: "Future RAG retrieval will cite this entry by id `vpd` for climate recommendations.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
