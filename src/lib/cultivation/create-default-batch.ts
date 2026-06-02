import { mapRoomStatusToBatchStatus } from "@/lib/cultivation/compute-batch";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

type GrowRoomForBatch = {
  status: string;
  cycle_start_date: string | null;
};

export function buildDefaultBatchPayload(
  userId: string,
  varietyId: string,
  variety: Pick<RoomVarietyRecord, "plant_count" | "harvest_window_end_days" | "flowering_duration_days">,
  room: GrowRoomForBatch,
) {
  const now = new Date().toISOString();
  const flowerStart =
    room.status === "Flower" && room.cycle_start_date ? room.cycle_start_date : null;

  let harvestEstimate: string | null = null;
  if (flowerStart) {
    const duration =
      variety.harvest_window_end_days ?? variety.flowering_duration_days ?? null;
    if (duration != null && duration > 0) {
      const harvest = new Date(flowerStart);
      harvest.setDate(harvest.getDate() + duration - 1);
      harvestEstimate = harvest.toISOString().slice(0, 10);
    }
  }

  return {
    user_id: userId,
    variety_id: varietyId,
    plant_count: variety.plant_count ?? 0,
    start_date: room.cycle_start_date,
    flower_start_date: flowerStart,
    harvest_estimate: harvestEstimate,
    status: mapRoomStatusToBatchStatus(room.status),
    notes: null,
    updated_at: now,
  };
}
