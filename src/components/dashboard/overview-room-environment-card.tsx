import Link from "next/link";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentMetricsGrid } from "@/components/environment/environment-metrics-grid";
import type {
  DashboardRoomEnvironment,
  DashboardRoomEnvironmentStatus,
} from "@/lib/dashboard/build-room-environment-summaries";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type OverviewRoomEnvironmentCardProps = {
  environment: DashboardRoomEnvironment;
};

const statusStyles: Record<DashboardRoomEnvironmentStatus, string> = {
  good: "border-cyan-500/30 bg-cyan-950/30 text-cyan-300",
  watch: "border-amber-500/30 bg-amber-950/35 text-amber-100",
  action: "border-red-500/40 bg-red-950/40 text-red-300",
  insufficient_data: "border-zinc-600/80 bg-zinc-900/70 text-zinc-400",
};

export function OverviewRoomEnvironmentCard({ environment }: OverviewRoomEnvironmentCardProps) {
  return (
    <li>
      <GlassPanel
        glow={
          environment.status === "action"
            ? "red"
            : environment.status === "watch"
              ? "magenta"
              : "cyan"
        }
        padding="lg"
        className="w-full"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                {toTitleCase(environment.roomName)}
                <span className="mx-2 font-normal text-zinc-600">—</span>
                <span className="text-base font-semibold normal-case tracking-normal text-cyan-400/90 sm:text-lg">
                  Climate &amp; irrigation
                </span>
              </h3>
              {environment.hasJournalEntries && environment.lastLogFreshness ? (
                <p className="mt-1 text-xs text-zinc-500">
                  Last log:{" "}
                  <span className="text-zinc-400">{environment.lastLogFreshness}</span>
                </p>
              ) : null}
            </div>
            <EnvironmentStatusBadge
              status={environment.status}
              label={environment.statusLabel}
            />
          </div>

          {environment.hasJournalEntries ? (
            <EnvironmentMetricsGrid metrics={environment.metrics} variant="cockpit" />
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-black/20 px-5 py-8 text-center">
              <p className="text-sm text-zinc-500">No journal data yet</p>
              <Link
                href={`/rooms/${environment.roomId}`}
                className="mt-3 inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Add journal log
              </Link>
            </div>
          )}

          {environment.hasJournalEntries ? (
            <div className="flex justify-end border-t border-white/[0.06] pt-3">
              <Link
                href={`/rooms/${environment.roomId}`}
                className="text-xs font-medium text-cyan-400/90 transition hover:text-cyan-300"
              >
                View room journal →
              </Link>
            </div>
          ) : null}
        </div>
      </GlassPanel>
    </li>
  );
}

function EnvironmentStatusBadge({
  status,
  label,
}: {
  status: DashboardRoomEnvironmentStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-lg border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}
