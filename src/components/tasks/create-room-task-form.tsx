"use client";

import { useActionState } from "react";

import { createGrowRoomTaskAction } from "@/app/rooms/[id]/task-actions";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import { QUICK_TASK_TEMPLATES, TASK_CATEGORIES, TASK_PRIORITIES } from "@/lib/tasks/constants";

type CreateRoomTaskFormProps = {
  growRoomId: string;
};

const initialState: { error?: string; success?: string } = {};

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

function dueDateFromOffset(daysFromToday = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

export function CreateRoomTaskForm({ growRoomId }: CreateRoomTaskFormProps) {
  const [state, formAction, pending] = useActionState(createGrowRoomTaskAction, initialState);

  useRefreshOnActionSuccess(state);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-zinc-200">Quick templates</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_TASK_TEMPLATES.map((template) => (
            <form key={template.id} action={formAction} className="inline">
              <input type="hidden" name="grow_room_id" value={growRoomId} />
              <input type="hidden" name="title" value={template.title} />
              <input type="hidden" name="description" value={template.description} />
              <input type="hidden" name="category" value={template.category} />
              <input type="hidden" name="priority" value={template.priority} />
              <input
                type="hidden"
                name="due_date"
                value={dueDateFromOffset(template.daysFromToday ?? 0)}
              />
              <button
                type="submit"
                disabled={pending}
                className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs hover:border-fuchsia-500 hover:text-fuchsia-300"
              >
                + {template.title}
              </button>
            </form>
          ))}
        </div>
      </div>

      <form
        action={formAction}
        onKeyDown={preventImplicitFormSubmitOnEnter}
        className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 md:grid-cols-2"
      >
        <input type="hidden" name="grow_room_id" value={growRoomId} />

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-200">Title</label>
          <input name="title" required className={inputClassName} placeholder="Task title" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-200">Description</label>
          <textarea
            name="description"
            rows={2}
            className={inputClassName}
            placeholder="Optional details"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-200">Due date</label>
          <input
            name="due_date"
            type="date"
            required
            defaultValue={dueDateFromOffset(0)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="text-sm text-zinc-200">Priority</label>
          <select name="priority" defaultValue="medium" className={inputClassName}>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-200">Category</label>
          <select name="category" required defaultValue="Plant Work" className={inputClassName}>
            <option value="">Select category</option>
            {TASK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {state?.error ? (
          <p className="md:col-span-2 text-sm text-red-400" role="alert">
            {state.error}
          </p>
        ) : null}
        {state?.success ? (
          <p className="md:col-span-2 text-sm text-green-400">{state.success}</p>
        ) : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
          >
            {pending ? "Creating..." : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
