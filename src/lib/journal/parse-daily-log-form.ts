import type { DailyLogFormPayload } from "@/lib/journal/daily-log-fields";

export type ParseDailyLogErrorKey = "invalidLogDate" | "invalidIrrigationCount";

function numericValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function integerValue(value: FormDataEntryValue | null) {
  const parsed = numericValue(value);
  if (parsed == null || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
}

function parseLogDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return {
    logDate: value,
    loggedAt: parsed.toISOString(),
  };
}

export function parseDailyLogFormData(
  formData: FormData,
  options?: { requireLogDate?: boolean },
):
  | { ok: true; payload: DailyLogFormPayload }
  | { ok: false; errorKey: ParseDailyLogErrorKey } {
  const requireLogDate = options?.requireLogDate ?? true;
  const logDateValue = parseLogDate(formData.get("log_date"));

  if (requireLogDate && !logDateValue) {
    return { ok: false, errorKey: "invalidLogDate" };
  }

  const irrigationCount = integerValue(formData.get("irrigation_count"));
  if (
    typeof formData.get("irrigation_count") === "string" &&
    formData.get("irrigation_count") !== "" &&
    irrigationCount == null
  ) {
    return { ok: false, errorKey: "invalidIrrigationCount" };
  }

  return {
    ok: true,
    payload: {
      log_date: logDateValue?.logDate ?? new Date().toISOString().slice(0, 10),
      logged_at: logDateValue?.loggedAt ?? new Date().toISOString(),
      temperature: numericValue(formData.get("temperature")),
      humidity: numericValue(formData.get("humidity")),
      vpd: numericValue(formData.get("vpd")),
      ppfd: numericValue(formData.get("ppfd")),
      dli: numericValue(formData.get("dli")),
      ec_in: numericValue(formData.get("ec_in")),
      ph_in: numericValue(formData.get("ph_in")),
      ec_runoff: numericValue(formData.get("ec_runoff")),
      ph_runoff: numericValue(formData.get("ph_runoff")),
      irrigation_count: irrigationCount,
      irrigation_volume_per_event: numericValue(
        formData.get("irrigation_volume_per_event"),
      ),
      runoff_percent: numericValue(formData.get("runoff_percent")),
      dryback_percent: numericValue(formData.get("dryback_percent")),
      plant_height_cm: numericValue(formData.get("plant_height_cm")),
      stretch_percent: numericValue(formData.get("stretch_percent")),
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  };
}
