import type { getTranslations } from "next-intl/server";

import type { CopilotBriefing } from "@/lib/copilot/types";
import type { CommandCenterPriority } from "@/lib/dashboard/command-center-priorities";
import type { OverviewEnvironmentSummary } from "@/lib/environment/build-supervision-rooms";

type DashboardTranslator = Awaited<ReturnType<typeof getTranslations<"dashboard">>>;

type LocalizedOperationBriefingInput = {
  roomEnvironments: OverviewEnvironmentSummary[];
  priorities: CommandCenterPriority[];
};

export function buildLocalizedOperationBriefing(
  t: DashboardTranslator,
  input: LocalizedOperationBriefingInput,
): CopilotBriefing {
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
    happening = t("copilot.briefing.overdueTasksHappening", { count: overdueTasks.length });
  } else if (climateAction.length > 0) {
    happening = t("copilot.briefing.climateActionHappening", { count: climateAction.length });
  } else if (dueTodayTasks.length > 0 || climateWatch.length > 0) {
    happening = t("copilot.briefing.queueHappening", {
      taskCount: input.priorities.length,
      roomCount: climateWatch.length,
    });
  } else {
    happening = t("copilot.briefing.allStableHappening");
  }

  let why: string;
  if (overdueTasks.length > 0) {
    why = t("copilot.briefing.whyOverdue", {
      room: overdueTasks[0].roomName,
      title: overdueTasks[0].title,
    });
  } else if (climateAction.length > 0) {
    const first = climateAction[0];
    why =
      first.attentionReason ??
      t("copilot.briefing.whyClimateFallback", { room: first.roomName });
  } else if (dueTodayTasks.length > 0) {
    why = t("copilot.briefing.whyDueToday", {
      room: dueTodayTasks[0].roomName,
      title: dueTodayTasks[0].title,
    });
  } else if (climateWatch.length > 0) {
    why = t("copilot.briefing.whyDrift", { count: climateWatch.length });
  } else {
    why = t("copilot.briefing.whyStable");
  }

  let next: string;
  if (overdueTasks.length > 0) {
    next = t("copilot.briefing.nextOverdue");
  } else if (climateAction.length > 0 || climateWatch.length > 0) {
    next = t("copilot.briefing.nextClimate");
  } else if (input.priorities.length > 0) {
    next = t("copilot.briefing.nextTodayTask", { title: input.priorities[0].title });
  } else {
    next = t("copilot.briefing.nextStable");
  }

  return {
    happening,
    why,
    next,
    signals: [],
  };
}
