import type { GrowRoomTask } from "@/lib/tasks/types";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function summarizeRoomTasks(tasks: GrowRoomTask[]) {
  const today = todayIsoDate();
  const weekStart = startOfWeek(new Date());
  const openTasks = tasks.filter((task) => !task.completed);

  const dueToday = openTasks.filter((task) => task.due_date === today);
  const overdue = openTasks.filter((task) => task.due_date < today);
  const upcoming = openTasks.filter((task) => task.due_date > today);

  const completedThisWeek = tasks.filter((task) => {
    if (!task.completed || !task.completed_at) {
      return false;
    }
    return new Date(task.completed_at) >= weekStart;
  });

  return {
    openCount: openTasks.length,
    overdueCount: overdue.length,
    dueTodayCount: dueToday.length,
    upcomingCount: upcoming.length,
    completedThisWeekCount: completedThisWeek.length,
    totalCount: tasks.length,
    allComplete: tasks.length > 0 && openTasks.length === 0,
    hasOverdue: overdue.length > 0,
    dueToday,
    upcoming,
    overdue,
    completedThisWeek,
  };
}

export type RoomTaskSummary = ReturnType<typeof summarizeRoomTasks>;

export function indexTaskSummariesByRoom(tasks: GrowRoomTask[]) {
  const grouped = new Map<string, GrowRoomTask[]>();

  for (const task of tasks) {
    const list = grouped.get(task.grow_room_id) ?? [];
    list.push(task);
    grouped.set(task.grow_room_id, list);
  }

  const summaries = new Map<string, RoomTaskSummary>();

  for (const [roomId, roomTasks] of grouped) {
    summaries.set(roomId, summarizeRoomTasks(roomTasks));
  }

  return summaries;
}
