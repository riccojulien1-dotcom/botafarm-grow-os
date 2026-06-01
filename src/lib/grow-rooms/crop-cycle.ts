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

export type VarietyForHarvest = {
  id: string;
  name: string;
  genetics: string | null;
  plant_count: number | null;
  flowering_duration_days: number | null;
  harvest_window_start_days?: number | null;
  harvest_window_end_days?: number | null;
};

export type VarietyHarvestTimeline = {
  varietyId: string;
  name: string;
  genetics: string | null;
  plantCount: number | null;
  currentFlowerDay: number;
  floweringDurationLabel: string;
  harvestWindowLabel: string | null;
  phaseDayLabel: string;
  daysRemaining: number | null;
  daysRemainingStart: number | null;
  daysRemainingEnd: number | null;
  daysRemainingLabel: string;
  estimatedHarvestDateLabel: string;
  estimatedHarvestDateStartLabel: string;
  estimatedHarvestDateEndLabel: string;
  harvestInDaysLabel: string | null;
  harvestAlert: string | null;
};

export type NextHarvestPreview = {
  varietyName: string;
  daysRemaining: number;
  estimatedHarvestDateLabel: string;
  label: string;
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
  showHarvestMetrics: boolean;
  showDaysRemaining: boolean;
  phaseStatusMessage: string | null;
  progressLabel: string | null;
  useVarietyHarvestTimeline: boolean;
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

/** Display label for command center / room cards (e.g. MID FLOWER). */
export function getCultivationPhaseLabel(
  status: string,
  currentDay: number | null,
  targetCycleDays: number | null,
): string {
  if (status === "Flower" && currentDay != null && targetCycleDays != null && targetCycleDays > 0) {
    const ratio = currentDay / targetCycleDays;
    if (ratio < 0.33) return "EARLY FLOWER";
    if (ratio < 0.66) return "MID FLOWER";
    return "LATE FLOWER";
  }

  if (isGrowRoomStatus(status)) {
    return status.replace("-", " ").toUpperCase();
  }

  return status.toUpperCase();
}

export function getCurrentCycleDay(
  cycleStartDate: string | null,
  today: Date = new Date(),
): number | null {
  if (!cycleStartDate) {
    return null;
  }

  const start = parseIsoDateOnly(cycleStartDate);
  if (!start) {
    return null;
  }

  const dayOffset = Math.floor(
    (startOfLocalDay(today).getTime() - start.getTime()) / 86_400_000,
  );
  return dayOffset + 1;
}

export function getEstimatedHarvestDateFromCycle(
  cycleStartDate: string,
  durationDays: number,
): Date | null {
  const start = parseIsoDateOnly(cycleStartDate);
  if (!start || durationDays <= 0) {
    return null;
  }

  return addCalendarDays(start, durationDays - 1);
}

function getEstimatedHarvestDate(
  cycleStartDate: string,
  durationDays: number,
): Date | null {
  return getEstimatedHarvestDateFromCycle(cycleStartDate, durationDays);
}

function varietyHasHarvestTiming(variety: VarietyForHarvest): boolean {
  return (
    variety.flowering_duration_days != null ||
    variety.harvest_window_start_days != null ||
    variety.harvest_window_end_days != null
  );
}

function resolveHarvestDayRange(variety: VarietyForHarvest): {
  startDays: number | null;
  endDays: number | null;
} {
  const startDays =
    variety.harvest_window_start_days ?? variety.flowering_duration_days ?? null;
  const endDays =
    variety.harvest_window_end_days ??
    variety.flowering_duration_days ??
    startDays;

  return { startDays, endDays };
}

function buildHarvestCountdown(daysRemaining: number): {
  harvestInDaysLabel: string;
  harvestAlert: string | null;
} {
  if (daysRemaining > 0) {
    return {
      harvestInDaysLabel: `Harvest in ${daysRemaining} days`,
      harvestAlert: daysRemaining <= 7 ? "Harvest window approaching" : null,
    };
  }

  if (daysRemaining === 0) {
    return {
      harvestInDaysLabel: "Harvest today",
      harvestAlert: "Harvest window approaching",
    };
  }

  return {
    harvestInDaysLabel: `Harvest window passed (${Math.abs(daysRemaining)} days ago)`,
    harvestAlert: null,
  };
}

export function getVarietyHarvestTimelines(
  varieties: VarietyForHarvest[],
  cycleStartDate: string | null,
  today: Date = new Date(),
): VarietyHarvestTimeline[] {
  const currentDay = getCurrentCycleDay(cycleStartDate, today);
  if (!cycleStartDate || currentDay == null) {
    return [];
  }

  return varieties.filter(varietyHasHarvestTiming).map((variety) => {
    const { startDays, endDays } = resolveHarvestDayRange(variety);
    const daysRemainingStart =
      startDays != null ? startDays - currentDay : null;
    const daysRemainingEnd = endDays != null ? endDays - currentDay : null;
    const daysRemaining = daysRemainingStart;

    const harvestDateStart =
      startDays != null ? getEstimatedHarvestDate(cycleStartDate, startDays) : null;
    const harvestDateEnd =
      endDays != null ? getEstimatedHarvestDate(cycleStartDate, endDays) : null;

    const countdown = buildHarvestCountdown(
      daysRemainingStart ?? daysRemainingEnd ?? 0,
    );

    const floweringDurationLabel =
      startDays != null && endDays != null && startDays !== endDays
        ? `Window day ${startDays}–${endDays}`
        : startDays != null
          ? `${startDays} days`
          : endDays != null
            ? `${endDays} days`
            : "Not set";

    const harvestWindowLabel =
      variety.harvest_window_start_days != null &&
      variety.harvest_window_end_days != null
        ? `Harvest window: day ${variety.harvest_window_start_days}–${variety.harvest_window_end_days}`
        : null;

    const daysRemainingLabel =
      daysRemainingStart != null && daysRemainingEnd != null && daysRemainingStart !== daysRemainingEnd
        ? `${daysRemainingStart} – ${daysRemainingEnd}`
        : daysRemainingStart != null
          ? String(daysRemainingStart)
          : daysRemainingEnd != null
            ? String(daysRemainingEnd)
            : "Not set";

    const estimatedHarvestDateStartLabel = harvestDateStart
      ? formatDisplayDate(harvestDateStart)
      : "Not set";
    const estimatedHarvestDateEndLabel = harvestDateEnd
      ? formatDisplayDate(harvestDateEnd)
      : "Not set";

    return {
      varietyId: variety.id,
      name: variety.name,
      genetics: variety.genetics,
      plantCount: variety.plant_count,
      currentFlowerDay: currentDay,
      floweringDurationLabel,
      harvestWindowLabel,
      phaseDayLabel: `Day ${currentDay} Flower`,
      daysRemaining,
      daysRemainingStart,
      daysRemainingEnd,
      daysRemainingLabel,
      estimatedHarvestDateLabel: estimatedHarvestDateStartLabel,
      estimatedHarvestDateStartLabel,
      estimatedHarvestDateEndLabel,
      harvestInDaysLabel: countdown.harvestInDaysLabel,
      harvestAlert: countdown.harvestAlert,
    };
  });
}

export function getNextHarvestPreview(
  status: string,
  cycleStartDate: string | null,
  targetCycleDays: number | null,
  varieties: VarietyForHarvest[],
  today: Date = new Date(),
): NextHarvestPreview | null {
  if (status !== "Flower" || !cycleStartDate) {
    return null;
  }

  const varietiesWithTiming = varieties.filter(varietyHasHarvestTiming);
  const timelines =
    varietiesWithTiming.length > 0
      ? getVarietyHarvestTimelines(varietiesWithTiming, cycleStartDate, today)
      : [];

  if (timelines.length > 0) {
    const upcoming = timelines
      .filter(
        (entry) =>
          (entry.daysRemainingStart != null && entry.daysRemainingStart >= 0) ||
          (entry.daysRemainingEnd != null && entry.daysRemainingEnd >= 0),
      )
      .sort(
        (left, right) =>
          (left.daysRemainingStart ?? left.daysRemainingEnd ?? 0) -
          (right.daysRemainingStart ?? right.daysRemainingEnd ?? 0),
      );

    const next = upcoming[0] ?? timelines[0];
    if (!next) {
      return null;
    }

    const daysRemaining = next.daysRemainingStart ?? next.daysRemainingEnd ?? 0;

    return {
      varietyName: next.name,
      daysRemaining,
      estimatedHarvestDateLabel: next.estimatedHarvestDateStartLabel,
      label: `Next harvest: ${next.name} in ${Math.max(daysRemaining, 0)} days`,
    };
  }

  const currentDay = getCurrentCycleDay(cycleStartDate, today);
  if (currentDay == null || targetCycleDays == null) {
    return null;
  }

  const daysRemaining = targetCycleDays - currentDay;
  const harvestDate = getEstimatedHarvestDate(cycleStartDate, targetCycleDays);

  return {
    varietyName: "Room cycle",
    daysRemaining,
    estimatedHarvestDateLabel: harvestDate ? formatDisplayDate(harvestDate) : "Not set",
    label: `Next harvest: Room cycle in ${Math.max(daysRemaining, 0)} days`,
  };
}

export function getCropCycleEngine(
  status: string,
  cycleStartDate: string | null,
  targetCycleDays: number | null,
  options?: {
    varieties?: VarietyForHarvest[];
    today?: Date;
  },
): CropCycleEngine {
  const today = options?.today ?? new Date();
  const varieties = options?.varieties ?? [];
  const isPostHarvest = status === "Drying" || status === "Cure";
  const isFlower = status === "Flower";
  const varietiesWithTiming = varieties.filter(varietyHasHarvestTiming);
  const hasVarietyTimelines = isFlower && varietiesWithTiming.length > 0;

  const cycleStartLabel = formatCycleStartDate(cycleStartDate);
  const targetCycleDaysLabel =
    targetCycleDays == null ? "Not set" : String(targetCycleDays);

  const currentDay = getCurrentCycleDay(cycleStartDate, today);
  let daysRemaining: number | null = null;
  let estimatedHarvestDateLabel = "Not set";
  let phaseDayLabel = "Not set";
  let harvestInDaysLabel: string | null = null;
  let harvestAlert: string | null = null;
  let progressPercent: number | null = null;
  let phaseStatusMessage: string | null = null;
  let progressLabel: string | null = null;

  if (currentDay != null) {
    phaseDayLabel = `Day ${currentDay} ${getPhaseShortLabel(status)}`;

    if (targetCycleDays != null && !isPostHarvest && status !== "Cure") {
      progressPercent = Math.min(
        100,
        Math.max(0, Math.round((currentDay / targetCycleDays) * 100)),
      );
    }
  }

  if (isPostHarvest) {
    if (status === "Drying") {
      progressLabel = targetCycleDays != null ? "Drying progress" : null;
      phaseStatusMessage =
        targetCycleDays == null ? "Drying phase active" : null;
      if (targetCycleDays == null) {
        progressPercent = null;
      }
    } else {
      phaseStatusMessage = "Curing phase active";
      progressPercent = null;
      progressLabel = null;
    }
  } else if (isFlower && !hasVarietyTimelines && targetCycleDays != null && currentDay != null) {
    daysRemaining = targetCycleDays - currentDay;
    const harvestDate = getEstimatedHarvestDate(cycleStartDate!, targetCycleDays);
    if (harvestDate) {
      estimatedHarvestDateLabel = formatDisplayDate(harvestDate);
    }
    const countdown = buildHarvestCountdown(daysRemaining);
    harvestInDaysLabel = countdown.harvestInDaysLabel;
    harvestAlert = countdown.harvestAlert;
  } else if (!isFlower && targetCycleDays != null && currentDay != null) {
    progressLabel = "Cycle progress";
  }

  const showHarvestMetrics = isFlower && !hasVarietyTimelines;
  const showDaysRemaining = showHarvestMetrics;

  return {
    cycleStartLabel,
    currentDay,
    currentDayLabel: currentDay == null ? "Not set" : String(currentDay),
    targetCycleDaysLabel,
    daysRemaining,
    daysRemainingLabel: daysRemaining == null ? "Not set" : String(daysRemaining),
    estimatedHarvestDateLabel,
    phaseDayLabel,
    harvestInDaysLabel,
    harvestAlert,
    progressPercent,
    showHarvestMetrics,
    showDaysRemaining,
    phaseStatusMessage,
    progressLabel,
    useVarietyHarvestTimeline: hasVarietyTimelines,
  };
}
