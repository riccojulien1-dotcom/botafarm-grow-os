import type { RoomTaskSummary } from "@/lib/tasks/task-stats";

type RoomTaskStatusLineProps = {
  summary: RoomTaskSummary | undefined;
};

export function RoomTaskStatusLine({ summary }: RoomTaskStatusLineProps) {
  if (!summary || summary.totalCount === 0) {
    return <p className="text-xs text-zinc-500">Open tasks: 0</p>;
  }

  if (summary.hasOverdue) {
    return (
      <p className="text-xs font-medium text-red-300">
        <span aria-hidden>🔴</span> Overdue tasks ({summary.overdueCount})
      </p>
    );
  }

  if (summary.allComplete) {
    return (
      <p className="text-xs font-medium text-emerald-300">
        <span aria-hidden>🟢</span> Tasks complete
      </p>
    );
  }

  return <p className="text-xs text-zinc-400">Open tasks: {summary.openCount}</p>;
}
