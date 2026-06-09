/** Presentation-only label formatting for Mission Control UI. */

export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatPhaseLabel(label: string): string {
  return toTitleCase(label.replace(/_/g, " "));
}

export function formatMissionDate(label: string): string {
  if (!label || label === "Not set" || label === "—") {
    return label;
  }
  return label.replace(/,/g, "").toUpperCase();
}

export function formatHarvestSpotlightDate(label: string): string {
  if (!label || label === "Not set" || label === "—") {
    return "Harvest date TBD";
  }
  const parsed = /^(\w+)\s+(\d{1,2})\s+(\d{4})$/.exec(label.replace(/,/g, "").trim());
  if (parsed) {
    return `Harvest ${parsed[1]} ${parsed[2]} ${parsed[3]}`;
  }
  return `Harvest ${toTitleCase(label.replace(/,/g, ""))}`;
}

export function formatRoomStatusLabel(status: string): string {
  return `${status.replace("-", " ").toUpperCase()} ROOM`;
}

export function formatRoomStatusTitle(status: string): string {
  return `${toTitleCase(status.replace("-", " "))} Room`;
}

export function formatHarvestCountdownLine(days: number): string {
  return `NEXT HARVEST IN ${days} DAYS`;
}

/** Preserve cultivar casing when the name already looks user-entered. */
export function formatCultivarDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.includes("#") || /[a-z]/.test(trimmed)) {
    return trimmed;
  }
  return toTitleCase(trimmed);
}

export function formatNextHarvestOverviewLine(
  roomName: string,
  cultivarName: string,
  daysRemaining: number,
): string {
  return `${toTitleCase(roomName)} — ${formatCultivarDisplayName(cultivarName)} — Harvest in ${daysRemaining} days`;
}

export function formatOverviewCycleDayLine(
  currentDay: number | null,
  status: string,
): string | null {
  if (currentDay == null) {
    return null;
  }
  return `Day ${currentDay} ${toTitleCase(status.replace("-", " "))}`;
}

export function formatHarvestInDaysLine(daysRemaining: number): string {
  return `Harvest in ${Math.max(daysRemaining, 0)} days`;
}
