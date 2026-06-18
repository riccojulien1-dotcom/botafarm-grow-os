import Link from "next/link";

import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentDataSourceStrip } from "@/components/environment/environment-data-source-strip";
import { EnvironmentImportPlaceholder } from "@/components/environment/environment-import-placeholder";
import { EnvironmentFarmCopilot } from "@/components/environment/environment-room-copilot";
import { EnvironmentSupervisionShell } from "@/components/environment/environment-supervision-shell";
import { buildEnvironmentFarmBriefing } from "@/lib/copilot/build-operation-briefing";
import type { EnvironmentSupervisionData } from "@/lib/environment/get-environment-supervision-data";

type EnvironmentSupervisionViewProps = {
  data: EnvironmentSupervisionData;
};

export function EnvironmentSupervisionView({ data }: EnvironmentSupervisionViewProps) {
  const roomsNeedingAttention = data.rooms.filter(
    (room) => room.roomStatus === "action" || room.roomStatus === "watch",
  ).length;

  const farmBriefing = buildEnvironmentFarmBriefing(data.rooms);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          Mission Control
        </Link>
      </div>

      <BfPageHeader
        eyebrow="Environment"
        title="What is happening in each room right now?"
        subtitle="Every grow room on one page — current readings, trends, and what may need your attention."
      />

      {data.rooms.length ? (
        <>
          <EnvironmentFarmCopilot briefing={farmBriefing} />
          <EnvironmentSupervisionShell data={data} />
        </>
      ) : (
        <GlassPanel padding="md">
          <p className="text-sm text-zinc-500">
            Create a grow room and add journal logs to start tracking environment.
          </p>
        </GlassPanel>
      )}

      <section className="space-y-3 border-t border-white/[0.06] pt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
          Current conditions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryTile label="Grow rooms" value={String(data.rooms.length)} />
          <SummaryTile label="Rooms needing attention" value={String(roomsNeedingAttention)} />
          <SummaryTile label="Journal readings" value={String(data.totalLogs)} />
        </div>
      </section>

      <section className="space-y-3 border-t border-white/[0.06] pt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
          More tools
        </h2>
        <GlassPanel padding="md">
          <EnvironmentDataSourceStrip
            growerFriendly
            quality={{
              lastReadingAt: null,
              lastReadingLabel:
                data.totalLogs > 0 ? `${data.totalLogs} journal readings` : "No readings yet",
              recordCount: data.totalLogs,
              sourceLabel: "Manual Logs",
            }}
          />
        </GlassPanel>
        <EnvironmentImportPlaceholder />
      </section>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <GlassPanel padding="md">
      <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{label}</p>
    </GlassPanel>
  );
}
