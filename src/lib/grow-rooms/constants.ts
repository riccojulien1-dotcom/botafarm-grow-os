export const GROW_ROOM_STATUSES = [
  "Clone",
  "Mother",
  "Vegetative",
  "Pre-Flower",
  "Flower",
  "Drying",
  "Cure",
] as const;

export type GrowRoomStatus = (typeof GROW_ROOM_STATUSES)[number];

export const DEFAULT_GROW_ROOM_STATUS: GrowRoomStatus = "Vegetative";

export function isGrowRoomStatus(value: string): value is GrowRoomStatus {
  return (GROW_ROOM_STATUSES as readonly string[]).includes(value);
}
