import type { Recommendation, RecommendationLogInput } from "@/lib/recommendations/types";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import type { SensitivityLevel } from "@/lib/varieties/constants";

type VarietyTraitAggregate = {
  hasHighStretch: boolean;
  hasHighEcSensitivity: boolean;
  hasHighIrrigationSensitivity: boolean;
};

function aggregateVarietyTraits(varieties: RoomVarietyRecord[]): VarietyTraitAggregate {
  return {
    hasHighStretch: varieties.some((variety) => variety.stretch === "high"),
    hasHighEcSensitivity: varieties.some((variety) => variety.ec_sensitivity === "high"),
    hasHighIrrigationSensitivity: varieties.some(
      (variety) => variety.irrigation_sensitivity === "high",
    ),
  };
}

function evaluateEcWithThresholds(
  log: RecommendationLogInput,
  watchDelta: number,
  actionDelta: number,
): Recommendation[] {
  const results: Recommendation[] = [];
  const { ec_in, ec_runoff } = log;

  if (ec_in == null || ec_runoff == null) {
    return results;
  }

  const delta = ec_runoff - ec_in;

  if (delta > actionDelta) {
    results.push({
      severity: "action",
      metric: "EC Management",
      issue: "Excessive accumulation",
      recommendation:
        "Runoff EC is significantly higher than feed EC. Reduce substrate EC before continuing.",
    });
  } else if (delta > watchDelta) {
    results.push({
      severity: "watch",
      metric: "EC Management",
      issue: "Salt accumulation starting",
      recommendation:
        "Runoff EC is higher than input EC. Monitor accumulation and consider increasing runoff.",
    });
  } else if (delta < -watchDelta) {
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

function evaluateDrybackWithThresholds(
  log: RecommendationLogInput,
  watchHigh: number,
  actionHigh: number,
  watchLow: number,
): Recommendation[] {
  const { dryback_percent } = log;
  if (dryback_percent == null) {
    return [];
  }

  if (dryback_percent > actionHigh) {
    return [
      {
        severity: "action",
        metric: "Dryback",
        issue: "Excessive dryback",
        recommendation: "Dryback may be limiting growth.",
      },
    ];
  }

  if (dryback_percent > watchHigh) {
    return [
      {
        severity: "watch",
        metric: "Dryback",
        issue: "Dryback aggressive",
        recommendation: "Monitor plant stress and substrate moisture.",
      },
    ];
  }

  if (dryback_percent < watchLow) {
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

function stripMetrics(items: Recommendation[], metrics: string[]) {
  return items.filter((item) => !metrics.includes(item.metric));
}

function appendVarietyContext(
  item: Recommendation,
  suffix: string,
): Recommendation {
  return {
    ...item,
    recommendation: `${item.recommendation} ${suffix}`,
  };
}

/**
 * Applies genotype-aware adjustments on top of base journal rules.
 * Uses denormalized room_varieties traits (not live preset lookup).
 */
export function applyVarietyRecommendationHooks(
  baseItems: Recommendation[],
  log: RecommendationLogInput,
  varieties: RoomVarietyRecord[],
): Recommendation[] {
  if (!varieties.length) {
    return baseItems;
  }

  const traits = aggregateVarietyTraits(varieties);
  let items = [...baseItems];

  if (traits.hasHighEcSensitivity) {
    const ecItems = evaluateEcWithThresholds(log, 0.2, 0.45).map((item) =>
      appendVarietyContext(
        item,
        "(Room includes high EC sensitivity varieties — monitor runoff closely.)",
      ),
    );
    items = [...stripMetrics(items, ["EC Management"]), ...ecItems];
  }

  if (traits.hasHighIrrigationSensitivity) {
    items = [
      ...stripMetrics(items, ["Dryback"]),
      ...evaluateDrybackWithThresholds(log, 15, 25, 8),
    ];
    items = items.map((item) =>
      item.metric === "Dryback"
        ? appendVarietyContext(
            item,
            "(Room includes high irrigation sensitivity varieties — tighten dryback monitoring.)",
          )
        : item,
    );
  }

  if (traits.hasHighStretch) {
    const hasCanopyItem = items.some(
      (item) => item.metric === "Canopy" || item.issue.toLowerCase().includes("canopy"),
    );
    if (!hasCanopyItem) {
      items.push({
        severity: "watch",
        metric: "Canopy",
        issue: "High stretch genetics in room",
        recommendation:
          "Plan strategic canopy management and defoliation for tall/stretchy varieties.",
      });
    }
  }

  return items;
}

export function maxSensitivityLevel(
  varieties: RoomVarietyRecord[],
  field: "ec_sensitivity" | "irrigation_sensitivity" | "stretch",
): SensitivityLevel {
  const rank: Record<SensitivityLevel, number> = { low: 0, medium: 1, high: 2 };
  return varieties.reduce<SensitivityLevel>(
    (max, variety) => (rank[variety[field]] > rank[max] ? variety[field] : max),
    "medium",
  );
}
