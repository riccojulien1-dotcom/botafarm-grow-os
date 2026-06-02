import type { SensitivityLevel, VarietyType } from "@/lib/varieties/constants";

export type VarietyPreset = {
  slug: string;
  name: string;
  variety_type: VarietyType;
  flowering_duration_days: number | null;
  harvest_window_start_days: number | null;
  harvest_window_end_days: number | null;
  stretch: SensitivityLevel;
  ec_sensitivity: SensitivityLevel;
  irrigation_sensitivity: SensitivityLevel;
  genetics: string | null;
  phenotype_notes: string | null;
  notes: string | null;
};

export type RoomVarietyRecord = {
  id: string;
  name: string;
  genetics: string | null;
  lineage: string | null;
  breeder: string | null;
  plant_count: number | null;
  flowering_duration_days: number | null;
  harvest_window_start_days: number | null;
  harvest_window_end_days: number | null;
  variety_type: VarietyType;
  stretch: SensitivityLevel;
  ec_sensitivity: SensitivityLevel;
  irrigation_sensitivity: SensitivityLevel;
  phenotype_notes: string | null;
  notes: string | null;
  preset_slug: string | null;
};

export type RoomVarietyIntelligenceSummary = {
  totalPlantCount: number;
  varietyCount: number;
  nearestHarvestLabel: string | null;
  furthestHarvestLabel: string | null;
  harvestWindowSummaryLabel: string | null;
};
