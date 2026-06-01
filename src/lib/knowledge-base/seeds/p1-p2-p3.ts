import { seedEntry } from "@/lib/knowledge-base/seeds/_helpers";

export const p1P2P3Entry = seedEntry({
  id: "p1-p2-p3",
  title: "P1 / P2 / P3 Irrigation",
  sourceType: "protocol",
  category: "P1 / P2 / P3 irrigation",
  shortSummary:
    "Three-phase daily irrigation model: ramp-up (P1), maintenance (P2), and dryback (P3) before lights off.",
  detailedContent:
    "P1 is the first irrigation after lights on, establishing substrate moisture and starting transpiration. P2 maintains moisture through peak PPFD and peak VPD demand. P3 is the final shot or withholding window that sets overnight dryback. Timing and volume of each phase depend on container size, substrate, and whether the room is in vegetative or generative steering.",
  phaseRelevance: ["Vegetative", "Flower"],
  relatedMetrics: ["irrigation_count", "irrigation_volume_per_event", "dryback_percent"],
  practicalActions: [
    "Define P1 start time relative to lights-on and first VPD rise.",
    "Keep P2 interval consistent day-to-day unless dryback trend changes.",
    "Use P3 to hit dryback target before lights off; log resulting dryback percent.",
    "Never skip runoff checks on days when P2 volume increases.",
  ],
  warnings: [
    "P3 too early — dryback exceeds target and stresses canopy",
    "P3 too late — dryback below target and root zone stays saturated",
    "Uneven P2 timing across zones with different PPFD",
  ],
  recommendedRanges: [
    {
      phase: "Vegetative",
      label: "Typical daily irrigation events",
      min: 3,
      max: 6,
      unit: "events/day",
    },
    {
      phase: "Flower",
      label: "Typical daily irrigation events",
      min: 4,
      max: 8,
      unit: "events/day",
    },
  ],
  tags: ["irrigation", "protocol", "P1", "P2", "P3"],
  priority: "high",
  sourceMetadata: {
    documentTitle: "Botafarm Irrigation Protocol",
    section: "P1 P2 P3 scheduling",
    documentId: "protocol-p123",
  },
  botafarmNote: "Links to irrigation-strategy SOP and dryback rule entries.",
  createdAt: "2026-05-29T00:00:00.000Z",
  updatedAt: "2026-05-29T00:00:00.000Z",
});
