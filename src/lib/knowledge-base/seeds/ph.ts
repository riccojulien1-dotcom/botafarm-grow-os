import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const phEntry = seedEntry({
  id: "ph",
  title: "pH (Feed and Runoff)",
  sourceType: "rule",
  category: "pH",
  shortSummary:
    "Feed and runoff pH control nutrient availability and root-zone stability. Drift between input and runoff signals imbalance.",
  knowledgeSummary:
    "Hydroponic and coco programs typically target input pH between 5.5 and 6.5. Runoff pH should be tracked alongside input pH; a delta greater than 0.5 may indicate root-zone drift, weak buffering, or uneven irrigation passage.",
  phaseRelevance: ["Vegetative", "Flower"],
  relatedMetrics: ["ph_in", "ph_runoff"],
  practicalActions: [
    "Log ph_in and ph_runoff on the same irrigation days.",
    "Calibrate the pH meter before adjusting feed after a drift alert.",
    "Change pH in small steps (0.1–0.2) rather than large corrections.",
  ],
  warnings: [
    "Input pH below 5.5 or above 6.5",
    "Runoff pH differs from input by more than 0.5",
    "Correcting pH without confirming meter calibration",
  ],
  recommendedRanges: [
    {
      label: "Input pH target",
      min: 5.5,
      max: 6.5,
      unit: "pH",
    },
  ],
  tags: ["nutrition", "pH"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Nutrition Rules",
    section: "pH management",
  },
  botafarmNote: "Linked from Grow OS pH recommendations when journal pH fields are logged.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
