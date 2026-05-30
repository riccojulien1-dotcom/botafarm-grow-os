export const DAILY_LOG_SELECT_COLUMNS = [
  "id",
  "log_date",
  "logged_at",
  "temperature",
  "humidity",
  "vpd",
  "ppfd",
  "dli",
  "ec_in",
  "ph_in",
  "ec_runoff",
  "ph_runoff",
  "irrigation_count",
  "irrigation_volume_per_event",
  "runoff_percent",
  "dryback_percent",
  "plant_height_cm",
  "stretch_percent",
  "notes",
].join(",");

export type DailyLogFieldValues = {
  log_date: string | null;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ppfd: number | null;
  dli: number | null;
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
  irrigation_count: number | null;
  irrigation_volume_per_event: number | null;
  runoff_percent: number | null;
  dryback_percent: number | null;
  plant_height_cm: number | null;
  stretch_percent: number | null;
  notes: string | null;
};

export type DailyLogRecord = DailyLogFieldValues & {
  id: string;
  logged_at: string;
};

export type DailyLogFormPayload = DailyLogFieldValues & {
  log_date: string;
  logged_at: string;
};
