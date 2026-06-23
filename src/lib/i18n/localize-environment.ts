import type { getTranslations } from "next-intl/server";

import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";
import type { SupervisionMetric } from "@/lib/environment/build-supervision-metrics";
import type {
  OverviewEnvironmentSummary,
  SupervisionRoom,
} from "@/lib/environment/build-supervision-rooms";
import type { SupervisionMetricStatus, SupervisionRoomStatus } from "@/lib/environment/metric-insights";
import type { CopilotBriefing } from "@/lib/copilot/types";
import { localizeRelativeTimeString } from "@/lib/i18n/localize-relative-time";

type EnvironmentTranslator = Awaited<ReturnType<typeof getTranslations<"environment">>>;

const TREND_KEY_MAP: Record<string, "stable" | "increasing" | "decreasing" | "notEnoughReadings"> = {
  Stable: "stable",
  Increasing: "increasing",
  Decreasing: "decreasing",
  "Not enough readings": "notEnoughReadings",
};

const METRIC_STATUS_KEY: Record<SupervisionMetricStatus, string> = {
  no_data: "noReading",
  watch: "watch",
  drift: "drift",
  action: "action",
  optimal: "good",
};

const ROOM_STATUS_KEY: Record<SupervisionRoomStatus, string> = {
  no_data: "notEnoughReadings",
  action: "actionRequired",
  watch: "watch",
  drift: "watch",
  good: "good",
};

function metricLabel(t: EnvironmentTranslator, key: EnvironmentMetricKey): string {
  return t(`metrics.labels.${key}` as Parameters<EnvironmentTranslator>[0]);
}

function translateTrend(t: EnvironmentTranslator, englishLabel: string): string {
  const key = TREND_KEY_MAP[englishLabel];
  return key ? t(`metrics.trends.${key}` as Parameters<EnvironmentTranslator>[0]) : englishLabel;
}

function translateMetricStatus(t: EnvironmentTranslator, status: SupervisionMetricStatus): string {
  const key = METRIC_STATUS_KEY[status];
  return t(`metrics.status.${key}` as Parameters<EnvironmentTranslator>[0]);
}

function translateRoomStatus(t: EnvironmentTranslator, status: SupervisionRoomStatus): string {
  const key = ROOM_STATUS_KEY[status];
  return t(`metrics.status.${key}` as Parameters<EnvironmentTranslator>[0]);
}

function localizeTargetDisplay(t: EnvironmentTranslator, targetDisplay: string): string {
  if (targetDisplay === "Target not set for this room phase") {
    return t("metrics.detail.targetNotSet");
  }
  if (targetDisplay.startsWith("Target ")) {
    return t("metrics.detail.targetPrefix", {
      range: targetDisplay.replace(/^Target /, ""),
    });
  }
  return targetDisplay;
}

function localizeInterpretation(
  t: EnvironmentTranslator,
  metric: SupervisionMetric,
  label: string,
  englishTrend: string,
  localizedTrend: string,
): string {
  const target = metric.targetDisplay.replace(/^Target /, "");
  const delta = metric.deltaLabel;

  switch (metric.status) {
    case "no_data":
      return t("metrics.interpretation.noData", { label });
    case "action":
      return t("metrics.interpretation.action", { label, target });
    case "drift":
      return t("metrics.interpretation.drift", {
        label,
        target,
        trend: localizedTrend.toLowerCase(),
        delta,
      });
    case "watch":
      return t("metrics.interpretation.watch", { label, delta, target });
    default:
      if (englishTrend === "Stable") {
        return t("metrics.interpretation.stable", { label, target });
      }
      return t("metrics.interpretation.within", {
        label,
        target,
        trend: localizedTrend.toLowerCase(),
        delta,
      });
  }
}

function localizeRecommendation(t: EnvironmentTranslator, metric: SupervisionMetric, label: string): string {
  if (metric.status === "no_data") {
    return t("metrics.recommendation.logNext", { label: label.toLowerCase() });
  }
  if (metric.status === "optimal" && metric.trendLabel === "Stable") {
    return t("metrics.recommendation.noAction", { label, current: metric.currentDisplay });
  }
  if (metric.status === "watch") {
    return t("metrics.recommendation.walkRoom", {
      label,
      current: metric.currentDisplay,
      target: metric.targetDisplay,
    });
  }
  if (metric.status === "action") {
    return t("metrics.recommendation.adjustRoom", {
      label,
      current: metric.currentDisplay,
      target: metric.targetDisplay,
    });
  }
  return t("metrics.recommendation.logAgain", { label: label.toLowerCase(), current: metric.currentDisplay });
}

