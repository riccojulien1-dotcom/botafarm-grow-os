import type { GrowRoomTask } from "@/lib/tasks/types";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

export type CommandCenterPriority = {
  id: string;
  title: string;
  roomName: string;
  roomId: string;
  kind: "task";
  severity: "action" | "watch";
  sortRank: number;
};

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

  return items.sort((left, right) => left.sortRank - right.sortRank).slice(0, limit);
}
