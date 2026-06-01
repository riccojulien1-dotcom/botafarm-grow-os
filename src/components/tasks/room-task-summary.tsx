import type { RoomTaskSummary } from "@/lib/tasks/task-stats";

type RoomTaskSummaryProps = {
  summary: RoomTaskSummary;
};

export function RoomTaskSummaryStats({ summary }: RoomTaskSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label="Due today" value={String(summary.dueTodayCount)} />
      <SummaryCard label="Upcoming" value={String(summary.upcomingCount)} />
      <SummaryCard
        label="Overdue"
        value={String(summary.overdueCount)}
        highlight={summary.hasOverdue ? "danger" : undefined}
      />
      <SummaryCard
        label="Completed this week"
        value={String(summary.completedThisWeekCount)}
        highlight={summary.allComplete ? "success" : undefined}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "danger" | "success";
}) {
  const tone =
    highlight === "danger"
      ? "border-red-900/50 text-red-300"
      : highlight === "success"
        ? "border-emerald-900/50 text-emerald-300"
        : "border-zinc-800 text-zinc-100";

  return (
    <div className={`rounded-lg border bg-zinc-950/80 p-3 ${tone}`}>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
