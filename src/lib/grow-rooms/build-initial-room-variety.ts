import type { GrowRoomFormPayload } from "@/lib/grow-rooms/parse-grow-room-form";
import type { VarietyFormPayload } from "@/lib/varieties/parse-variety-form";

const GENETICS_CROSS_PATTERN = /\s+[x×X]\s+/;

export function isGeneticsCross(genetics: string): boolean {
  return GENETICS_CROSS_PATTERN.test(genetics.trim());
}

/** First tracked cultivar from grow room genetics + plant count at creation time. */
export function buildInitialRoomVarietyFromGrowRoom(
  room: GrowRoomFormPayload,
): VarietyFormPayload | null {
  const genetics = room.genetics?.trim();
  if (!genetics) {
    return null;
  }

  const lineage = isGeneticsCross(genetics) ? genetics : null;

  return {
    name: genetics,
    genetics: null,
    lineage,
    breeder: null,
    plant_count: room.plant_count ?? 0,
    variety_type: "Hybrid",
    flowering_duration_days: room.target_cycle_days,
    harvest_window_start_days: null,
    harvest_window_end_days: null,
    stretch: "medium",
    ec_sensitivity: "medium",
    irrigation_sensitivity: "medium",
    phenotype_notes: null,
    notes: null,
    preset_slug: null,
  };
}
