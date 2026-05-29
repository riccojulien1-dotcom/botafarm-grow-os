"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteGrowRoomAction,
  updateGrowRoomAction,
} from "@/app/dashboard/grow-rooms/actions";
import { GrowRoomCycleSummary } from "@/components/grow-rooms/grow-room-cycle-summary";
import { GrowRoomFields, type GrowRoomFieldValues } from "@/components/grow-rooms/grow-room-fields";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";

export type GrowRoomListItem = GrowRoomFieldValues & {
  id: string;
};

type GrowRoomCardProps = {
  room: GrowRoomListItem;
};

const initialState: { error?: string; success?: string } = {};

export function GrowRoomCard({ room }: GrowRoomCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [updateState, updateAction, updatePending] = useActionState(
    updateGrowRoomAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteGrowRoomAction,
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

  function startEditing() {
    setEditSession((current) => current + 1);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <form
          key={`edit-${room.id}-${editSession}`}
          action={updateAction}
          onKeyDown={preventImplicitFormSubmitOnEnter}
          className="grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="room_id" value={room.id} />
          <GrowRoomFields idPrefix={`edit-${room.id}`} values={room} />

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
              onClick={cancelEditing}
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
    <li className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/rooms/${room.id}`}
              className="text-sm font-medium text-white hover:text-fuchsia-300"
            >
              {room.name}
            </Link>
            <GrowRoomStatusBadge status={room.status} />
          </div>
          <p className="text-sm text-zinc-400">
            {room.room_type ?? "No type"} · {room.plant_count ?? 0} plants
          </p>
          <GrowRoomCycleSummary
            status={room.status}
            cycleStartDate={room.cycle_start_date}
            targetCycleDays={room.target_cycle_days}
            compact
          />
        </div>

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
                `Delete "${room.name}"? All journal logs for this room will also be deleted.`,
              );
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="room_id" value={room.id} />
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

      {updateState?.success ? (
        <p className="mt-3 text-sm text-green-400">{updateState.success}</p>
      ) : null}
      {updateState?.error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {updateState.error}
        </p>
      ) : null}
      {deleteState?.error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {deleteState.error}
        </p>
      ) : null}
    </li>
  );
}
