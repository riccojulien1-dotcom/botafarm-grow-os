import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const generativeSteeringEntry = seedEntry({
  id: "generative-steering",
  title: "Generative Steering",
  sourceType: "book",
  category: "Generative steering",
  shortSummary:
    "Irrigation and environment program that favors flower set, bud swell, and ripening through controlled dryback and EC dynamics.",
  knowledgeSummary:
    "Generative steering increases dryback between events, manages EC in/out balance, and pairs higher flower VPD with appropriate PPFD. It is not a single-day adjustment — it is a multi-week rhythm especially through mid and late flower. Successful generative programs log dryback, runoff EC, and plant response daily so the operator can separate intentional stress from harmful drift.",
  phaseRelevance: ["Pre-Flower", "Flower"],
  relatedMetrics: ["dryback_percent", "ec_in", "ec_runoff", "vpd", "ppfd"],
  practicalActions: [
    "Increase dryback targets gradually after flip — do not jump to max dryback in week one.",
    "Monitor EC runoff delta daily; reduce feed EC if accumulation exceeds 0.3.",
    "Align P3 timing with dryback goal before lights off.",
    "Reduce generative pressure if turgor loss or tip burn accelerates.",
  ],
  warnings: [
    "Runoff EC climbing while dryback also climbing — double stress",
    "Wilting at end of day with dryback above 25%",
    "Flat bud development with excessive saturation (low dryback)",
  ],
  recommendedRanges: [
    {
      phase: "Flower",
      label: "Mid-flower dryback (generative)",
      min: 12,
      max: 20,
      unit: "%",
    },
  ],
  tags: ["crop-steering", "generative", "flower"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Cultivation Playbook",
    author: "Botafarm",
    chapter: "Generative steering",
    documentId: "book-playbook-gen-steer",
  },
  botafarmNote: "Pairs with ec-runoff and dryback entries for rule-based and future AI guidance.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
