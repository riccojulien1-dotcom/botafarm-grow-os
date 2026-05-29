"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  deleteGrowRoomAction,
  updateGrowRoomAction,
} from "@/app/dashboard/grow-rooms/actions";
import { GrowRoomFields, type GrowRoomFieldValues } from "@/components/grow-rooms/grow-room-fields";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";

export type GrowRoomListItem = GrowRoomFieldValues & {
  id: string;
};

type GrowRoomCardProps = {
  room: GrowRoomListItem;
};

const initialState: { error?: string; success?: string } = {};

export function GrowRoomCard({ room }: GrowRoomCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateGrowRoomAction,
    initialState,
  );
  const [, deleteAction, deletePending] = useActionState(deleteGrowRoomAction, initialState);

  if (isEditing && !updateState?.success) {
    return (
      <li className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <form action={updateAction} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="room_id" value={room.id} />
          <GrowRoomFields idPrefix={`edit-${room.id}`} values={room} />

          {updateState?.error ? (
            <p className="md:col-span-2 text-sm text-red-400">{updateState.error}</p>
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
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
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
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
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
    </li>
  );
}
