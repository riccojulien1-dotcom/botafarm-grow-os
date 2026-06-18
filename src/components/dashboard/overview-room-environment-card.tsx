import Link from "next/link";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { supervisionRoomStatusStyles } from "@/components/environment/environment-status-styles";
import type { OverviewEnvironmentSummary } from "@/lib/environment/build-supervision-rooms";
import type { SupervisionRoomStatus } from "@/lib/environment/metric-insights";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type OverviewRoomEnvironmentCardProps = {
  environment: OverviewEnvironmentSummary;
};

export function OverviewRoomEnvironmentCard({ environment }: OverviewRoomEnvironmentCardProps) {
  return (
    <li>
      <GlassPanel
        glow={
          environment.status === "action"
            ? "red"
            : environment.status === "watch" || environment.status === "drift"
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
            {!environment.hasJournalEntries ? (
              <Link
                href={`/rooms/${environment.roomId}`}
                className="inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Add journal log
              </Link>
            ) : null}
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
  status: SupervisionRoomStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${supervisionRoomStatusStyles[status]}`}
    >
      {label}
    </span>
  );
}
