/** Presentation-only label formatting for Mission Control UI. */

export function formatMissionDate(label: string): string {
  if (!label || label === "Not set" || label === "—") {
    return label;
  }
  return label.replace(/,/g, "").toUpperCase();
}

export function formatRoomStatusLabel(status: string): string {
  return `${status.replace("-", " ").toUpperCase()} ROOM`;
}

export function formatHarvestCountdownLine(days: number): string {
  return `NEXT HARVEST IN ${days} DAYS`;
}
