"use client";

import Link from "next/link";
import {
  CalendarClock,
  DoorOpen,
  Leaf,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  deleteGrowRoomAction,
  updateGrowRoomAction,
} from "@/app/dashboard/grow-rooms/actions";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import { RoomRecommendationSummaryLine } from "@/components/recommendations/room-recommendation-summary-line";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import {
  getCropCycleEngine,
  getCultivationPhaseLabel,
  getCurrentCycleDay,
  getNextHarvestPreview,
  type VarietyForHarvest,
} from "@/lib/grow-rooms/crop-cycle";
import { RoomTaskStatusLine } from "@/components/tasks/room-task-status-line";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
import { translateRecommendationForGrower } from "@/lib/copilot/translate-recommendation";
import type { RecommendationLogInput } from "@/lib/recommendations/types";
import type { RoomTaskSummary } from "@/lib/tasks/task-stats";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { GrowRoomFields, type GrowRoomFieldValues } from "@/components/grow-rooms/grow-room-fields";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import {
  formatHarvestSpotlightDate,
  formatPhaseLabel,
  toTitleCase,
} from "@/lib/ui/format-mission-labels";

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
  const daysLeft = nextHarvest?.daysRemaining ?? cycle.daysRemaining ?? null;
  const harvestDate =
    nextHarvest?.estimatedHarvestDateLabel ?? cycle.estimatedHarvestDateLabel;
  const phaseLabel = getCultivationPhaseLabel(
    room.status,
    currentDay,
    room.target_cycle_days,
  );
  const primaryAlert = recommendationSummary.activeItems.find((item) => item.severity !== "good");
  const growerAlert = primaryAlert
    ? translateRecommendationForGrower(toTitleCase(room.name), primaryAlert)
    : taskSummary?.overdueCount
      ? `${toTitleCase(room.name)} — overdue task needs attention`
      : null;

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
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <DoorOpen className="h-6 w-6 text-cyan-400" aria-hidden />
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
              {toTitleCase(room.name)}
            </h3>
          </div>
          <RecommendationStatusBadge severity={recommendationSummary.severity} compact />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GrowRoomStatusBadge status={room.status} />
          {phaseLabel ? (
            <span className="rounded-lg border border-fuchsia-500/25 bg-fuchsia-950/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-200">
              {formatPhaseLabel(phaseLabel)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <MetaChip
            icon={CalendarClock}
            label="Cycle"
            value={
              currentDay != null && room.target_cycle_days
                ? `Day ${currentDay} of ${room.target_cycle_days}`
                : currentDay != null
                  ? `Day ${currentDay}`
                  : "Not set"
            }
          />
          <MetaChip
            icon={CalendarClock}
            label="Harvest"
            value={
              daysLeft != null
                ? `${Math.max(daysLeft, 0)} days`
                : harvestDate && harvestDate !== "Not set"
                  ? formatHarvestSpotlightDate(harvestDate)
                  : "—"
            }
            accent="magenta"
          />
          <MetaChip
            icon={Users}
            label="Plants"
            value={String(room.plant_count ?? 0)}
          />
        </div>

        {growerAlert ? (
          <p className="mt-4 rounded-lg border border-amber-500/25 bg-amber-950/20 px-3 py-2 text-sm text-amber-100">
            {growerAlert}
          </p>
        ) : (
          <p className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-200">
            Room stable — no urgent alerts
          </p>
        )}

        {roomVarieties.length > 0 ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Leaf className="h-3.5 w-3.5" aria-hidden />
            {roomVarieties.length} cultivar{roomVarieties.length === 1 ? "" : "s"} inside — open room to manage
          </p>
        ) : null}

        {cycle.progressPercent != null ? (
          <div className="mt-4 space-y-2 border-t border-white/[0.05] pt-4">
            <BfProgressBar value={cycle.progressPercent} accent="magenta" showValue={false} size="large" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              {Math.round(cycle.progressPercent)}% cycle complete
            </p>
          </div>
        ) : null}

        <div className="mt-4 space-y-2">
          <RoomRecommendationSummaryLine
            activeCount={recommendationSummary.activeItems.length}
            roomId={room.id}
            hasLog={latestLog != null}
          />
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

function MetaChip({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
  accent?: "magenta";
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3 w-3" aria-hidden />
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          accent === "magenta" ? "text-fuchsia-300" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
