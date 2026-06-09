"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteGrowRoomAction,
  updateGrowRoomAction,
} from "@/app/dashboard/grow-rooms/actions";
import { BfRoomStarMetrics } from "@/components/botafarm/bf-room-star-metrics";
import { RoomRecommendationSummaryLine } from "@/components/recommendations/room-recommendation-summary-line";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import {
  getCropCycleEngine,
  getCultivationPhaseLabel,
  getCurrentCycleDay,
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
import {
  formatGeneticsCross,
  pickPrimaryVariety,
  toGeneticsLine,
} from "@/lib/ui/genetics-display";

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

function resolveActionLabel(
  severity: ReturnType<typeof getRecommendationSummary>["severity"],
  overdueCount: number,
): string | null {
  if (overdueCount > 0) return "ACTION REQUIRED";
  if (severity === "action") return "ACTION REQUIRED";
  if (severity === "watch") return "MONITOR";
  return null;
}

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
  const currentDay = getCurrentCycleDay(room.cycle_start_date);
  const cycle = getCropCycleEngine(room.status, room.cycle_start_date, room.target_cycle_days, {
    varieties,
  });
  const daysLeft =
    nextHarvest?.daysRemaining ?? cycle.daysRemaining ?? null;
  const harvestDate =
    nextHarvest?.estimatedHarvestDateLabel ?? cycle.estimatedHarvestDateLabel;
  const actionLabel = resolveActionLabel(
    recommendationSummary.severity,
    taskSummary?.overdueCount ?? 0,
  );
  const primaryVariety = pickPrimaryVariety(roomVarieties, nextHarvest?.varietyName ?? null);
  const roomGenetics = formatGeneticsCross(room.genetics);
  const geneticsLine = primaryVariety
    ? toGeneticsLine(primaryVariety)
    : roomGenetics
      ? { cultivarName: roomGenetics, genetics: null }
      : null;
  const phaseLabel = getCultivationPhaseLabel(
    room.status,
    currentDay,
    room.target_cycle_days,
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
      <li className="bf-glass bf-glass-shine rounded-2xl border border-cyan-500/25 p-5">
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
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm transition hover:border-zinc-500 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="bf-glass bf-glass-shine bf-interactive overflow-hidden rounded-2xl border border-white/[0.07]">
      <Link href={`/rooms/${room.id}`} className="block p-5 sm:p-6">
        <div className="mb-4 flex justify-end">
          <RecommendationStatusBadge
            severity={recommendationSummary.severity}
            compact
          />
        </div>

        <BfRoomStarMetrics
          status={room.status}
          roomName={room.name}
          cultivarName={geneticsLine?.cultivarName ?? null}
          genetics={geneticsLine?.genetics ?? null}
          varietyCount={roomVarieties.length}
          currentDay={currentDay}
          targetCycleDays={room.target_cycle_days}
          daysLeft={daysLeft}
          plantCount={room.plant_count ?? 0}
          harvestDate={harvestDate}
          phaseLabel={phaseLabel}
          progressPercent={cycle.progressPercent}
          actionLabel={actionLabel}
          compact
        />

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.05] pt-4">
          <GrowRoomStatusBadge status={room.status} />
          <span className="text-xs text-zinc-500">{room.room_type ?? "No type"}</span>
        </div>

        <div className="mt-4 space-y-2">
          <RoomRecommendationSummaryLine
            activeCount={recommendationSummary.activeItems.length}
            roomId={room.id}
            hasLog={latestLog != null}
          />
          <RoomVarietyIntelligenceLine summary={varietyIntelligence} />
          <RoomTaskStatusLine summary={taskSummary} />
        </div>
      </Link>

      <div className="flex justify-end gap-2 border-t border-white/[0.05] px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={startEditing}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm transition hover:border-fuchsia-500/50 hover:text-fuchsia-300"
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
            className="rounded-md border border-red-900/60 px-3 py-1.5 text-sm text-red-300 transition hover:border-red-500 disabled:opacity-60"
          >
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>

      {updateState?.success ? (
        <p className="px-5 pb-3 text-sm text-green-400 sm:px-6">{updateState.success}</p>
      ) : null}
      {updateState?.error ? (
        <p className="px-5 pb-3 text-sm text-red-400 sm:px-6" role="alert">
          {updateState.error}
        </p>
      ) : null}
      {deleteState?.error ? (
        <p className="px-5 pb-3 text-sm text-red-400 sm:px-6" role="alert">
          {deleteState.error}
        </p>
      ) : null}
    </li>
  );
}
