export const CULTIVAR_BATCH_STATUSES = [
  "clone",
  "vegetative",
  "preflower",
  "flower",
  "harvest",
  "completed",
] as const;

export type CultivarBatchStatus = (typeof CULTIVAR_BATCH_STATUSES)[number];

export const CULTIVAR_BATCH_STATUS_LABELS: Record<CultivarBatchStatus, string> = {
  clone: "Clone",
  vegetative: "Vegetative",
  preflower: "Pre-flower",
  flower: "Flower",
  harvest: "Harvest",
  completed: "Completed",
};