function localizeAttentionReason(
  t: EnvironmentTranslator,
  metric: SupervisionMetric,
  label: string,
  trend: string,
): string {
  if (metric.status === "action") {
    if (metric.current != null && metric.targetLabel.includes("–")) {
      const parts = metric.targetLabel.match(/([\d.]+)\s*–\s*([\d.]+)/);
      if (parts) {
        const max = Number(parts[2]);
        const min = Number(parts[1]);
        const target = metric.targetDisplay.replace(/^Target /, "");
        if (metric.current > max) {
          return t("metrics.attention.aboveTarget", {
            label,
            current: metric.currentDisplay,
            target,
          });
        }
        if (metric.current < min) {
          return t("metrics.attention.belowTarget", {
            label,
            current: metric.currentDisplay,
            target,
          });
        }
      }
    }
    return t("metrics.attention.outsideTarget", { label, current: metric.currentDisplay });
  }

  if (metric.trendLabel === "Increasing" && metric.previousDisplay !== "—") {
    return t("metrics.attention.rose", {
      label,
      previous: metric.previousDisplay,
      current: metric.currentDisplay,
    });
  }
  if (metric.trendLabel === "Decreasing" && metric.previousDisplay !== "—") {
    return t("metrics.attention.dropped", {
      label,
      previous: metric.previousDisplay,
      current: metric.currentDisplay,
    });
  }

  if (metric.status === "drift" || metric.status === "watch") {
    return t("metrics.attention.atTrend", {
      label,
      current: metric.currentDisplay,
      trend: trend.toLowerCase(),
    });
  }

  return t("metrics.attention.atTrend", {
    label,
    current: metric.currentDisplay,
    trend: trend.toLowerCase(),
  });
}

function localizeMetric(t: EnvironmentTranslator, metric: SupervisionMetric): SupervisionMetric {
  const label = metricLabel(t, metric.key);
  const englishTrend = metric.trendLabel;
  const trendLabel = translateTrend(t, englishTrend);
  const statusLabel = translateMetricStatus(t, metric.status);
  const targetDisplay = localizeTargetDisplay(t, metric.targetDisplay);

  let deltaShortLabel = metric.deltaShortLabel;
  if (deltaShortLabel === "Not enough readings") {
    deltaShortLabel = t("metrics.trends.notEnoughReadings");
  } else if (deltaShortLabel === "No change since last log") {
    deltaShortLabel = t("metrics.delta.noChange");
  } else if (deltaShortLabel.includes("since last log")) {
    deltaShortLabel = t("metrics.delta.sinceLastLog", {
      delta: metric.deltaLabel,
    });
  }

  let periodChangeLabel = metric.periodChangeLabel;
  if (periodChangeLabel === "Not enough readings") {
    periodChangeLabel = t("metrics.trends.notEnoughReadings");
  } else if (periodChangeLabel.includes("over logged period")) {
    periodChangeLabel = t("metrics.delta.overPeriod", {
      delta: periodChangeLabel.replace(" over logged period", ""),
    });
  }

  return {
    ...metric,
    label,
    trendLabel,
    statusLabel,
    targetDisplay,
    deltaShortLabel,
    periodChangeLabel,
    interpretation: localizeInterpretation(t, metric, label, englishTrend, trendLabel),
    recommendation: localizeRecommendation(t, metric, label),
  };
}

function localizeRoomAttention(
  t: EnvironmentTranslator,
  room: SupervisionRoom,
): string | null {
  if (!room.hasJournalEntries) {
    return t("room.addLogAttention");
  }
  if (room.roomStatus === "good") {
    return t("room.allMetricsGood");
  }

  const primary = room.metrics.find(
    (metric) => metric.status !== "optimal" && metric.status !== "no_data",
  );
  if (!primary) {
    return t("room.reviewClimate");
  }

  return localizeAttentionReason(t, primary, primary.label, primary.trendLabel);
}

export function localizeSupervisionRoom(
  t: EnvironmentTranslator,
  room: SupervisionRoom,
): SupervisionRoom {
  const metrics = room.metrics.map((metric) => localizeMetric(t, metric));
  const localized: SupervisionRoom = {
    ...room,
    metrics,
    roomStatusLabel: translateRoomStatus(t, room.roomStatus),
    attentionReason: null,
  };

  if (room.lastLogFreshness) {
    localized.lastLogFreshness = localizeRelativeTimeString(t, room.lastLogFreshness);
  }

  localized.attentionReason = localizeRoomAttention(t, localized);

  return localized;
}

export function localizeSupervisionRooms(
  t: EnvironmentTranslator,
  rooms: SupervisionRoom[],
): SupervisionRoom[] {
  return rooms.map((room) => localizeSupervisionRoom(t, room));
}

export function localizeOverviewEnvironmentSummaries(
  rooms: SupervisionRoom[],
): OverviewEnvironmentSummary[] {
  return rooms.map((room) => ({
    roomId: room.id,
    roomName: room.name,
    hasJournalEntries: room.hasJournalEntries,
    status: room.roomStatus,
    statusLabel: room.roomStatusLabel,
    attentionReason: room.attentionReason,
  }));
}

export function localizeEnvironmentFarmBriefing(
  t: EnvironmentTranslator,
  rooms: SupervisionRoom[],
): CopilotBriefing {
  const attention = rooms.filter(
    (room) => room.roomStatus !== "good" && room.roomStatus !== "no_data",
  );
  const actionCount = attention.filter((room) => room.roomStatus === "action").length;

  return {
    happening:
      actionCount > 0
        ? t("copilot.briefing.actionRooms", { count: actionCount })
        : attention.length > 0
          ? t("copilot.briefing.driftRooms", { count: attention.length })
          : t("copilot.briefing.steady"),
    why: attention[0]?.attentionReason ?? t("copilot.briefing.defaultWhy"),
    next:
      attention[0]?.metrics.find(
        (metric) => metric.status !== "optimal" && metric.status !== "no_data",
      )?.recommendation ?? t("copilot.briefing.defaultNext"),
    signals: [],
  };
}
