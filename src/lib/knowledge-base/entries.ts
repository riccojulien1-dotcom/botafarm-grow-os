import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

const SEED_TIMESTAMP = "2026-05-29T00:00:00.000Z";

export const KNOWLEDGE_BASE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "ppfd",
    title: "PPFD (Photosynthetic Photon Flux Density)",
    category: "PPFD",
    shortExplanation:
      "Instantaneous light intensity at canopy level, measured in µmol/m²/s. Drives photosynthesis rate when paired with photoperiod.",
    detailedExplanation:
      "PPFD describes how many photosynthetically active photons reach the canopy each second. It is the primary lighting metric for tuning intensity without guessing from wattage alone. PPFD should be measured at canopy height and tracked through phase changes because plant tolerance and demand shift from vegetative to generative growth.",
    phaseRelevance: ["Vegetative", "Pre-Flower", "Flower"],
    relatedMetrics: ["ppfd", "dli"],
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
    warningSigns: [
      "Bleaching or tacoing on upper leaves",
      "Stunted new growth under high PPFD without acclimation",
      "Loose internodes and pale growth under low PPFD in flower",
    ],
    botafarmNote:
      "Botafarm rooms should log PPFD daily when changing dimmer height, spectrum, or plant density so recommendations and charts stay aligned with real canopy conditions.",
    sourceType: "static",
    tags: ["lighting", "environment"],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  },
  {
    id: "dli",
    title: "DLI (Daily Light Integral)",
    category: "DLI",
    shortExplanation:
      "Total photosynthetically active light delivered per day (mol/m²/day), combining PPFD and photoperiod.",
    detailedExplanation:
      "DLI integrates intensity over time. Two rooms can share the same PPFD but differ in DLI if photoperiod differs. DLI is useful for comparing vegetative vigor targets versus dense flower production targets, and for diagnosing stretch or slow ripening tied to cumulative light energy.",
    phaseRelevance: ["Vegetative", "Flower"],
    relatedMetrics: ["dli", "ppfd"],
    recommendedRanges: [
      {
        phase: "Vegetative",
        label: "Vegetative DLI",
        min: 22,
        max: 35,
        unit: "mol/m²/day",
        notes: "Adjust with cultivar vigor and CO₂ supplementation.",
      },
      {
        phase: "Flower",
        label: "Flower DLI",
        min: 35,
        max: 45,
        unit: "mol/m²/day",
        notes: "Upper range only when environment and irrigation are stable.",
      },
    ],
    warningSigns: [
      "Stretch late in flower with low DLI",
      "Tip burn or calcium issues when DLI rises without irrigation balance",
      "Inconsistent bud density between racks with different photoperiods",
    ],
    botafarmNote:
      "When PPFD is logged in the journal, Botafarm Grow OS can later derive DLI automatically from photoperiod to cross-check canopy energy targets.",
    sourceType: "static",
    tags: ["lighting", "environment"],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  },
  {
    id: "dryback",
    title: "Dryback",
    category: "Dryback",
    shortExplanation:
      "Percent moisture loss in the substrate between irrigation events. Key lever for root oxygen, uptake rhythm, and generative steering.",
    detailedExplanation:
      "Dryback expresses how much the substrate dries between feeds. Low dryback keeps roots wetter and favors vegetative momentum; higher controlled dryback increases oxygen and can support generative development when paired with stable EC and runoff strategy. Dryback must be interpreted with irrigation count, shot size, and room phase.",
    phaseRelevance: ["Vegetative", "Pre-Flower", "Flower"],
    relatedMetrics: ["dryback_percent", "irrigation_count", "irrigation_volume_per_event"],
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
    warningSigns: [
      "Dryback below 8% with sluggish growth or weak roots",
      "Dryback above 30% with wilting or uneven uptake",
      "Oscillating dryback without stable irrigation timing",
    ],
    botafarmNote:
      "Botafarm daily journal dryback feeds the rule engine: low dryback triggers saturation warnings; aggressive dryback triggers stress monitoring alerts.",
    sourceType: "static",
    tags: ["irrigation", "substrate"],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  },
  {
    id: "ec-runoff",
    title: "EC Runoff",
    category: "Runoff",
    shortExplanation:
      "Electrical conductivity of runoff water. Reveals salt accumulation, uptake balance, and whether feed matches root-zone demand.",
    detailedExplanation:
      "Comparing EC in (feed) to EC runoff shows whether the substrate is accumulating salts or depleting nutrients faster than replenishment. Runoff EC should be tracked every irrigation cycle in precision cultivation, especially during generative steering and late-flower ripening.",
    phaseRelevance: ["Vegetative", "Flower"],
    relatedMetrics: ["ec_in", "ec_runoff", "runoff_percent"],
    recommendedRanges: [
      {
        label: "Runoff vs input delta (watch)",
        min: -0.3,
        max: 0.3,
        unit: "EC delta",
        notes: "Runoff EC minus input EC; within band suggests balance.",
      },
    ],
    warningSigns: [
      "Runoff EC more than 0.3 above input EC — salt accumulation starting",
      "Runoff EC more than 0.6 above input EC — excessive accumulation",
      "Runoff EC more than 0.3 below input EC — rapid nutrient drawdown",
      "Declining runoff percent with rising EC — poor passage / channeling",
    ],
    botafarmNote:
      "Sprint 10 recommendations map directly to this entry. Future imports from Botafarm playbooks can attach variety-specific EC runoff targets here.",
    sourceType: "static",
    tags: ["nutrition", "runoff"],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  },
  {
    id: "vpd",
    title: "VPD (Vapor Pressure Deficit)",
    category: "VPD",
    shortExplanation:
      "Driver of transpiration and calcium mobility. Target bands differ between vegetative and flower phases.",
    detailedExplanation:
      "VPD combines temperature and humidity into a single transpiration demand signal. Too low reduces uptake and can favor pathogens; too high stresses stomata and can slow growth. VPD should be staged with crop phase rather than held constant across the entire cycle.",
    phaseRelevance: ["Vegetative", "Pre-Flower", "Flower"],
    relatedMetrics: ["vpd", "temperature", "humidity"],
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
    warningSigns: [
      "Calcium spotting when VPD is too low in flower",
      "Leaf curl or edge burn when VPD exceeds band for more than 0.3 kPa",
      "Slow drying between irrigations with unstable VPD swings",
    ],
    botafarmNote:
      "Botafarm Grow OS uses these bands in rule-based VPD recommendations today; AI retrieval will cite this entry by id `vpd` in a later sprint.",
    sourceType: "static",
    tags: ["environment", "climate"],
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  },
];
