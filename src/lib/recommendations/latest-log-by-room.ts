import type { RecommendationLogInput } from "@/lib/recommendations/types";

export type DailyLogForRecommendations = RecommendationLogInput & {
  grow_room_id: string;
  log_date: string | null;
  logged_at: string;
};

export function indexLatestLogsByRoom(logs: DailyLogForRecommendations[]) {
  const map = new Map<string, DailyLogForRecommendations>();

  for (const log of logs) {
    if (!map.has(log.grow_room_id)) {
      map.set(log.grow_room_id, log);
    }
  }

  return map;
}

export function formatLogDateLabel(log: DailyLogForRecommendations | null | undefined) {
  if (!log) {
    return null;
  }
  if (log.log_date) {
    return log.log_date;
  }
  return new Date(log.logged_at).toISOString().slice(0, 10);
}
