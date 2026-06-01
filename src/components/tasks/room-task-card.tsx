"use client";

import { useActionState, useState } from "react";

import {
  deleteGrowRoomTaskAction,
  toggleGrowRoomTaskCompleteAction,
  updateGrowRoomTaskAction,
} from "@/app/rooms/[id]/task-actions";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "@/lib/tasks/constants";
import type { GrowRoomTask } from "@/lib/tasks/types";

type RoomTaskCardProps = {
  task: GrowRoomTask;
  growRoomId: string;
};

const initialState: { error?: string; success?: string } = {};

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

const priorityStyles: Record<string, string> = {
  low: "text-zinc-400",
  medium: "text-amber-200",
  high: "text-red-300",
};

export function RoomTaskCard({ task, growRoomId }: RoomTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [updateState, updateAction, updatePending] = useActionState(
    updateGrowRoomTaskAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteGrowRoomTaskAction,
    initialState,
  );
  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleGrowRoomTaskCompleteAction,
    initialState,
  );

  useRefreshOnActionSuccess(updateState, {
    enabled: isEditing,
    onSuccess: () => setIsEditing(false),
  });
  useRefreshOnActionSuccess(toggleState);
  useRefreshOnActionSuccess(deleteState);

  if (isEditing) {
    return (
      <li className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <form
          key={`edit-task-${task.id}-${editSession}`}
          action={updateAction}
          onKeyDown={preventImplicitFormSubmitOnEnter}
          className="grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="task_id" value={task.id} />
          <input type="hidden" name="grow_room_id" value={growRoomId} />

          <div className="md:col-span-2">
            <label className="text-sm text-zinc-200">Title</label>
            <input
              name="title"
              required
              defaultValue={task.title}
              className={inputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-zinc-200">Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={task.description ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-200">Due date</label>
            <input
              name="due_date"
              type="date"
              required
              defaultValue={task.due_date}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-200">Priority</label>
            <select
              name="priority"
              defaultValue={task.priority}
              className={inputClassName}
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-zinc-200">Category</label>
            <select name="category" defaultValue={task.category} className={inputClassName}>
              {TASK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-2">
            <input type="checkbox" name="completed" defaultChecked={task.completed} />
            Mark completed
          </label>

          {updateState?.error ? (
            <p className="md:col-span-2 text-sm text-red-400" role="alert">
              {updateState.error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={updatePending}
              className="rounded-md bg-fuchsia-600 px-3 py-1.5 text-sm text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
            >
              {updatePending ? "Saving..." : "Save task"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  const isOverdue = !task.completed && task.due_date < new Date().toISOString().slice(0, 10);

  return (
    <li
      className={`rounded-xl border bg-zinc-900 p-4 ${
        task.completed
          ? "border-zinc-800/80 opacity-75"
          : isOverdue
            ? "border-red-900/50"
            : "border-zinc-800"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
              {task.category}
            </span>
            <span className={`text-xs uppercase ${priorityStyles[task.priority] ?? ""}`}>
              {task.priority}
            </span>
            {isOverdue ? (
              <span className="text-xs text-red-300">Overdue</span>
            ) : null}
          </div>
          <p
            className={`font-medium ${task.completed ? "text-zinc-500 line-through" : "text-white"}`}
          >
            {task.title}
          </p>
          {task.description ? (
            <p className="text-sm text-zinc-400">{task.description}</p>
          ) : null}
          <p className="text-xs text-zinc-500">Due {task.due_date}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!task.completed ? (
            <form action={toggleAction}>
              <input type="hidden" name="task_id" value={task.id} />
              <input type="hidden" name="grow_room_id" value={growRoomId} />
              <input type="hidden" name="mark_complete" value="true" />
              <button
                type="submit"
                disabled={togglePending}
                className="rounded-md border border-emerald-900/50 px-3 py-1.5 text-sm text-emerald-300 hover:border-emerald-500"
              >
                Complete
              </button>
            </form>
          ) : (
            <form action={toggleAction}>
              <input type="hidden" name="task_id" value={task.id} />
              <input type="hidden" name="grow_room_id" value={growRoomId} />
              <input type="hidden" name="mark_complete" value="false" />
              <button
                type="submit"
                disabled={togglePending}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
              >
                Reopen
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => {
              setEditSession((value) => value + 1);
              setIsEditing(true);
            }}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
          >
            Edit
          </button>
          <form
            action={deleteAction}
            onSubmit={(event) => {
              if (!window.confirm(`Delete task "${task.title}"?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="task_id" value={task.id} />
            <input type="hidden" name="grow_room_id" value={growRoomId} />
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-md border border-red-900/60 px-3 py-1.5 text-sm text-red-300 hover:border-red-500"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
