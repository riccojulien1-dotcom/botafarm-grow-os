export type VarietyFormPayload = {
  name: string;
  genetics: string | null;
  plant_count: number;
  flowering_duration_days: number | null;
  notes: string | null;
};

export type VarietyFieldValues = {
  name: string;
  genetics: string | null;
  plant_count: number | null;
  flowering_duration_days: number | null;
  notes: string | null;
};

export function parseVarietyFormData(
  formData: FormData,
): { ok: true; payload: VarietyFormPayload } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const plantCountRaw = formData.get("plant_count");
  const floweringRaw = formData.get("flowering_duration_days");

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

  const flowering_duration_days =
    typeof floweringRaw === "string" && floweringRaw.length > 0
      ? Number(floweringRaw)
      : null;

  if (
    flowering_duration_days != null &&
    (!Number.isInteger(flowering_duration_days) || flowering_duration_days <= 0)
  ) {
    return {
      ok: false,
      error: "Flowering duration must be a positive whole number of days.",
    };
  }

  return {
    ok: true,
    payload: {
      name,
      genetics: String(formData.get("genetics") ?? "").trim() || null,
      plant_count,
      flowering_duration_days: Number.isNaN(flowering_duration_days)
        ? null
        : flowering_duration_days,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  };
}
