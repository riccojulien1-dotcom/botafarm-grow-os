import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const vegetativeSteeringEntry = seedEntry({
  id: "vegetative-steering",
  title: "Vegetative Steering",
  sourceType: "book",
  category: "Vegetative steering",
  shortSummary:
    "Substrate and climate program that favors structural growth, root development, and moderate dryback.",
  detailedContent:
    "Vegetative steering uses lower dryback targets, balanced EC runoff, moderate VPD, and consistent P1/P2 moisture to keep the plant in a vegetative hormonal balance. The goal is node development and canopy fill without premature generative signaling. Steering fails when dryback is too aggressive, EC accumulates, or VPD is too high for the current PPFD.",
  phaseRelevance: ["Clone", "Mother", "Vegetative", "Pre-Flower"],
  relatedMetrics: ["dryback_percent", "ec_in", "ec_runoff", "vpd", "ppfd"],
  practicalActions: [
    "Hold dryback in the 8–15% band during active vegetative growth.",
    "Keep EC runoff delta near zero before increasing generative pressure.",
    "Maintain PPFD within vegetative protocol band while building canopy.",
    "Delay flip until structure and irrigation rhythm are stable.",
  ],
  warnings: [
    "Early flower stretch signals while still labeled vegetative",
    "Chronic saturation (dryback under 8%) with soft stems",
    "Salt accumulation while chasing faster veg growth",
  ],
  recommendedRanges: [
    {
      phase: "Vegetative",
      label: "Vegetative dryback steering",
      min: 8,
      max: 15,
      unit: "%",
    },
  ],
  tags: ["crop-steering", "vegetative", "substrate"],
  priority: "medium",
  sourceMetadata: {
    documentTitle: "Botafarm Cultivation Playbook",
    author: "Botafarm",
    chapter: "Vegetative steering",
    documentId: "book-playbook-veg-steer",
  },
  botafarmNote: "Contrast with generative-steering entry when transitioning to flower.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
