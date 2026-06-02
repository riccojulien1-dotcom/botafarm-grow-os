/** Room UI labels → canonical knowledge metric keys searched in the catalog */
export const ROOM_CULTIVATION_METRICS = [
  { id: "vpd", label: "VPD", metrics: ["vpd"] },
  { id: "temperature", label: "Temperature", metrics: ["temperature"] },
  { id: "humidity", label: "Humidity", metrics: ["humidity"] },
  { id: "ec", label: "EC", metrics: ["ec_in", "ec_runoff"] },
  { id: "ph", label: "pH", metrics: ["ph_in", "ph_runoff"] },
] as const;

export type RoomCultivationMetricId = (typeof ROOM_CULTIVATION_METRICS)[number]["id"];

const METRIC_ALIAS_GROUPS: Record<string, string[]> = {
  vpd: ["vpd"],
  temperature: ["temperature", "temp"],
  humidity: ["humidity", "rh"],
  ec: ["ec_in", "ec_runoff", "ec"],
  ec_in: ["ec_in", "ec"],
  ec_runoff: ["ec_runoff", "ec"],
  ph: ["ph_in", "ph_runoff", "ph"],
  ph_in: ["ph_in", "ph"],
  ph_runoff: ["ph_runoff", "ph"],
  dryback: ["dryback_percent", "dryback"],
  runoff: ["runoff_percent", "runoff"],
  ppfd: ["ppfd"],
  dli: ["dli"],
};

export function resolveMetricSearchKeys(metric: string): string[] {
  const normalized = metric.trim().toLowerCase().replace(/\s+/g, "_");
  return METRIC_ALIAS_GROUPS[normalized] ?? [normalized];
}
