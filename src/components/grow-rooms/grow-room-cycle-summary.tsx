import type { ReactNode } from "react";

import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { getCropCycleMetrics } from "@/lib/grow-rooms/crop-cycle";

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
  const metrics = getCropCycleMetrics(cycleStartDate, targetCycleDays);

  if (compact) {
    return (
      <div className="mt-3 grid gap-2 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs sm:grid-cols-2">
        <CycleMetric label="Status" value={<GrowRoomStatusBadge status={status} />} />
        <CycleMetric label="Cycle start" value={metrics.cycleStartLabel} />
        <CycleMetric label="Current day" value={metrics.currentDayLabel} />
        <CycleMetric label="Days remaining" value={metrics.daysRemainingLabel} />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CycleMetric label="Current status" value={<GrowRoomStatusBadge status={status} />} />
      <CycleMetric label="Cycle start date" value={metrics.cycleStartLabel} />
      <CycleMetric label="Current day" value={metrics.currentDayLabel} />
      <CycleMetric label="Days remaining" value={metrics.daysRemainingLabel} />
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
