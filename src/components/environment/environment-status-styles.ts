import type {
  SupervisionMetricStatus,
  SupervisionRoomStatus,
} from "@/lib/environment/metric-insights";
import type { EnvironmentAlertSeverity } from "@/lib/environment/build-environment-alerts";

const baseRoomStatusStyles = {
  good: "border-emerald-500/35 bg-emerald-950/35 text-emerald-300",
  watch: "border-amber-500/30 bg-amber-950/35 text-amber-100",
  action: "border-red-500/40 bg-red-950/40 text-red-300",
  noData: "border-zinc-600/80 bg-zinc-900/70 text-zinc-400",
} as const;

export const supervisionRoomStatusStyles: Record<SupervisionRoomStatus, string> = {
  good: baseRoomStatusStyles.good,
  watch: baseRoomStatusStyles.watch,
  drift: baseRoomStatusStyles.watch,
  action: baseRoomStatusStyles.action,
  no_data: baseRoomStatusStyles.noData,
};

export const supervisionMetricStatusStyles: Record<SupervisionMetricStatus, string> = {
  optimal: baseRoomStatusStyles.good,
  watch: baseRoomStatusStyles.watch,
  drift: baseRoomStatusStyles.watch,
  action: baseRoomStatusStyles.action,
  no_data: baseRoomStatusStyles.noData,
};

export const alertSeverityStyles: Record<EnvironmentAlertSeverity, string> = {
  action: "border-red-500/30 bg-red-950/25 hover:border-red-400/45",
  drift: "border-amber-500/30 bg-amber-950/20 hover:border-amber-400/45",
  watch: "border-amber-500/30 bg-amber-950/20 hover:border-amber-400/45",
  good: "border-emerald-500/25 bg-emerald-950/15 hover:border-emerald-400/35",
  no_data: "border-zinc-700/80 bg-zinc-900/40 hover:border-zinc-600",
};
