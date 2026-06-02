/**
 * Display-only target bands aligned with existing recommendation / knowledge rules.
 * Not used for alerts — presentation for Environment Intelligence UI.
 */

import { vpdEntry } from "@/lib/knowledge-base/seeds/vpd";

const VEG_STATUSES = new Set(["Clone", "Mother", "Vegetative", "Pre-Flower"]);
const FLOWER_STATUSES = new Set(["Flower"]);

function isVeg(status: string) {
  return VEG_STATUSES.has(status);
}

function isFlower(status: string) {
  return FLOWER_STATUSES.has(status);
}

export type MetricRange = {
  min: number;
  max: number;
  label: string;
};

export function getVpdRange(roomStatus: string): MetricRange | null {
  if (isVeg(roomStatus)) {
    const band = vpdEntry.recommendedRanges.find((entry) => entry.phase === "Vegetative");
    if (band?.min != null && band?.max != null) {
      return { min: band.min, max: band.max, label: `${band.min} – ${band.max} kPa` };
    }
    return { min: 0.8, max: 1.2, label: "0.8 – 1.2 kPa" };
  }
  if (isFlower(roomStatus)) {
    const band = vpdEntry.recommendedRanges.find((entry) => entry.phase === "Flower");
    if (band?.min != null && band?.max != null) {
      return { min: band.min, max: band.max, label: `${band.min} – ${band.max} kPa` };
    }
    return { min: 1.1, max: 1.5, label: "1.1 – 1.5 kPa" };
  }
  return null;
}

export function getPhRange(): MetricRange {
  return { min: 5.5, max: 6.5, label: "5.5 – 6.5" };
}

/** Reference bands for dashboard context (not recommendation engine). */
export function getTemperatureReference(roomStatus: string): MetricRange | null {
  if (isVeg(roomStatus)) return { min: 22, max: 28, label: "22 – 28 °C" };
  if (isFlower(roomStatus)) return { min: 22, max: 26, label: "22 – 26 °C" };
  return { min: 20, max: 28, label: "20 – 28 °C" };
}

export function getHumidityReference(roomStatus: string): MetricRange | null {
  if (isVeg(roomStatus)) return { min: 55, max: 70, label: "55 – 70 %" };
  if (isFlower(roomStatus)) return { min: 45, max: 58, label: "45 – 58 %" };
  return { min: 45, max: 65, label: "45 – 65 %" };
}

export function getEcInReference(): MetricRange {
  return { min: 2.0, max: 3.2, label: "2.0 – 3.2" };
}

export function getEcRunoffReference(): MetricRange {
  return { min: 2.0, max: 3.5, label: "2.0 – 3.5" };
}
