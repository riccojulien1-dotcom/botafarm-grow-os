import type { Recommendation } from "@/lib/recommendations/types";
import { SEVERITY_RANK } from "@/lib/recommendations/types";
import type { GrowRoomTask } from "@/lib/tasks/types";

export type CommandCenterPriority = {
  id: string;
  title: string;
  roomName: string;
  roomId: string;
  kind: "task" | "alert";
  severity: "action" | "watch";
  sortRank: number;
};

function recommendationTitle(item: Recommendation, roomName: string): string {
  const room = roomName.toUpperCase();

  const byMetric: Record<string, string> = {
    "EC Management":
      item.severity === "action"
        ? "RUNOFF EC OUT OF TARGET RANGE"
        : "RUNOFF EC TRENDING OUT OF RANGE",
    pH:
      item.severity === "action"
        ? "ROOT ZONE DATA REQUIRES REVIEW"
        : "ROOT ZONE PH DRIFT DETECTED",
    Dryback: "IRRIGATION STRATEGY REVIEW REQUIRED",
    VPD: "VPD OUTSIDE TARGET WINDOW",
    PPFD: "ENVIRONMENTAL TARGET MISSED",
  };

  if (byMetric[item.metric]) {
    return byMetric[item.metric];
  }

  if (item.severity === "action") {
    return `${room} REQUIRES ATTENTION`;
  }

  return item.issue.toUpperCase();
}

function taskTitle(task: GrowRoomTask, overdue: boolean): string {
  const label = task.title.toUpperCase();
  if (overdue) {
    return `${label} — OVERDUE`;
  }
  return `${label} — DUE TODAY`;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildCommandCenterPriorities(
  roomsById: Map<string, { name: string }>,
  tasks: GrowRoomTask[],
  recommendationsByRoom: Map<string, Recommendation[]>,
  limit = 8,
): CommandCenterPriority[] {
  const today = todayIsoDate();
  const items: CommandCenterPriority[] = [];

  for (const task of tasks) {
    if (task.completed) continue;
    const room = roomsById.get(task.grow_room_id);
    if (!room) continue;

    const overdue = task.due_date < today;
    const dueToday = task.due_date === today;
    if (!overdue && !dueToday) continue;

    items.push({
      id: `task-${task.id}`,
      title: taskTitle(task, overdue),
      roomName: room.name.toUpperCase(),
      roomId: task.grow_room_id,
      kind: "task",
      severity: overdue ? "action" : "watch",
      sortRank: overdue ? 0 : 2,
    });
  }

  for (const [roomId, recs] of recommendationsByRoom) {
    const room = roomsById.get(roomId);
    if (!room) continue;

    for (const rec of recs) {
      if (rec.severity === "good") continue;
      items.push({
        id: `alert-${roomId}-${rec.metric}`,
        title: recommendationTitle(rec, room.name),
        roomName: room.name.toUpperCase(),
        roomId,
        kind: "alert",
        severity: rec.severity,
        sortRank: rec.severity === "action" ? 1 : 3,
      });
    }
  }

  return items
    .sort((left, right) => {
      if (left.sortRank !== right.sortRank) return left.sortRank - right.sortRank;
      return SEVERITY_RANK[right.severity] - SEVERITY_RANK[left.severity];
    })
    .slice(0, limit);
}
