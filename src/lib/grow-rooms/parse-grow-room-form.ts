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
  cycle_start_date: string | null;
  target_cycle_days: number | null;
};

export type ParseGrowRoomErrorKey =
  | "nameRequired"
  | "invalidStatus"
  | "invalidCycleDate"
  | "invalidTargetDays";

export function parseGrowRoomFormData(
  formData: FormData,
): { ok: true; payload: GrowRoomFormPayload } | { ok: false; errorKey: ParseGrowRoomErrorKey } {
  const name = String(formData.get("name") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? DEFAULT_GROW_ROOM_STATUS).trim();

  if (!name) {
    return { ok: false, errorKey: "nameRequired" };
  }

  if (!isGrowRoomStatus(statusRaw)) {
    return { ok: false, errorKey: "invalidStatus" };
  }

  const plantCountRaw = formData.get("plant_count");
  const plantCount =
    typeof plantCountRaw === "string" && plantCountRaw.length > 0
      ? Number(plantCountRaw)
      : null;

  const cycleStartRaw = String(formData.get("cycle_start_date") ?? "").trim();
  const cycle_start_date = cycleStartRaw || null;

  if (cycle_start_date && !/^\d{4}-\d{2}-\d{2}$/.test(cycle_start_date)) {
    return { ok: false, errorKey: "invalidCycleDate" };
  }

  const targetDaysRaw = formData.get("target_cycle_days");
  const target_cycle_days =
    typeof targetDaysRaw === "string" && targetDaysRaw.length > 0
      ? Number(targetDaysRaw)
      : null;

  if (
    target_cycle_days != null &&
    (!Number.isInteger(target_cycle_days) || target_cycle_days <= 0)
  ) {
    return { ok: false, errorKey: "invalidTargetDays" };
  }

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
      cycle_start_date,
      target_cycle_days: Number.isNaN(target_cycle_days) ? null : target_cycle_days,
    },
  };
}
