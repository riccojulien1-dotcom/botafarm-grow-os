import {
  DEFAULT_GROW_ROOM_STATUS,
  isGrowRoomStatus,
  type GrowRoomStatus,
} from "@/lib/grow-rooms/constants";

export type GrowRoomFormPayload = {
  name: string;
  status: GrowRoomStatus;
  room_type: string | null;
  dimensions: string | null;
  lighting: string | null;
  substrate: string | null;
  genetics: string | null;
  irrigation: string | null;
  plant_count: number | null;
  notes: string | null;
};

export function parseGrowRoomFormData(
  formData: FormData,
): { ok: true; payload: GrowRoomFormPayload } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? DEFAULT_GROW_ROOM_STATUS).trim();

  if (!name) {
    return { ok: false, error: "Grow room name is required." };
  }

  if (!isGrowRoomStatus(statusRaw)) {
    return { ok: false, error: "Please select a valid room status." };
  }

  const plantCountRaw = formData.get("plant_count");
  const plantCount =
    typeof plantCountRaw === "string" && plantCountRaw.length > 0
      ? Number(plantCountRaw)
      : null;

  return {
    ok: true,
    payload: {
      name,
      status: statusRaw,
      room_type: String(formData.get("room_type") ?? "").trim() || null,
      dimensions: String(formData.get("dimensions") ?? "").trim() || null,
      lighting: String(formData.get("lighting") ?? "").trim() || null,
      substrate: String(formData.get("substrate") ?? "").trim() || null,
      genetics: String(formData.get("genetics") ?? "").trim() || null,
      irrigation: String(formData.get("irrigation") ?? "").trim() || null,
      plant_count: Number.isNaN(plantCount) ? null : plantCount,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  };
}
