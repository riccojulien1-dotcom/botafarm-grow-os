import type { Recommendation } from "@/lib/recommendations/types";

export type GrowerAlertTranslator = (
  key:
    | "drybackBelowTarget"
    | "drybackTooHigh"
    | "drybackNeedsAttention"
    | "ecRunoffRising"
    | "ecRunoffCheck"
    | "vpdOutsideIdeal"
    | "phDrifting"
    | "ppfdOffTarget"
    | "genericIssue",
  values: { room: string; issue?: string },
) => string;

export function translateRecommendationForGrower(
  t: GrowerAlertTranslator,
  roomName: string,
  recommendation: Recommendation,
): string {
  const room = roomName;

  if (recommendation.metric === "Dryback") {
    if (recommendation.issue.toLowerCase().includes("low")) {
      return t("drybackBelowTarget", { room });
    }
    if (recommendation.severity === "action") {
      return t("drybackTooHigh", { room });
    }
    return t("drybackNeedsAttention", { room });
  }

  if (recommendation.metric === "EC Management") {
    if (recommendation.issue.toLowerCase().includes("accumulation")) {
      return t("ecRunoffRising", { room });
    }
    return t("ecRunoffCheck", { room });
  }

  if (recommendation.metric === "VPD") {
    return t("vpdOutsideIdeal", { room });
  }

  if (recommendation.metric === "pH") {
    return t("phDrifting", { room });
  }

  if (recommendation.metric === "PPFD") {
    return t("ppfdOffTarget", { room });
  }

  return t("genericIssue", {
    room,
    issue: recommendation.issue.toLowerCase(),
  });
}
