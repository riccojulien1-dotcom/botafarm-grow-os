import { resolveLogDate } from "@/lib/journal/build-chart-series";
import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";
import {
  JOURNAL_V1_METRICS,
  type JournalAnalysisBundle,
  type JournalAnalysisSeries,
  type JournalV1MetricKey,
} from "@/lib/journal/journal-types";

/** Builds per-room time series for future Botafarm AI analysis. */
export function buildJournalAnalysisBundle(
  roomId: string,
  roomName: string,
  logs: DailyLogRecord[],
): JournalAnalysisBundle {
  const sorted = logs
    .slice()
    .sort((left, right) => resolveLogDate(left).localeCompare(resolveLogDate(right)));

  const series: JournalAnalysisSeries[] = JOURNAL_V1_METRICS.map((metric) => ({
    roomId,
    roomName,
    metric: metric.key,
    points: sorted
      .map((log) => {
        const value = log[metric.key as JournalV1MetricKey] as number | null;
        if (value == null) {
          return null;
        }
        return { date: resolveLogDate(log), value };
      })
      .filter((point): point is { date: string; value: number } => point !== null),
  }));

  return {
    roomId,
    roomName,
    logs: sorted.map((log) => ({
      log_date: resolveLogDate(log),
      logged_at: log.logged_at,
      temperature: log.temperature,
      humidity: log.humidity,
      vpd: log.vpd,
      ec_in: log.ec_in,
      ph_in: log.ph_in,
      ec_runoff: log.ec_runoff,
      ph_runoff: log.ph_runoff,
      irrigation_volume_per_event: log.irrigation_volume_per_event,
      dryback_percent: log.dryback_percent,
      notes: log.notes,
    })),
    series,
  };
}
