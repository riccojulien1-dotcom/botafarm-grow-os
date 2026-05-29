export type CropCycleMetrics = {
  cycleStartLabel: string;
  currentDayLabel: string;
  daysRemainingLabel: string;
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

export function getCropCycleMetrics(
  cycleStartDate: string | null,
  targetCycleDays: number | null,
  today: Date = new Date(),
): CropCycleMetrics {
  const cycleStartLabel = formatCycleStartDate(cycleStartDate);

  if (!cycleStartDate) {
    return {
      cycleStartLabel,
      currentDayLabel: "Not set",
      daysRemainingLabel: targetCycleDays == null ? "Not set" : "Not set",
    };
  }

  const start = parseIsoDateOnly(cycleStartDate);
  if (!start) {
    return {
      cycleStartLabel,
      currentDayLabel: "Not set",
      daysRemainingLabel: targetCycleDays == null ? "Not set" : "Not set",
    };
  }

  const dayOffset = Math.floor(
    (startOfLocalDay(today).getTime() - start.getTime()) / 86_400_000,
  );
  const currentDay = dayOffset + 1;

  return {
    cycleStartLabel,
    currentDayLabel: String(currentDay),
    daysRemainingLabel:
      targetCycleDays == null ? "Not set" : String(targetCycleDays - currentDay),
  };
}
