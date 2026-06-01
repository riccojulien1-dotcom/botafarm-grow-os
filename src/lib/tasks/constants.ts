export const TASK_CATEGORIES = [
  "Irrigation",
  "Environment",
  "Nutrition",
  "Plant Work",
  "Maintenance",
  "Harvest",
  "Drying",
  "Curing",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type TaskTemplate = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  daysFromToday?: number;
};

export const QUICK_TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "defoliation",
    title: "Defoliation",
    description: "Remove lower fan leaves and improve airflow before generative load increases.",
    category: "Plant Work",
    priority: "medium",
    daysFromToday: 0,
  },
  {
    id: "flip-flower",
    title: "Flip to Flower",
    description: "Switch photoperiod and confirm environment targets for flower phase.",
    category: "Plant Work",
    priority: "high",
    daysFromToday: 0,
  },
  {
    id: "increase-ec",
    title: "Increase EC",
    description: "Step feed EC based on uptake and runoff trends.",
    category: "Nutrition",
    priority: "medium",
    daysFromToday: 0,
  },
  {
    id: "reduce-ec",
    title: "Reduce EC",
    description: "Lower feed EC if runoff accumulation or stress signals are present.",
    category: "Nutrition",
    priority: "medium",
    daysFromToday: 0,
  },
  {
    id: "check-runoff",
    title: "Check Runoff",
    description: "Measure runoff EC, pH, and volume percent after irrigation.",
    category: "Irrigation",
    priority: "high",
    daysFromToday: 0,
  },
  {
    id: "calibrate-ph",
    title: "Calibrate pH Meter",
    description: "Calibrate probe and verify buffer solutions before next feed.",
    category: "Maintenance",
    priority: "low",
    daysFromToday: 1,
  },
  {
    id: "calibrate-ec",
    title: "Calibrate EC Meter",
    description: "Calibrate meter with standard solution before nutrition adjustments.",
    category: "Maintenance",
    priority: "low",
    daysFromToday: 1,
  },
  {
    id: "clean-irrigation",
    title: "Clean Irrigation System",
    description: "Flush lines, check filters, and sanitize reservoirs or drippers.",
    category: "Maintenance",
    priority: "medium",
    daysFromToday: 2,
  },
  {
    id: "harvest",
    title: "Harvest",
    description: "Execute harvest plan, document wet weights, and prep drying space.",
    category: "Harvest",
    priority: "high",
    daysFromToday: 0,
  },
  {
    id: "drying-check",
    title: "Drying Check",
    description: "Verify drying room temp, humidity, and airflow balance.",
    category: "Drying",
    priority: "medium",
    daysFromToday: 0,
  },
  {
    id: "cure-check",
    title: "Cure Check",
    description: "Check jar humidity, burp schedule, and aroma development.",
    category: "Curing",
    priority: "medium",
    daysFromToday: 0,
  },
];

export function isTaskCategory(value: string): value is TaskCategory {
  return (TASK_CATEGORIES as readonly string[]).includes(value);
}

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value);
}
