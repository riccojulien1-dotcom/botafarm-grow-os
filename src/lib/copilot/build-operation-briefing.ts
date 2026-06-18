import type { DashboardRoomEnvironment } from "@/lib/dashboard/build-room-environment-summaries";
import type { CommandCenterRoom } from "@/lib/dashboard/get-command-center-data";
import type { CommandCenterPriority } from "@/lib/dashboard/command-center-priorities";
import { translateRecommendationForGrower } from "@/lib/copilot/translate-recommendation";
import type { CopilotBriefing, CopilotSignal } from "@/lib/copilot/types";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
import type { RecommendationLogInput } from "@/lib/recommendations/types";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type BuildOperationBriefingInput = {
  rooms: CommandCenterRoom[];
  roomEnvironments: DashboardRoomEnvironment[];
  priorities: CommandCenterPriority[];
  primaryHarvestDays: number | null;
  primaryHarvestRoom: string | null;
  latestLogByRoom: Map<string, RecommendationLogInput>;
  varietiesByRoom: Map<string, RoomVarietyRecord[]>;
};

function toneFromSeverity(severity: "good" | "watch" | "action"): CopilotSignal["tone"] {
  if (severity === "action") return "action";
  if (severity === "watch") return "watch";
  return "good";
}

export function buildOperationBriefing(input: BuildOperationBriefingInput): CopilotBriefing {
  const signals: CopilotSignal[] = [];
  const attentionRooms = input.rooms.filter(
    (room) => room.severity !== "good" || room.overdueTasks > 0,
  );

  if (attentionRooms.length === 0 && input.roomEnvironments.every((env) => env.status === "good")) {
    signals.push({
      id: "all-healthy",
      tone: "good",
      text: "All rooms healthy",
    });
  }

  for (const environment of input.roomEnvironments) {
    if (environment.status === "good" || !environment.hasJournalEntries) {
      continue;
    }
    signals.push({
      id: `env-${environment.roomId}`,
      tone: toneFromSeverity(environment.status === "insufficient_data" ? "watch" : environment.status),
      text: environment.attentionReason ?? `${environment.roomName} needs a climate check`,
      href: `/dashboard/environment#room-env-${environment.roomId}`,
    });
  }

  for (const room of input.rooms) {
    const varieties = input.varietiesByRoom.get(room.id) ?? [];
    const latestLog = input.latestLogByRoom.get(room.id) ?? null;
    const summary = getRecommendationSummary(latestLog, room.status, varieties);

    for (const item of summary.activeItems) {
      if (item.severity === "good") continue;
      const text = translateRecommendationForGrower(toTitleCase(room.name), item);
      if (signals.some((signal) => signal.text === text)) continue;
      signals.push({
        id: `rec-${room.id}-${item.metric}`,
        tone: toneFromSeverity(item.severity),
        text,
        href: `/rooms/${room.id}`,
      });
    }
  }

  for (const priority of input.priorities) {
    if (priority.severity === "action") {
      signals.push({
        id: priority.id,
        tone: "action",
        text: `${priority.roomName} — ${priority.title.toLowerCase()}`,
        href: `/rooms/${priority.roomId}`,
      });
    }
  }

  if (input.primaryHarvestDays != null && input.primaryHarvestRoom) {
    signals.push({
      id: "next-harvest",
      tone: "watch",
      text: `Upcoming harvest in ${input.primaryHarvestDays} days — ${toTitleCase(input.primaryHarvestRoom)}`,
      href: "/dashboard/grow-rooms",
    });
  }

  const actionCount = signals.filter((signal) => signal.tone === "action").length;
  const watchCount = signals.filter((signal) => signal.tone === "watch").length;

  let happening: string;
  if (actionCount > 0) {
    happening = `${actionCount} room${actionCount === 1 ? "" : "s"} need immediate attention right now.`;
  } else if (watchCount > 0) {
    happening = `Operation is stable, but ${watchCount} signal${watchCount === 1 ? "" : "s"} deserve a walk-through today.`;
  } else {
    happening = "All tracked rooms are within target. No urgent climate or irrigation issues.";
  }

  const topSignal = signals.find((signal) => signal.tone === "action") ?? signals.find((s) => s.tone === "watch");
  const why = topSignal
    ? topSignal.text
    : input.primaryHarvestDays != null
      ? `Your next harvest window is approaching in ${input.primaryHarvestDays} days.`
      : "Journal logs show stable climate and irrigation across active rooms.";

  let next: string;
  if (actionCount > 0) {
    next = "Open the flagged room, log a fresh reading, and adjust irrigation or environment before the next feed.";
  } else if (watchCount > 0) {
    next = "Review Environment for trend detail, then confirm each watch item on your next room round.";
  } else if (input.priorities.length > 0) {
    next = `Complete today's task: ${input.priorities[0].title.toLowerCase()}.`;
  } else {
    next = "Keep logging daily. Consistent journal entries make early drift visible before plants show stress.";
  }

  return {
    happening,
    why,
    next,
    signals: signals.slice(0, 8),
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
  const signals: CopilotSignal[] = [];
  const attention = rooms.filter((room) => room.roomStatus !== "good" && room.roomStatus !== "no_data");

  if (attention.length === 0) {
    signals.push({ id: "env-good", tone: "good", text: "All rooms within climate and irrigation targets" });
  }

  for (const room of attention) {
    signals.push({
      id: `room-${room.id}`,
      tone: room.roomStatus === "action" ? "action" : "watch",
      text: room.attentionReason ?? `${room.name} needs review`,
      href: `#room-env-${room.id}`,
    });
  }

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
    signals,
  };
}
