import Link from "next/link";

import { GlassPanel } from "@/components/botafarm/glass-panel";
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
        glow={environment.status === "action" ? "red" : environment.status === "watch" ? "magenta" : "cyan"}
        padding="md"
        className="h-full"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                {toTitleCase(environment.roomName)}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-500/80">
                Climate &amp; irrigation
              </p>
            </div>
            <EnvironmentStatusBadge
              status={environment.status}
              label={environment.statusLabel}
            />
          </div>

          {environment.hasLog ? (
            <div className="space-y-2 text-sm text-zinc-300">
              {environment.climateLine ? <p>{environment.climateLine}</p> : null}
              {environment.ecLine ? <p>{environment.ecLine}</p> : null}
              {environment.phLine ? <p>{environment.phLine}</p> : null}
              {environment.lastLogFreshness ? (
                <p className="text-xs text-zinc-500">
                  Last log: <span className="text-zinc-400">{environment.lastLogFreshness}</span>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-4">
              <p className="text-sm text-zinc-500">No journal data yet</p>
              <Link
                href={`/rooms/${environment.roomId}`}
                className="inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Add journal log
              </Link>
            </div>
          )}

          {environment.hasLog ? (
            <Link
              href={`/rooms/${environment.roomId}`}
              className="inline-flex text-xs font-medium text-cyan-400/90 transition hover:text-cyan-300"
            >
              View room journal →
            </Link>
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
