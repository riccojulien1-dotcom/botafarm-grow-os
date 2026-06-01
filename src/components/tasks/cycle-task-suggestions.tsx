"use client";

import { useActionState } from "react";

import { createGrowRoomTaskAction } from "@/app/rooms/[id]/task-actions";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import type { SuggestedCycleTask } from "@/lib/tasks/suggest-cycle-tasks";

type CycleTaskSuggestionsProps = {
  growRoomId: string;
  suggestions: SuggestedCycleTask[];
};

const initialState: { error?: string; success?: string } = {};

function dueDateToday() {
  return new Date().toISOString().slice(0, 10);
}

export function CycleTaskSuggestions({ growRoomId, suggestions }: CycleTaskSuggestionsProps) {
  const [state, formAction, pending] = useActionState(createGrowRoomTaskAction, initialState);

  useRefreshOnActionSuccess(state);

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
      <div>
        <h3 className="text-sm font-medium text-amber-200">Cycle phase suggestions</h3>
        <p className="mt-1 text-xs text-zinc-400">
          Based on current flower day. Approve to add a task — nothing is created automatically.
        </p>
      </div>

      <ul className="space-y-3">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs text-amber-200/90">{suggestion.phaseLabel}</p>
              <p className="font-medium text-zinc-100">{suggestion.title}</p>
              <p className="text-sm text-zinc-400">{suggestion.description}</p>
            </div>
            <form action={formAction} className="shrink-0">
              <input type="hidden" name="grow_room_id" value={growRoomId} />
              <input type="hidden" name="title" value={suggestion.title} />
              <input type="hidden" name="description" value={suggestion.description} />
              <input type="hidden" name="category" value={suggestion.category} />
              <input type="hidden" name="priority" value={suggestion.priority} />
              <input type="hidden" name="due_date" value={dueDateToday()} />
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md bg-amber-700/80 px-3 py-1.5 text-sm text-white hover:bg-amber-600 sm:w-auto"
              >
                Add task
              </button>
            </form>
          </li>
        ))}
      </ul>

      {state?.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="text-sm text-green-400">{state.success}</p>
      ) : null}
    </div>
  );
}
