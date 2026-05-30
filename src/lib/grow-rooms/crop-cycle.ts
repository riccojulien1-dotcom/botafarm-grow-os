import type { GrowRoomStatus } from "@/lib/grow-rooms/constants";
import { isGrowRoomStatus } from "@/lib/grow-rooms/constants";

const PHASE_SHORT_LABELS: Record<GrowRoomStatus, string> = {
  Clone: "Clone",
  Mother: "Mother",
  Vegetative: "Veg",
  "Pre-Flower": "Pre-Flower",
  Flower: "Flower",
  Drying: "Drying",
  Cure: "Cure",
};

export type CropCycleEngine = {
  cycleStartLabel: string;
  currentDay: number | null;
  currentDayLabel: string;
  targetCycleDaysLabel: string;
  daysRemaining: number | null;
  daysRemainingLabel: string;
  estimatedHarvestDateLabel: string;
  phaseDayLabel: string;
  harvestInDaysLabel: string | null;
  harvestAlert: string | null;
  progressPercent: number | null;
};

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

function addCalendarDays(start: Date, days: number): Date {
  const result = new Date(start);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatCycleStartDate(cycleStartDate: string | null): string {
  if (!cycleStartDate) {
    return "Not set";
  }

  const parsed = parseIsoDateOnly(cycleStartDate);
  if (!parsed) {
    return cycleStartDate;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getPhaseShortLabel(status: string): string {
  if (isGrowRoomStatus(status)) {
    return PHASE_SHORT_LABELS[status];
  }
  return status;
}

function getEstimatedHarvestDate(
  cycleStartDate: string,
  targetCycleDays: number,
): Date | null {
  const start = parseIsoDateOnly(cycleStartDate);
  if (!start || targetCycleDays <= 0) {
    return null;
  }

  // Last cycle day (day N) = start + (N - 1); aligns with days remaining = target - current day.
  return addCalendarDays(start, targetCycleDays - 1);
}

export function getCropCycleEngine(
  status: string,
  cycleStartDate: string | null,
  targetCycleDays: number | null,
  today: Date = new Date(),
): CropCycleEngine {
  const cycleStartLabel = formatCycleStartDate(cycleStartDate);
  const targetCycleDaysLabel =
    targetCycleDays == null ? "Not set" : String(targetCycleDays);

  let currentDay: number | null = null;
  let daysRemaining: number | null = null;
  let estimatedHarvestDateLabel = "Not set";
  let phaseDayLabel = "Not set";
  let harvestInDaysLabel: string | null = null;
  let harvestAlert: string | null = null;
  let progressPercent: number | null = null;

  if (cycleStartDate) {
    const start = parseIsoDateOnly(cycleStartDate);
    if (start) {
      const dayOffset = Math.floor(
        (startOfLocalDay(today).getTime() - start.getTime()) / 86_400_000,
      );
      currentDay = dayOffset + 1;
      phaseDayLabel = `Day ${currentDay} ${getPhaseShortLabel(status)}`;

      if (targetCycleDays != null) {
        daysRemaining = targetCycleDays - currentDay;
        progressPercent = Math.min(
          100,
          Math.max(0, Math.round((currentDay / targetCycleDays) * 100)),
        );

        const harvestDate = getEstimatedHarvestDate(cycleStartDate, targetCycleDays);
        if (harvestDate) {
          estimatedHarvestDateLabel = formatDisplayDate(harvestDate);
        }
      }
    }
  }

  const currentDayLabel = currentDay == null ? "Not set" : String(currentDay);
  const daysRemainingLabel =
    daysRemaining == null ? "Not set" : String(daysRemaining);

  if (status === "Flower" && targetCycleDays != null && daysRemaining != null) {
    if (daysRemaining > 0) {
      harvestInDaysLabel = `Harvest in ${daysRemaining} days`;
    } else if (daysRemaining === 0) {
      harvestInDaysLabel = "Harvest today";
    } else {
      harvestInDaysLabel = `Harvest window passed (${Math.abs(daysRemaining)} days ago)`;
    }

    if (daysRemaining >= 0 && daysRemaining <= 7) {
      harvestAlert = "Harvest window approaching";
    }
  }

  return {
    cycleStartLabel,
    currentDay,
    currentDayLabel,
    targetCycleDaysLabel,
    daysRemaining,
    daysRemainingLabel,
    estimatedHarvestDateLabel,
    phaseDayLabel,
    harvestInDaysLabel,
    harvestAlert,
    progressPercent,
  };
}

/** @deprecated Use getCropCycleEngine — kept for minimal call sites during migration */
export type CropCycleMetrics = {
  cycleStartLabel: string;
  currentDayLabel: string;
  daysRemainingLabel: string;
};

export function getCropCycleMetrics(
  cycleStartDate: string | null,
  targetCycleDays: number | null,
  today?: Date,
): CropCycleMetrics {
  const engine = getCropCycleEngine("Vegetative", cycleStartDate, targetCycleDays, today);
  return {
    cycleStartLabel: engine.cycleStartLabel,
    currentDayLabel: engine.currentDayLabel,
    daysRemainingLabel: engine.daysRemainingLabel,
  };
}
