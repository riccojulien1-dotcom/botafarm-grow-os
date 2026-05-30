import type { ReactNode } from "react";

import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { getCropCycleEngine } from "@/lib/grow-rooms/crop-cycle";

type GrowRoomCycleSummaryProps = {
  status: string;
  cycleStartDate: string | null;
  targetCycleDays: number | null;
  compact?: boolean;
};

export function GrowRoomCycleSummary({
  status,
  cycleStartDate,
  targetCycleDays,
  compact = false,
}: GrowRoomCycleSummaryProps) {
  const cycle = getCropCycleEngine(status, cycleStartDate, targetCycleDays);

  if (compact) {
    return (
      <div className="mt-3 space-y-2 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <GrowRoomStatusBadge status={status} />
          <span className="font-medium text-fuchsia-200">{cycle.phaseDayLabel}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <CycleMetric label="Current day" value={cycle.currentDayLabel} />
          <CycleMetric label="Days remaining" value={cycle.daysRemainingLabel} />
          <CycleMetric label="Est. harvest" value={cycle.estimatedHarvestDateLabel} />
          {cycle.harvestInDaysLabel ? (
            <CycleMetric label="Flower countdown" value={cycle.harvestInDaysLabel} />
          ) : null}
        </div>
        {cycle.harvestAlert ? (
          <p className="rounded-md border border-amber-900/50 bg-amber-950/40 px-2 py-1.5 text-amber-200">
            {cycle.harvestAlert}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-fuchsia-200">{cycle.phaseDayLabel}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <CycleMetric label="Current status" value={<GrowRoomStatusBadge status={status} />} />
        <CycleMetric label="Cycle start date" value={cycle.cycleStartLabel} />
        <CycleMetric label="Current day" value={cycle.currentDayLabel} />
        <CycleMetric label="Target cycle days" value={cycle.targetCycleDaysLabel} />
        <CycleMetric label="Days remaining" value={cycle.daysRemainingLabel} />
        <CycleMetric label="Estimated harvest date" value={cycle.estimatedHarvestDateLabel} />
      </div>
      {cycle.harvestInDaysLabel ? (
        <p className="text-sm text-zinc-300">{cycle.harvestInDaysLabel}</p>
      ) : null}
      {cycle.harvestAlert ? (
        <p className="rounded-md border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
          {cycle.harvestAlert}
        </p>
      ) : null}
    </div>
  );
}

function CycleMetric({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <div className="mt-1 text-sm text-zinc-100">{value}</div>
    </div>
  );
}
