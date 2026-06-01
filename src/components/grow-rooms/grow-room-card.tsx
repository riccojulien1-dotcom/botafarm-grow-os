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
  const phaseLabel = getCultivationPhaseLabel(
    room.status,
    currentDay,
    room.target_cycle_days,
  );
  const daysLeft =
    nextHarvest?.daysRemaining ?? cycle.daysRemaining ?? null;
  const harvestDate =
    nextHarvest?.estimatedHarvestDateLabel ?? cycle.estimatedHarvestDateLabel;
  const actionLabel = resolveActionLabel(
    recommendationSummary.severity,
    taskSummary?.overdueCount ?? 0,
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
    <li className="bf-glass group overflow-hidden rounded-2xl border border-white/5 transition duration-200 hover:border-cyan-500/25 hover:shadow-[0_0_32px_rgba(34,211,238,0.1)]">
      <Link href={`/rooms/${room.id}`} className="block p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-2xl font-bold uppercase tracking-tight text-white transition group-hover:text-cyan-200">
            {room.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {actionLabel ? (
              <span className="rounded-md border border-red-500/40 bg-red-950/50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-red-200">
                {actionLabel}
              </span>
            ) : null}
            <RecommendationStatusBadge
              severity={recommendationSummary.severity}
              compact
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/[0.06] py-5 sm:grid-cols-3 lg:grid-cols-5">
          <CardStat
            label="Current day"
            value={currentDay != null ? `DAY ${currentDay}` : "—"}
          />
          <CardStat label="Plants" value={String(room.plant_count ?? 0)} />
          <CardStat label="Phase" value={phaseLabel} accent="cyan" />
          <CardStat
            label="Days left"
            value={daysLeft != null ? String(Math.max(daysLeft, 0)) : "—"}
            accent="magenta"
          />
          <CardStat
            label="Next harvest"
            value={harvestDate !== "Not set" ? harvestDate : "—"}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <GrowRoomStatusBadge status={room.status} />
          <span className="text-xs text-zinc-500">{room.room_type ?? "No type"}</span>
        </div>

        <div className="mt-4 space-y-2 border-t border-white/[0.04] pt-4">
          <RoomRecommendationSummaryLine
            activeCount={recommendationSummary.activeItems.length}
            roomId={room.id}
            hasLog={latestLog != null}
          />
          <RoomVarietyIntelligenceLine summary={varietyIntelligence} />
          <RoomTaskStatusLine summary={taskSummary} />
        </div>
      </Link>

      <div className="flex justify-end gap-2 border-t border-white/[0.04] px-5 py-3 sm:px-6">
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

function CardStat({
  label,
  value,
  accent,
  className = "",
}: {
  label: string;
  value: string;
  accent?: "cyan" | "magenta";
  className?: string;
}) {
  const valueColor =
    accent === "cyan"
      ? "text-cyan-300"
      : accent === "magenta"
        ? "text-fuchsia-300"
        : "text-white";

  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">{label}</p>
      <p className={`mt-1 text-sm font-bold uppercase tracking-wide sm:text-base ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}
