import { getCurrentCycleDay } from "@/lib/grow-rooms/crop-cycle";
import type { TaskCategory, TaskPriority } from "@/lib/tasks/constants";

export type SuggestedCycleTask = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  triggerDay: number;
  phaseLabel: string;
};

const FLOWER_SUGGESTIONS: Array<{
  day: number;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
}> = [
  {
    day: 14,
    title: "Defoliation",
    description: "Flower day 14 — consider strategic defoliation to open the canopy.",
    category: "Plant Work",
    priority: "medium",
  },
  {
    day: 21,
    title: "Check Runoff",
    description: "Flower day 21 — verify runoff EC, pH, and volume after feeds.",
    category: "Irrigation",
    priority: "high",
  },
  {
    day: 35,
    title: "Trichome Inspection",
    description: "Flower day 35 — inspect trichome maturity on top colas.",
    category: "Plant Work",
    priority: "medium",
  },
  {
    day: 56,
    title: "Harvest Assessment",
    description: "Flower day 56 — assess ripeness and plan harvest window.",
    category: "Harvest",
    priority: "high",
  },
];

export function getSuggestedCycleTasks(
  roomStatus: string,
  cycleStartDate: string | null,
  existingTitles: string[],
  today: Date = new Date(),
): SuggestedCycleTask[] {
  if (roomStatus !== "Flower" || !cycleStartDate) {
    return [];
  }

  const currentDay = getCurrentCycleDay(cycleStartDate, today);
  if (currentDay == null) {
    return [];
  }

  const normalizedTitles = new Set(existingTitles.map((title) => title.toLowerCase()));

  return FLOWER_SUGGESTIONS.filter((suggestion) => {
    if (currentDay < suggestion.day) {
      return false;
    }

    if (normalizedTitles.has(suggestion.title.toLowerCase())) {
      return false;
    }

    return true;
  }).map((suggestion) => ({
    id: `flower-day-${suggestion.day}-${suggestion.title.toLowerCase().replace(/\s+/g, "-")}`,
    title: suggestion.title,
    description: suggestion.description,
    category: suggestion.category,
    priority: suggestion.priority,
    triggerDay: suggestion.day,
    phaseLabel: `Flower day ${suggestion.day}`,
  }));
}
