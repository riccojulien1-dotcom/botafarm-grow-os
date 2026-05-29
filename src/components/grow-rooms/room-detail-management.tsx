"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteGrowRoomAction,
  updateGrowRoomAction,
} from "@/app/dashboard/grow-rooms/actions";
import { GrowRoomFields, type GrowRoomFieldValues } from "@/components/grow-rooms/grow-room-fields";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";

type RoomDetailManagementProps = {
  room: GrowRoomFieldValues & { id: string };
};

const initialState: { error?: string; success?: string } = {};

export function RoomDetailManagement({ room }: RoomDetailManagementProps) {
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
    router.push("/dashboard/grow-rooms");
  }, [deleteState, router]);

  function startEditing() {
    setEditSession((current) => current + 1);
    setIsEditing(true);
  }

  if (isEditing) {
    return (
      <article className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <h2 className="font-medium text-white">Edit grow room</h2>
        <form
          key={`room-edit-${room.id}-${editSession}`}
          action={updateAction}
          onKeyDown={preventImplicitFormSubmitOnEnter}
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="room_id" value={room.id} />
          <GrowRoomFields idPrefix={`room-${room.id}`} values={room} />

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
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium text-white">Room management</h2>
      <p className="mt-1 text-sm text-zinc-400">Edit setup details or remove this room.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startEditing}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
        >
          Edit grow room
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
            {deletePending ? "Deleting..." : "Delete grow room"}
          </button>
        </form>
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
    </article>
  );
}
