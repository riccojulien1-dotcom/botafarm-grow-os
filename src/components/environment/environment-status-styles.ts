import type { DashboardRoomEnvironmentStatus } from "@/lib/dashboard/build-room-environment-summaries";
import type {
  SupervisionMetricStatus,
  SupervisionRoomStatus,
} from "@/lib/environment/metric-insights";
import type { EnvironmentAlertSeverity } from "@/lib/environment/build-environment-alerts";

/** Shared with Overview environment cards for OS consistency */
export const roomEnvironmentStatusStyles: Record<DashboardRoomEnvironmentStatus, string> = {
  good: "border-emerald-500/35 bg-emerald-950/35 text-emerald-300",
  watch: "border-amber-500/30 bg-amber-950/35 text-amber-100",
  action: "border-red-500/40 bg-red-950/40 text-red-300",
  insufficient_data: "border-zinc-600/80 bg-zinc-900/70 text-zinc-400",
};

export const supervisionRoomStatusStyles: Record<SupervisionRoomStatus, string> = {
  good: roomEnvironmentStatusStyles.good,
  watch: roomEnvironmentStatusStyles.watch,
  drift: roomEnvironmentStatusStyles.watch,
  action: roomEnvironmentStatusStyles.action,
  no_data: roomEnvironmentStatusStyles.insufficient_data,
};

export const supervisionMetricStatusStyles: Record<SupervisionMetricStatus, string> = {
  optimal: "border-emerald-500/35 bg-emerald-950/35 text-emerald-300",
  watch: "border-amber-500/30 bg-amber-950/35 text-amber-100",
  drift: "border-amber-500/30 bg-amber-950/35 text-amber-100",
  action: "border-red-500/40 bg-red-950/40 text-red-300",
  no_data: "border-zinc-600/80 bg-zinc-900/70 text-zinc-400",
};

export const alertSeverityStyles: Record<EnvironmentAlertSeverity, string> = {
  action: "border-red-500/30 bg-red-950/25 hover:border-red-400/45",
  drift: "border-amber-500/30 bg-amber-950/20 hover:border-amber-400/45",
  watch: "border-amber-500/30 bg-amber-950/20 hover:border-amber-400/45",
  good: "border-emerald-500/25 bg-emerald-950/15 hover:border-emerald-400/35",
  no_data: "border-zinc-700/80 bg-zinc-900/40 hover:border-zinc-600",
};
