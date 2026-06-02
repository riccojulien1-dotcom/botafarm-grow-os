import type { CultivarBatchComputed, CultivarBatchRecord } from "@/lib/cultivation/types";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

function parseIsoDateOnly(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysBetween(start: Date, end: Date): number {
  return Math.floor(
    (startOfLocalDay(end).getTime() - startOfLocalDay(start).getTime()) / 86_400_000,
  );
}

function resolveFlowerDurationDays(
  variety: RoomVarietyRecord,
  roomTargetCycleDays: number | null,
): number | null {
  return (
    variety.harvest_window_end_days ??
    variety.flowering_duration_days ??
    roomTargetCycleDays
  );
}

export function computeBatchMetrics(
  batch: CultivarBatchRecord,
  variety: RoomVarietyRecord,
  room: {
    cycle_start_date: string | null;
    target_cycle_days: number | null;
    status: string;
  },
  today: Date = new Date(),
): CultivarBatchComputed {
  const flowerStart = batch.flower_start_date ?? room.cycle_start_date;
  const flowerStartDate = flowerStart ? parseIsoDateOnly(flowerStart) : null;

  let currentDay: number | null = null;
  if (flowerStartDate) {
    currentDay = daysBetween(flowerStartDate, today) + 1;
  }

  let harvestDate: Date | null = null;
  if (batch.harvest_estimate) {
    harvestDate = parseIsoDateOnly(batch.harvest_estimate);
  } else if (flowerStartDate) {
    const duration = resolveFlowerDurationDays(variety, room.target_cycle_days);
    if (duration != null && duration > 0) {
      harvestDate = new Date(flowerStartDate);
      harvestDate.setDate(harvestDate.getDate() + duration - 1);
    }
  }

  let daysRemaining: number | null = null;
  if (harvestDate) {
    daysRemaining = daysBetween(today, harvestDate);
  }

  const daysRemainingLabel =
    daysRemaining == null
      ? "Harvest not set"
      : daysRemaining > 0
        ? `${daysRemaining} days remaining`
        : daysRemaining === 0
          ? "Harvest today"
          : `${Math.abs(daysRemaining)} days past window`;

  return {
    currentDay,
    currentDayLabel: currentDay != null ? `Day ${currentDay}` : "Day —",
    harvestEstimateLabel: harvestDate ? formatDisplayDate(harvestDate) : "Not set",
    daysRemaining,
    daysRemainingLabel,
  };
}

export function mapRoomStatusToBatchStatus(roomStatus: string) {
  const normalized = roomStatus.toLowerCase();
  if (normalized === "clone") return "clone" as const;
  if (normalized === "mother" || normalized === "vegetative") return "vegetative" as const;
  if (normalized === "pre-flower") return "preflower" as const;
  if (normalized === "flower") return "flower" as const;
  if (normalized === "drying") return "harvest" as const;
  if (normalized === "cure") return "completed" as const;
  return "flower" as const;
}
