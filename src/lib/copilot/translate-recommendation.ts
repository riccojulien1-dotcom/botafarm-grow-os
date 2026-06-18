import type { Recommendation } from "@/lib/recommendations/types";

export function translateRecommendationForGrower(
  roomName: string,
  recommendation: Recommendation,
): string {
  const room = roomName;

  if (recommendation.metric === "Dryback") {
    if (recommendation.issue.toLowerCase().includes("low")) {
      return `${room} — dryback below target, root zone may stay too wet`;
    }
    if (recommendation.severity === "action") {
      return `${room} — dryback too high, plants may be under-watered`;
    }
    return `${room} — dryback needs attention, check irrigation timing`;
  }

  if (recommendation.metric === "EC Management") {
    if (recommendation.issue.toLowerCase().includes("accumulation")) {
      return `${room} — EC runoff rising, salts building in the root zone`;
    }
    return `${room} — runoff EC needs a closer look at the next feed`;
  }

  if (recommendation.metric === "VPD") {
    return `${room} — VPD outside the ideal window for this phase`;
  }

  if (recommendation.metric === "pH") {
    return `${room} — root zone pH drifting, check your next feed`;
  }

  if (recommendation.metric === "PPFD") {
    return `${room} — light levels off target for this stage`;
  }

  if (recommendation.severity === "action") {
    return `${room} — ${recommendation.issue.toLowerCase()}`;
  }

  return `${room} — ${recommendation.issue.toLowerCase()}`;
}
