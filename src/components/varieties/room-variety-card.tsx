"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteRoomVarietyAction,
  updateRoomVarietyAction,
} from "@/app/rooms/[id]/variety-actions";
import { VarietyFields } from "@/components/varieties/variety-fields";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import { SENSITIVITY_LABELS } from "@/lib/varieties/constants";
import type { VarietyFieldValues } from "@/lib/varieties/parse-variety-form";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

function varietyToFieldValues(variety: RoomVarietyRecord): VarietyFieldValues {
  return {
    name: variety.name,
    genetics: variety.genetics,
    plant_count: variety.plant_count ?? 0,
    variety_type: variety.variety_type,
    flowering_duration_days: variety.flowering_duration_days,
    harvest_window_start_days: variety.harvest_window_start_days,
    harvest_window_end_days: variety.harvest_window_end_days,
    stretch: variety.stretch,
    ec_sensitivity: variety.ec_sensitivity,
    irrigation_sensitivity: variety.irrigation_sensitivity,
    phenotype_notes: variety.phenotype_notes,
    notes: variety.notes,
    preset_slug: variety.preset_slug,
  };
}

type RoomVarietyCardProps = {
  variety: RoomVarietyRecord;
  growRoomId: string;
};

const initialState: { error?: string; success?: string } = {};

function formatTiming(variety: RoomVarietyRecord) {
  if (
    variety.harvest_window_start_days != null &&
    variety.harvest_window_end_days != null
  ) {
    return `Harvest window: day ${variety.harvest_window_start_days}–${variety.harvest_window_end_days}`;
  }
  if (variety.flowering_duration_days != null) {
    return `Flowering target: ${variety.flowering_duration_days} days`;
  }
  return "Set harvest window or flowering target";
}

export function RoomVarietyCard({ variety, growRoomId }: RoomVarietyCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [updateState, updateAction, updatePending] = useActionState(
    updateRoomVarietyAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteRoomVarietyAction,
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

  if (isEditing) {
    return (
      <li className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <form
          key={`edit-variety-${variety.id}-${editSession}`}
          action={updateAction}
          onKeyDown={preventImplicitFormSubmitOnEnter}
          className="grid gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="variety_id" value={variety.id} />
          <input type="hidden" name="grow_room_id" value={growRoomId} />
          {variety.preset_slug ? (
            <input type="hidden" name="preset_slug" value={variety.preset_slug} />
          ) : null}
          <VarietyFields
            idPrefix={`edit-variety-${variety.id}`}
            values={varietyToFieldValues(variety)}
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
              {updatePending ? "Saving..." : "Save variety"}
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
    <li className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-medium text-white">
              {variety.plant_count ?? 0} {variety.name}
            </p>
            <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
              {variety.variety_type}
            </span>
            {variety.preset_slug ? (
              <span className="text-xs text-zinc-500">from preset</span>
            ) : null}
          </div>
          <p className="text-sm text-zinc-300">
            {variety.genetics ?? "Cross / genetics not set"}
          </p>
          <p className="text-sm text-fuchsia-300/90">{formatTiming(variety)}</p>
          <p className="text-xs text-zinc-500">
            Stretch {SENSITIVITY_LABELS[variety.stretch]} · EC{" "}
            {SENSITIVITY_LABELS[variety.ec_sensitivity]} · Irrigation{" "}
            {SENSITIVITY_LABELS[variety.irrigation_sensitivity]}
          </p>
          {variety.phenotype_notes ? (
            <p className="pt-1 text-sm text-zinc-400">
              <span className="text-zinc-500">Phenotype: </span>
              {variety.phenotype_notes}
            </p>
          ) : null}
          {variety.notes ? (
            <p className="text-sm text-zinc-500">{variety.notes}</p>
          ) : null}
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
              const confirmed = window.confirm(`Delete variety "${variety.name}"?`);
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="variety_id" value={variety.id} />
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

      {deleteState?.error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {deleteState.error}
        </p>
      ) : null}
    </li>
  );
}
