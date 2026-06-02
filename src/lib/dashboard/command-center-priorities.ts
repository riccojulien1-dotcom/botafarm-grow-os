import type { Recommendation } from "@/lib/recommendations/types";
import { SEVERITY_RANK } from "@/lib/recommendations/types";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

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
  const byMetric: Record<string, { action: string; watch: string }> = {
    "EC Management": {
      action: "Runoff EC out of target range",
      watch: "Runoff check recommended",
    },
    pH: {
      action: "Root zone review suggested",
      watch: "Root zone pH drift noted",
    },
    Dryback: {
      action: "Irrigation strategy review required",
      watch: "Irrigation strategy review suggested",
    },
    VPD: {
      action: "VPD outside target window",
      watch: "Environment review suggested",
    },
    PPFD: {
      action: "Environmental target missed",
      watch: "Light level review suggested",
    },
  };

  const copy = byMetric[item.metric];
  if (copy) {
    return item.severity === "action" ? copy.action : copy.watch;
  }

  if (item.severity === "action") {
    return `${toTitleCase(roomName)} requires attention`;
  }

  return toTitleCase(item.issue);
}

function taskTitle(task: GrowRoomTask, overdue: boolean): string {
  const normalized = task.title.trim().toLowerCase();

  if (normalized.includes("flip") && normalized.includes("flower")) {
    return overdue ? "Flower transition due" : "Flower transition scheduled today";
  }
  if (normalized.includes("defoliat")) {
    return overdue ? "Defoliation due" : "Defoliation scheduled today";
  }
  if (normalized.includes("runoff") || normalized.includes("ec")) {
    return overdue ? "Runoff check due" : "Runoff check scheduled today";
  }
  if (normalized.includes("ph") && normalized.includes("pen")) {
    return overdue ? "pH pen calibration due" : "pH pen calibration scheduled today";
  }
  if (normalized.includes("calibrat")) {
    return overdue ? `${toTitleCase(task.title)} due` : `${toTitleCase(task.title)} scheduled today`;
  }

  const label = toTitleCase(task.title);
  return overdue ? `${label} due` : `${label} scheduled today`;
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
      roomName: toTitleCase(room.name),
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
        roomName: toTitleCase(room.name),
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
