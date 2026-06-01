import type {
  Recommendation,
  RecommendationLogInput,
  RecommendationSeverity,
} from "@/lib/recommendations/types";
import { SEVERITY_RANK } from "@/lib/recommendations/types";
import { applyVarietyRecommendationHooks } from "@/lib/varieties/recommendation-hooks";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

const VEG_STATUSES = new Set(["Clone", "Mother", "Vegetative", "Pre-Flower"]);

function isVegPhase(roomStatus: string) {
  return VEG_STATUSES.has(roomStatus);
}

function isFlowerPhase(roomStatus: string) {
  return roomStatus === "Flower";
}

function evaluateEcRules(log: RecommendationLogInput): Recommendation[] {
  const results: Recommendation[] = [];
  const { ec_in, ec_runoff } = log;

  if (ec_in == null || ec_runoff == null) {
    return results;
  }

  const delta = ec_runoff - ec_in;

  if (delta > 0.6) {
    results.push({
      severity: "action",
      metric: "EC Management",
      issue: "Excessive accumulation",
      recommendation:
        "Runoff EC is significantly higher than feed EC. Reduce substrate EC before continuing.",
    });
  } else if (delta > 0.3) {
    results.push({
      severity: "watch",
      metric: "EC Management",
      issue: "Salt accumulation starting",
      recommendation:
        "Runoff EC is higher than input EC. Monitor accumulation and consider increasing runoff.",
    });
  } else if (delta < -0.3) {
    results.push({
      severity: "watch",
      metric: "EC Management",
      issue: "Substrate EC lower than feed",
      recommendation:
        "Plants may be consuming nutrients faster than replenishment.",
    });
  }

  return results;
}

function evaluateDrybackRules(log: RecommendationLogInput): Recommendation[] {
  const { dryback_percent } = log;
  if (dryback_percent == null) {
    return [];
  }

  if (dryback_percent > 30) {
    return [
      {
        severity: "action",
        metric: "Dryback",
        issue: "Excessive dryback",
        recommendation: "Dryback may be limiting growth.",
      },
    ];
  }

  if (dryback_percent > 20) {
    return [
      {
        severity: "watch",
        metric: "Dryback",
        issue: "Dryback aggressive",
        recommendation: "Monitor plant stress and substrate moisture.",
      },
    ];
  }

  if (dryback_percent < 8) {
    return [
      {
        severity: "watch",
        metric: "Dryback",
        issue: "Dryback too low",
        recommendation: "Root zone may remain overly saturated.",
      },
    ];
  }

  return [];
}

function evaluateVpdRules(
  log: RecommendationLogInput,
  roomStatus: string,
): Recommendation[] {
  const { vpd } = log;
  if (vpd == null) {
    return [];
  }

  let min: number;
  let max: number;

  if (isVegPhase(roomStatus)) {
    min = 0.8;
    max = 1.2;
  } else if (isFlowerPhase(roomStatus)) {
    min = 1.1;
    max = 1.5;
  } else {
    return [];
  }

  const belowBy = min - vpd;
  const aboveBy = vpd - max;

  if (belowBy > 0.3 || aboveBy > 0.3) {
    return [
      {
        severity: "action",
        metric: "VPD",
        issue: "VPD requires correction",
        recommendation: `VPD is ${vpd} kPa. Target ${min}–${max} kPa for ${isVegPhase(roomStatus) ? "veg" : "flower"}. Adjust humidity or temperature.`,
      },
    ];
  }

  if (vpd < min || vpd > max) {
    return [
      {
        severity: "watch",
        metric: "VPD",
        issue: "VPD out of target range",
        recommendation: `VPD is ${vpd} kPa. Target ${min}–${max} kPa for ${isVegPhase(roomStatus) ? "veg" : "flower"}.`,
      },
    ];
  }

  return [];
}

function evaluatePpfdRules(
  log: RecommendationLogInput,
  roomStatus: string,
): Recommendation[] {
  const { ppfd } = log;
  if (ppfd == null) {
    return [];
  }

  let min: number;
  let max: number;

  if (isVegPhase(roomStatus)) {
    min = 300;
    max = 700;
  } else if (isFlowerPhase(roomStatus)) {
    min = 700;
    max = 1100;
  } else {
    return [];
  }

  if (ppfd < min) {
    return [
      {
        severity: "watch",
        metric: "PPFD",
        issue: "Light intensity low",
        recommendation: `PPFD is ${ppfd} µmol/m²/s. Target ${min}–${max} for ${isVegPhase(roomStatus) ? "veg" : "flower"}.`,
      },
    ];
  }

  if (ppfd > max) {
    return [
      {
        severity: "watch",
        metric: "PPFD",
        issue: "Light intensity high",
        recommendation: `PPFD is ${ppfd} µmol/m²/s. Target ${min}–${max} for ${isVegPhase(roomStatus) ? "veg" : "flower"}.`,
      },
    ];
  }

  return [];
}

function evaluatePhRules(log: RecommendationLogInput): Recommendation[] {
  const results: Recommendation[] = [];
  const { ph_in, ph_runoff } = log;

  if (ph_in != null && (ph_in < 5.5 || ph_in > 6.5)) {
    results.push({
      severity: "action",
      metric: "pH",
      issue: "pH outside safe range",
      recommendation: "Input pH is outside the 5.5–6.5 safe range. Adjust feed pH before next irrigation.",
    });
  }

  if (ph_in != null && ph_runoff != null && Math.abs(ph_runoff - ph_in) > 0.5) {
    results.push({
      severity: "watch",
      metric: "pH",
      issue: "Root zone pH drift",
      recommendation: "Runoff pH differs from input by more than 0.5. Monitor root zone pH drift.",
    });
  }

  return results;
}

export function evaluateRecommendations(
  log: RecommendationLogInput | null | undefined,
  roomStatus: string,
): Recommendation[] {
  if (!log) {
    return [];
  }

  return [
    ...evaluateEcRules(log),
    ...evaluateDrybackRules(log),
    ...evaluateVpdRules(log, roomStatus),
    ...evaluatePpfdRules(log, roomStatus),
    ...evaluatePhRules(log),
  ];
}

export function getHighestSeverity(
  recommendations: Recommendation[],
): RecommendationSeverity {
  if (!recommendations.length) {
    return "good";
  }

  return recommendations.reduce<RecommendationSeverity>(
    (highest, item) =>
      SEVERITY_RANK[item.severity] > SEVERITY_RANK[highest] ? item.severity : highest,
    "good",
  );
}

export function getRecommendationSummary(
  log: RecommendationLogInput | null | undefined,
  roomStatus: string,
  varieties: RoomVarietyRecord[] = [],
) {
  const baseItems = evaluateRecommendations(log, roomStatus);
  const items =
    log && varieties.length
      ? applyVarietyRecommendationHooks(baseItems, log, varieties)
      : baseItems;
  const severity = getHighestSeverity(items);

  return {
    severity,
    items,
    activeItems: items.filter((item) => item.severity !== "good"),
  };
}
