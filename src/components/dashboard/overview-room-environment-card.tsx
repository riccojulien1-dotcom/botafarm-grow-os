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
  good: "border-emerald-500/35 bg-emerald-950/35 text-emerald-300",
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
        padding="md"
        className="w-full"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white">
              {toTitleCase(environment.roomName)}
            </h3>
            {environment.attentionReason ? (
              <p className="text-sm leading-snug text-zinc-300">{environment.attentionReason}</p>
            ) : null}
            {environment.hasJournalEntries ? (
              <div className="flex flex-wrap gap-3 text-sm tabular-nums text-zinc-400">
                {environment.temperatureReading ? (
                  <span>
                    Temp <span className="font-semibold text-white">{environment.temperatureReading}</span>
                  </span>
                ) : null}
                {environment.humidityReading ? (
                  <span>
                    RH <span className="font-semibold text-white">{environment.humidityReading}</span>
                  </span>
                ) : null}
              </div>
            ) : (
              <Link
                href={`/rooms/${environment.roomId}`}
                className="inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Add journal log
              </Link>
            )}
          </div>

          <EnvironmentStatusBadge status={environment.status} label={environment.statusLabel} />
        </div>

        {environment.hasJournalEntries ? (
          <div className="mt-4 flex justify-end border-t border-white/[0.06] pt-3">
            <Link
              href={`/dashboard/environment#room-env-${environment.roomId}`}
              className="text-xs font-medium text-cyan-400/90 transition hover:text-cyan-300"
            >
              Open climate analysis →
            </Link>
          </div>
        ) : null}
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
      className={`inline-flex shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}
