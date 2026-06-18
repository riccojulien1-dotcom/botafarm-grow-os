import type { DailyLogForRecommendations } from "@/lib/recommendations/latest-log-by-room";

export type DashboardRoomEnvironmentLog = DailyLogForRecommendations & {
  temperature: number | null;
  humidity: number | null;
};

export function indexTrendLogsByRoom(
  logs: DashboardRoomEnvironmentLog[],
  limitPerRoom = 14,
): Map<string, DashboardRoomEnvironmentLog[]> {
  const byRoom = new Map<string, DashboardRoomEnvironmentLog[]>();

  for (const log of logs) {
    const list = byRoom.get(log.grow_room_id) ?? [];
    if (list.length < limitPerRoom) {
      list.push(log);
      byRoom.set(log.grow_room_id, list);
    }
  }

  for (const [roomId, list] of byRoom) {
    byRoom.set(roomId, [...list].reverse());
  }

  return byRoom;
}
