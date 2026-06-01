import { CreateRoomTaskForm } from "@/components/tasks/create-room-task-form";
import { CycleTaskSuggestions } from "@/components/tasks/cycle-task-suggestions";
import { RoomTaskCard } from "@/components/tasks/room-task-card";
import { RoomTaskSummaryStats } from "@/components/tasks/room-task-summary";
import { summarizeRoomTasks } from "@/lib/tasks/task-stats";
import { getSuggestedCycleTasks } from "@/lib/tasks/suggest-cycle-tasks";
import type { GrowRoomTask } from "@/lib/tasks/types";

type RoomTasksSectionProps = {
  growRoomId: string;
  roomName: string;
  roomStatus: string;
  cycleStartDate: string | null;
  tasks: GrowRoomTask[];
};

export function RoomTasksSection({
  growRoomId,
  roomName,
  roomStatus,
  cycleStartDate,
  tasks,
}: RoomTasksSectionProps) {
  const summary = summarizeRoomTasks(tasks);
  const openTasks = tasks
    .filter((task) => !task.completed)
    .sort((left, right) => left.due_date.localeCompare(right.due_date));
  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort((left, right) => right.due_date.localeCompare(left.due_date));

  const suggestions = getSuggestedCycleTasks(
    roomStatus,
    cycleStartDate,
    tasks.map((task) => task.title),
  );

  return (
    <section className="space-y-4 rounded-xl border border-fuchsia-900/30 bg-zinc-900/50 p-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Workflow for {roomName} — irrigation, plant work, harvest prep, and maintenance.
        </p>
      </div>

      <RoomTaskSummaryStats summary={summary} />

      <CycleTaskSuggestions growRoomId={growRoomId} suggestions={suggestions} />

      <CreateRoomTaskForm growRoomId={growRoomId} />

      {openTasks.length ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
            Open tasks ({openTasks.length})
          </h3>
          <ul className="space-y-3">
            {openTasks.map((task) => (
              <RoomTaskCard key={task.id} task={task} growRoomId={growRoomId} />
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
          No open tasks. Use a quick template or create a custom task above.
        </p>
      )}

      {completedTasks.length ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Completed ({completedTasks.length})
          </h3>
          <ul className="space-y-3">
            {completedTasks.map((task) => (
              <RoomTaskCard key={task.id} task={task} growRoomId={growRoomId} />
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
