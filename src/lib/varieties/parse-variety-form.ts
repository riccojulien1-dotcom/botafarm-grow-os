import {
  SENSITIVITY_LEVELS,
  VARIETY_TYPES,
  type SensitivityLevel,
  type VarietyType,
} from "@/lib/varieties/constants";

export type VarietyFormPayload = {
  name: string;
  genetics: string | null;
  plant_count: number;
  variety_type: VarietyType;
  flowering_duration_days: number | null;
  harvest_window_start_days: number | null;
  harvest_window_end_days: number | null;
  stretch: SensitivityLevel;
  ec_sensitivity: SensitivityLevel;
  irrigation_sensitivity: SensitivityLevel;
  phenotype_notes: string | null;
  notes: string | null;
  preset_slug: string | null;
};

export type VarietyFieldValues = VarietyFormPayload;

function parseOptionalPositiveInt(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== "string" || raw.length === 0) {
    return null;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    return Number.NaN;
  }
  return value;
}

const INVALID = Symbol("invalid");

function parseSensitivity(raw: FormDataEntryValue | null): SensitivityLevel | typeof INVALID {
  const value = String(raw ?? "medium").trim().toLowerCase();
  if (!SENSITIVITY_LEVELS.includes(value as SensitivityLevel)) {
    return INVALID;
  }
  return value as SensitivityLevel;
}

function parseVarietyType(raw: FormDataEntryValue | null): VarietyType | typeof INVALID {
  const value = String(raw ?? "Hybrid").trim();
  if (!VARIETY_TYPES.includes(value as VarietyType)) {
    return INVALID;
  }
  return value as VarietyType;
}

export function parseVarietyFormData(
  formData: FormData,
): { ok: true; payload: VarietyFormPayload } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const plantCountRaw = formData.get("plant_count");

  if (!name) {
    return { ok: false, error: "Variety name is required." };
  }

  const plant_count =
    typeof plantCountRaw === "string" && plantCountRaw.length > 0
      ? Number(plantCountRaw)
      : Number.NaN;

  if (!Number.isInteger(plant_count) || plant_count < 0) {
    return { ok: false, error: "Plant count must be a whole number of 0 or more." };
  }

  const flowering_duration_days = parseOptionalPositiveInt(
    formData.get("flowering_duration_days"),
  );
  if (Number.isNaN(flowering_duration_days)) {
    return {
      ok: false,
      error: "Flowering duration must be a positive whole number of days.",
    };
  }

  const harvest_window_start_days = parseOptionalPositiveInt(
    formData.get("harvest_window_start_days"),
  );
  if (Number.isNaN(harvest_window_start_days)) {
    return {
      ok: false,
      error: "Harvest window start must be a positive whole number of days.",
    };
  }

  const harvest_window_end_days = parseOptionalPositiveInt(
    formData.get("harvest_window_end_days"),
  );
  if (Number.isNaN(harvest_window_end_days)) {
    return {
      ok: false,
      error: "Harvest window end must be a positive whole number of days.",
    };
  }

  if (
    harvest_window_start_days != null &&
    harvest_window_end_days != null &&
    harvest_window_end_days < harvest_window_start_days
  ) {
    return {
      ok: false,
      error: "Harvest window end must be greater than or equal to start.",
    };
  }

  const variety_type = parseVarietyType(formData.get("variety_type"));
  if (variety_type === INVALID) {
    return { ok: false, error: "Invalid variety type." };
  }

  const stretch = parseSensitivity(formData.get("stretch"));
  if (stretch === INVALID) {
    return { ok: false, error: "Invalid stretch value." };
  }

  const ec_sensitivity = parseSensitivity(formData.get("ec_sensitivity"));
  if (ec_sensitivity === INVALID) {
    return { ok: false, error: "Invalid EC sensitivity value." };
  }

  const irrigation_sensitivity = parseSensitivity(formData.get("irrigation_sensitivity"));
  if (irrigation_sensitivity === INVALID) {
    return { ok: false, error: "Invalid irrigation sensitivity value." };
  }

  const presetSlugRaw = String(formData.get("preset_slug") ?? "").trim();

  return {
    ok: true,
    payload: {
      name,
      genetics: String(formData.get("genetics") ?? "").trim() || null,
      plant_count,
      variety_type,
      flowering_duration_days,
      harvest_window_start_days,
      harvest_window_end_days,
      stretch,
      ec_sensitivity,
      irrigation_sensitivity,
      phenotype_notes: String(formData.get("phenotype_notes") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      preset_slug: presetSlugRaw || null,
    },
  };
}
