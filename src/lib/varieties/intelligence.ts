import {
  getEstimatedHarvestDateFromCycle,
  getVarietyHarvestTimelines,
  type VarietyForHarvest,
} from "@/lib/grow-rooms/crop-cycle";
import type { RoomVarietyIntelligenceSummary, RoomVarietyRecord } from "@/lib/varieties/types";

export function toVarietyForHarvest(variety: RoomVarietyRecord): VarietyForHarvest {
  return {
    id: variety.id,
    name: variety.name,
    genetics: variety.genetics,
    plant_count: variety.plant_count,
    flowering_duration_days: variety.flowering_duration_days,
    harvest_window_start_days: variety.harvest_window_start_days,
    harvest_window_end_days: variety.harvest_window_end_days,
  };
}

export function getRoomVarietyIntelligence(
  varieties: RoomVarietyRecord[],
  cycleStartDate: string | null,
  roomStatus: string,
  today: Date = new Date(),
): RoomVarietyIntelligenceSummary {
  const totalPlantCount = varieties.reduce(
    (sum, variety) => sum + (variety.plant_count ?? 0),
    0,
  );
  const varietyCount = varieties.length;

  if (roomStatus !== "Flower" || !cycleStartDate || !varietyCount) {
    return {
      totalPlantCount,
      varietyCount,
      nearestHarvestLabel: null,
      furthestHarvestLabel: null,
      harvestWindowSummaryLabel: null,
    };
  }

  const timelines = getVarietyHarvestTimelines(
    varieties.map(toVarietyForHarvest),
    cycleStartDate,
    today,
  );

  const withTiming = timelines.filter(
    (entry) => entry.daysRemainingStart != null || entry.daysRemainingEnd != null,
  );

  if (!withTiming.length) {
    return {
      totalPlantCount,
      varietyCount,
      nearestHarvestLabel: null,
      furthestHarvestLabel: null,
      harvestWindowSummaryLabel: "Set harvest window or flowering target per variety",
    };
  }

  const nearest = withTiming.reduce((best, entry) => {
    const days = entry.daysRemainingStart ?? entry.daysRemainingEnd ?? 9999;
    const bestDays = best.daysRemainingStart ?? best.daysRemainingEnd ?? 9999;
    return days < bestDays ? entry : best;
  });

  const furthest = withTiming.reduce((best, entry) => {
    const days = entry.daysRemainingEnd ?? entry.daysRemainingStart ?? -9999;
    const bestDays = best.daysRemainingEnd ?? best.daysRemainingStart ?? -9999;
    return days > bestDays ? entry : best;
  });

  const nearestDays = nearest.daysRemainingStart ?? nearest.daysRemainingEnd ?? 0;
  const furthestDays = furthest.daysRemainingEnd ?? furthest.daysRemainingStart ?? 0;

  const nearestDate =
    nearest.estimatedHarvestDateStartLabel !== "Not set"
      ? nearest.estimatedHarvestDateStartLabel
      : nearest.estimatedHarvestDateEndLabel;

  const furthestDate =
    furthest.estimatedHarvestDateEndLabel !== "Not set"
      ? furthest.estimatedHarvestDateEndLabel
      : furthest.estimatedHarvestDateStartLabel;

  return {
    totalPlantCount,
    varietyCount,
    nearestHarvestLabel: `${nearest.name} · ${Math.max(nearestDays, 0)} days (${nearestDate})`,
    furthestHarvestLabel: `${furthest.name} · ${Math.max(furthestDays, 0)} days (${furthestDate})`,
    harvestWindowSummaryLabel:
      nearest.name === furthest.name && nearest.harvestWindowLabel
        ? nearest.harvestWindowLabel
        : `${Math.max(nearestDays, 0)}–${Math.max(furthestDays, 0)} days across varieties`,
  };
}

export { getEstimatedHarvestDateFromCycle };
