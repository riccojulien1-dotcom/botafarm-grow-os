import type { CommandCenterPriority } from "@/lib/dashboard/command-center-priorities";
import type { OverviewEnvironmentSummary } from "@/lib/environment/build-supervision-rooms";
import type { CopilotBriefing, CopilotSignal } from "@/lib/copilot/types";

type BuildOperationBriefingInput = {
  roomEnvironments: OverviewEnvironmentSummary[];
  priorities: CommandCenterPriority[];
};

export function buildOperationBriefing(input: BuildOperationBriefingInput): CopilotBriefing {
  const overdueTasks = input.priorities.filter((priority) => priority.severity === "action");
  const dueTodayTasks = input.priorities.filter((priority) => priority.severity === "watch");
  const climateAction = input.roomEnvironments.filter(
    (environment) => environment.status === "action",
  );
  const climateWatch = input.roomEnvironments.filter(
    (environment) => environment.status === "watch" || environment.status === "drift",
  );

  let happening: string;
  if (overdueTasks.length > 0) {
    happening = `${overdueTasks.length} overdue task${overdueTasks.length === 1 ? "" : "s"} need attention today.`;
  } else if (climateAction.length > 0) {
    happening = `${climateAction.length} room${climateAction.length === 1 ? "" : "s"} have climate or irrigation outside target.`;
  } else if (dueTodayTasks.length > 0 || climateWatch.length > 0) {
    happening = `Today's queue: ${input.priorities.length} task${input.priorities.length === 1 ? "" : "s"} and ${climateWatch.length} room${climateWatch.length === 1 ? "" : "s"} to review.`;
  } else {
    happening = "All tracked rooms are on schedule. No urgent items in the command center.";
  }

  let why: string;
  if (overdueTasks.length > 0) {
    why = `${overdueTasks[0].roomName} — ${overdueTasks[0].title.toLowerCase()}.`;
  } else if (climateAction.length > 0) {
    const first = climateAction[0];
    why = first.attentionReason ?? `${first.roomName} needs a climate check.`;
  } else if (dueTodayTasks.length > 0) {
    why = `${dueTodayTasks[0].roomName} — ${dueTodayTasks[0].title.toLowerCase()} due today.`;
  } else if (climateWatch.length > 0) {
    why = `${climateWatch.length} room${climateWatch.length === 1 ? "" : "s"} showing early drift — open Environment for detail.`;
  } else {
    why = "Journal logs and task schedules show a stable operation.";
  }

  let next: string;
  if (overdueTasks.length > 0) {
    next = "Work through Tasks today, then open Grow Rooms for room management.";
  } else if (climateAction.length > 0 || climateWatch.length > 0) {
    next = "Open Environment for full climate analysis, or complete tasks listed on Overview.";
  } else if (input.priorities.length > 0) {
    next = `Complete today's task: ${input.priorities[0].title.toLowerCase()}.`;
  } else {
    next = "Keep logging daily. Use Grow Rooms to manage cycles and Environment for trend detail.";
  }

  return {
    happening,
    why,
    next,
    signals: [] satisfies CopilotSignal[],
  };
}

export function buildEnvironmentFarmBriefing(
  rooms: Array<{
    id: string;
    name: string;
    roomStatus: string;
    attentionReason: string | null;
    metrics: Array<{ recommendation: string; status: string }>;
  }>,
): CopilotBriefing {
  const attention = rooms.filter((room) => room.roomStatus !== "good" && room.roomStatus !== "no_data");

  const actionCount = attention.filter((room) => room.roomStatus === "action").length;

  return {
    happening:
      actionCount > 0
        ? `${actionCount} room${actionCount === 1 ? "" : "s"} have metrics outside target.`
        : attention.length > 0
          ? `${attention.length} room${attention.length === 1 ? "" : "s"} show early drift — still manageable.`
          : "Climate and irrigation are steady across all rooms.",
    why: attention[0]?.attentionReason ?? "Latest journal readings are within expected ranges.",
    next:
      attention[0]?.metrics.find((metric) => metric.status !== "optimal" && metric.status !== "no_data")
        ?.recommendation ??
      "Log each room on schedule so trends stay visible before the next irrigation cycle.",
    signals: [],
  };
}
