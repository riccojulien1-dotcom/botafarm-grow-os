import type { getTranslations } from "next-intl/server";

import type { CommandCenterPriority } from "@/lib/dashboard/command-center-priorities";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type DashboardTranslator = Awaited<ReturnType<typeof getTranslations<"dashboard">>>;

function taskPriorityTitle(
  t: DashboardTranslator,
  task: GrowRoomTask,
  overdue: boolean,
): string {
  const normalized = task.title.trim().toLowerCase();

  if (normalized.includes("flip") && normalized.includes("flower")) {
    return overdue ? t("priorities.flowerTransitionDue") : t("priorities.flowerTransitionToday");
  }
  if (normalized.includes("defoliat")) {
    return overdue ? t("priorities.defoliationDue") : t("priorities.defoliationToday");
  }
  if (normalized.includes("runoff") || normalized.includes("ec")) {
    return overdue ? t("priorities.runoffCheckDue") : t("priorities.runoffCheckToday");
  }
  if (normalized.includes("ph") && normalized.includes("pen")) {
    return overdue ? t("priorities.phPenDue") : t("priorities.phPenToday");
  }

  const label = toTitleCase(task.title);
  return overdue ? t("priorities.taskDue", { title: label }) : t("priorities.taskToday", { title: label });
}

export function buildLocalizedCommandCenterPriorities(
  t: DashboardTranslator,
  roomsById: Map<string, { name: string }>,
  tasks: GrowRoomTask[],
  limit = 8,
): CommandCenterPriority[] {
  const today = new Date().toISOString().slice(0, 10);
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
      title: taskPriorityTitle(t, task, overdue),
      roomName: toTitleCase(room.name),
      roomId: task.grow_room_id,
      kind: "task",
      severity: overdue ? "action" : "watch",
      sortRank: overdue ? 0 : 2,
    });
  }

  return items.sort((left, right) => left.sortRank - right.sortRank).slice(0, limit);
}
