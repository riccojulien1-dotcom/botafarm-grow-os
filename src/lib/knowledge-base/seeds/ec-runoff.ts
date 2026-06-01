import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const ecRunoffEntry = seedEntry({
  id: "ec-runoff",
  title: "EC Runoff",
  sourceType: "rule",
  category: "Runoff",
  shortSummary:
    "Electrical conductivity of runoff water. Reveals salt accumulation, uptake balance, and feed alignment with root-zone demand.",
  detailedContent:
    "Comparing EC in (feed) to EC runoff shows whether the substrate is accumulating salts or depleting nutrients faster than replenishment. Runoff EC should be tracked every irrigation cycle in precision cultivation, especially during generative steering and late-flower ripening.",
  phaseRelevance: ["Vegetative", "Flower"],
  relatedMetrics: ["ec_in", "ec_runoff", "runoff_percent"],
  practicalActions: [
    "Log ec_in and ec_runoff together on each irrigation day.",
    "Calculate delta (runoff EC minus input EC) before changing feed strength.",
    "Increase runoff percent if accumulation trend persists across consecutive feeds.",
  ],
  warnings: [
    "Runoff EC more than 0.3 above input EC — salt accumulation starting",
    "Runoff EC more than 0.6 above input EC — excessive accumulation",
    "Runoff EC more than 0.3 below input EC — rapid nutrient drawdown",
    "Declining runoff percent with rising EC — poor passage or channeling",
  ],
  recommendedRanges: [
    {
      label: "Runoff vs input delta (watch)",
      min: -0.3,
      max: 0.3,
      unit: "EC delta",
      notes: "Runoff EC minus input EC; within band suggests balance.",
    },
  ],
  tags: ["nutrition", "runoff"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Nutrition Rules",
    section: "Runoff EC",
  },
  botafarmNote:
    "Sprint 10 recommendations map directly to this entry by stable id `ec-runoff`.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
