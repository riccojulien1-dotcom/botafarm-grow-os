"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteRoomDailyLogAction,
  updateRoomDailyLogAction,
} from "@/app/rooms/[id]/actions";
import { DailyLogFields } from "@/components/journal/daily-log-fields";
import { DailyLogMetrics } from "@/components/journal/daily-log-metrics";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";

export type RoomDailyLog = DailyLogRecord;

type RoomDailyLogCardProps = {
  log: RoomDailyLog;
  growRoomId: string;
};

const initialState: { error?: string; success?: string } = {};

function formatDate(log: RoomDailyLog) {
  if (log.log_date) {
    return log.log_date;
  }
  return new Date(log.logged_at).toISOString().slice(0, 10);
}

export function RoomDailyLogCard({ log, growRoomId }: RoomDailyLogCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [updateState, updateAction, updatePending] = useActionState(
    updateRoomDailyLogAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteRoomDailyLogAction,
    initialState,
  );
  const lastDeleteHandledRef = useRef(initialState);

  useRefreshOnActionSuccess(updateState, {
    enabled: isEditing,
    onSuccess: () => setIsEditing(false),
  });

  useEffect(() => {
    if (!deleteState?.success || deleteState === lastDeleteHandledRef.current) {
      return;
    }

    lastDeleteHandledRef.current = deleteState;
    router.refresh();
  }, [deleteState, router]);

  const logDate = formatDate(log);

  function startEditing() {
    setEditSession((current) => current + 1);
    setIsEditing(true);
  }

  if (isEditing) {
    return (
      <li className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <form
          key={`edit-log-${log.id}-${editSession}`}
          action={updateAction}
          onKeyDown={preventImplicitFormSubmitOnEnter}
          className="grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="log_id" value={log.id} />
          <input type="hidden" name="grow_room_id" value={growRoomId} />
          <DailyLogFields
            idPrefix={`edit-log-${log.id}`}
            values={{ ...log, log_date: logDate }}
          />

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
              {updatePending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={updatePending}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-xl bf-inset-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-medium text-fuchsia-300">{logDate}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startEditing}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
          >
            Edit
          </button>
          <form
            action={deleteAction}
            onSubmit={(event) => {
              const confirmed = window.confirm(
                "Delete this journal log? This action cannot be undone.",
              );
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="log_id" value={log.id} />
            <input type="hidden" name="grow_room_id" value={growRoomId} />
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-md border border-red-900/60 px-3 py-1.5 text-sm text-red-300 hover:border-red-500 disabled:opacity-60"
            >
              {deletePending ? "Deleting..." : "Delete"}
            </button>
          </form>
        </div>
      </div>

      <DailyLogMetrics log={log} />

      {updateState?.success ? (
        <p className="mt-3 text-sm text-green-400">{updateState.success}</p>
      ) : null}
      {deleteState?.error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {deleteState.error}
        </p>
      ) : null}
    </li>
  );
}
