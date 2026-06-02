import type { VarietyPreset } from "@/lib/varieties/types";
import type { VarietyFormPayload } from "@/lib/varieties/parse-variety-form";

/** Snapshot preset fields at create time; form values override non-empty user input */
export function mergePresetWithFormPayload(
  preset: VarietyPreset,
  form: VarietyFormPayload,
): VarietyFormPayload {
  return {
    preset_slug: preset.slug,
    name: form.name.trim() || preset.name,
    genetics: form.genetics ?? preset.genetics,
    lineage: form.lineage,
    breeder: form.breeder,
    plant_count: form.plant_count,
    variety_type: form.variety_type,
    flowering_duration_days: form.flowering_duration_days ?? preset.flowering_duration_days,
    harvest_window_start_days:
      form.harvest_window_start_days ?? preset.harvest_window_start_days,
    harvest_window_end_days: form.harvest_window_end_days ?? preset.harvest_window_end_days,
    stretch: form.stretch,
    ec_sensitivity: form.ec_sensitivity,
    irrigation_sensitivity: form.irrigation_sensitivity,
    phenotype_notes: form.phenotype_notes ?? preset.phenotype_notes,
    notes: form.notes ?? preset.notes,
  };
}

export function presetToFormDefaults(preset: VarietyPreset): Partial<VarietyFormPayload> {
  return {
    preset_slug: preset.slug,
    name: preset.name,
    genetics: preset.genetics,
    variety_type: preset.variety_type,
    flowering_duration_days: preset.flowering_duration_days,
    harvest_window_start_days: preset.harvest_window_start_days,
    harvest_window_end_days: preset.harvest_window_end_days,
    stretch: preset.stretch,
    ec_sensitivity: preset.ec_sensitivity,
    irrigation_sensitivity: preset.irrigation_sensitivity,
    phenotype_notes: preset.phenotype_notes,
    notes: preset.notes,
  };
}
