"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteGrowRoomAction,
  updateGrowRoomAction,
} from "@/app/dashboard/grow-rooms/actions";
import { RoomRecommendationSummaryLine } from "@/components/recommendations/room-recommendation-summary-line";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import { GrowRoomCycleSummary } from "@/components/grow-rooms/grow-room-cycle-summary";
import {
  getNextHarvestPreview,
  type VarietyForHarvest,
} from "@/lib/grow-rooms/crop-cycle";
import { RoomVarietyIntelligenceLine } from "@/components/grow-rooms/room-variety-intelligence-line";
import { RoomTaskStatusLine } from "@/components/tasks/room-task-status-line";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
import type { RecommendationLogInput } from "@/lib/recommendations/types";
import type { RoomTaskSummary } from "@/lib/tasks/task-stats";
import { getRoomVarietyIntelligence } from "@/lib/varieties/intelligence";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { GrowRoomFields, type GrowRoomFieldValues } from "@/components/grow-rooms/grow-room-fields";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";

export type GrowRoomListItem = GrowRoomFieldValues & {
  id: string;
};

type GrowRoomCardProps = {
  room: GrowRoomListItem;
  varieties?: VarietyForHarvest[];
  latestLog?: RecommendationLogInput | null;
  taskSummary?: RoomTaskSummary;
  roomVarieties?: RoomVarietyRecord[];
};

const initialState: { error?: string; success?: string } = {};

export function GrowRoomCard({
  room,
  varieties = [],
  latestLog = null,
  taskSummary,
  roomVarieties = [],
}: GrowRoomCardProps) {
  const recommendationSummary = getRecommendationSummary(
    latestLog,
    room.status,
    roomVarieties,
  );
  const varietyIntelligence = getRoomVarietyIntelligence(
    roomVarieties,
    room.cycle_start_date,
    room.status,
  );
  const nextHarvest = getNextHarvestPreview(
    room.status,
    room.cycle_start_date,
    room.target_cycle_days,
    varieties,
  );
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
      <li className="bf-glass rounded-2xl border border-cyan-500/20 p-5">
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
              className="rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-3 py-1.5 text-sm font-semibold text-black shadow-[0_0_16px_rgba(34,211,238,0.3)] hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50"
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
    <li className="bf-glass group rounded-2xl border border-white/5 p-5 transition duration-200 hover:border-cyan-500/20 hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/rooms/${room.id}`}
              className="text-lg font-bold text-white transition group-hover:text-cyan-200"
            >
              {room.name}
            </Link>
            <GrowRoomStatusBadge status={room.status} />
            <RecommendationStatusBadge
              severity={recommendationSummary.severity}
              compact
            />
          </div>
          <RoomRecommendationSummaryLine
            activeCount={recommendationSummary.activeItems.length}
            roomId={room.id}
            hasLog={latestLog != null}
          />
          <p className="text-sm text-zinc-400">
            {room.room_type ?? "No type"} · {room.plant_count ?? 0} plants
          </p>
          <RoomVarietyIntelligenceLine summary={varietyIntelligence} />
          <RoomTaskStatusLine summary={taskSummary} />
          <GrowRoomCycleSummary
            status={room.status}
            cycleStartDate={room.cycle_start_date}
            targetCycleDays={room.target_cycle_days}
            varieties={varieties}
            compact
          />
          {nextHarvest ? (
            <p className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-950/20 px-2 py-1 text-xs text-fuchsia-300/90">
              {nextHarvest.label}
            </p>
          ) : null}
          {nextHarvest && room.status === "Flower" ? (
            <p className="text-xs text-zinc-500">
              Est. harvest: {nextHarvest.estimatedHarvestDateLabel}
            </p>
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
