export const VARIETY_TYPES = ["Indica", "Sativa", "Hybrid", "CBD", "Auto"] as const;

export type VarietyType = (typeof VARIETY_TYPES)[number];

export const SENSITIVITY_LEVELS = ["low", "medium", "high"] as const;

export type SensitivityLevel = (typeof SENSITIVITY_LEVELS)[number];

export const SENSITIVITY_LABELS: Record<SensitivityLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
