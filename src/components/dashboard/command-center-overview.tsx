import Link from "next/link";

import { BfButton } from "@/components/botafarm/bf-button";
import { BfHeading } from "@/components/botafarm/bf-heading";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import { BfProgressRing } from "@/components/botafarm/bf-progress-ring";
import { BfSparkline } from "@/components/botafarm/bf-sparkline";
import { BfStatTile } from "@/components/botafarm/bf-stat-tile";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import type { CommandCenterData } from "@/lib/dashboard/get-command-center-data";

type CommandCenterOverviewProps = {
  data: CommandCenterData;
};

function severityRank(severity: string) {
  if (severity === "action") return 0;
  if (severity === "watch") return 1;
  return 2;
}

export function CommandCenterOverview({ data }: CommandCenterOverviewProps) {
  const sortedRooms = [...data.rooms].sort(
    (left, right) => severityRank(left.severity) - severityRank(right.severity),
  );
  const alertRooms = sortedRooms.filter((room) => room.severity !== "good");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <BfHeading
          eyebrow="Botafarm Grow OS"
          title="Command Center"
          subtitle="Garden health, alerts, tasks, and harvest windows at a glance."
        />
        <div className="flex flex-wrap gap-2">
          <BfButton href="/dashboard/grow-rooms" variant="primary">
            Grow rooms
          </BfButton>
          <BfButton href="/dashboard/journal" variant="secondary">
            Journal
          </BfButton>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-12">
        <GlassPanel glow="cyan" className="lg:col-span-4" padding="lg">
          <div className="flex items-center gap-6">
            <BfProgressRing
              value={data.healthScore}
              label="Health"
              accent="cyan"
              size={100}
            />
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
                Garden status
              </p>
              <p className="text-2xl font-bold text-white">
                {data.healthScore >= 80
                  ? "Stable"
                  : data.healthScore >= 50
                    ? "Watch"
                    : "Attention"}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded border border-red-500/30 bg-red-950/40 px-2 py-0.5 text-red-300">
                  {data.alertCounts.action} action
                </span>
                <span className="rounded border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 text-amber-200">
                  {data.alertCounts.watch} watch
                </span>
                <span className="rounded border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-emerald-300">
                  {data.alertCounts.good} good
                </span>
              </div>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          <BfStatTile
            label="Rooms"
            value={data.base.totalGrowRooms}
            accent="cyan"
            compact
          />
          <BfStatTile
            label="Plants"
            value={data.base.totalPlantCount}
            accent="neutral"
            compact
          />
          <BfStatTile
            label="Open tasks"
            value={data.taskOpen}
            accent={data.taskOverdue > 0 ? "alert" : "magenta"}
            trend={data.taskOverdue > 0 ? `${data.taskOverdue} overdue` : undefined}
            compact
          />
          <BfStatTile
            label="Journal logs"
            value={data.base.totalJournalLogs}
            accent="neutral"
            compact
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              Environmental trends
            </h2>
            <span className="text-xs text-zinc-600">Recent logs</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-medium text-cyan-400/90">EC in</p>
              <BfSparkline
                data={data.envTrend.ec}
                labels={data.envTrend.labels}
                accent="cyan"
                width={180}
              />
              <p className="mt-2 font-mono text-lg text-white">
                {data.base.latestEc ?? "—"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-fuchsia-400/90">VPD</p>
              <BfSparkline
                data={data.envTrend.vpd}
                labels={data.envTrend.labels}
                accent="magenta"
                width={180}
              />
              <p className="mt-2 font-mono text-lg text-white">
                {data.envTrend.vpd.length
                  ? `${data.envTrend.vpd.at(-1)} kPa`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-cyan-400/90">Temperature</p>
              <BfSparkline
                data={data.envTrend.temp}
                labels={data.envTrend.labels}
                accent="cyan"
                width={180}
              />
              <p className="mt-2 font-mono text-lg text-white">
                {data.base.latestTemperature != null
                  ? `${data.base.latestTemperature}°C`
                  : "—"}
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel glow="magenta" padding="lg">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Harvest radar
          </h2>
          {data.harvestPreviews.length ? (
            <ul className="mt-4 space-y-3">
              {data.harvestPreviews.map((entry) => (
                <li key={entry.roomId}>
                  <Link
                    href={`/rooms/${entry.roomId}`}
                    className="block rounded-lg border border-white/5 bg-black/30 p-3 transition hover:border-fuchsia-500/30"
                  >
                    <p className="font-medium text-white">{entry.roomName}</p>
                    <p className="mt-1 text-xs text-fuchsia-300/90">{entry.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-zinc-500">No flower harvest windows set yet.</p>
          )}
        </GlassPanel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassPanel padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              Active alerts
            </h2>
            <span className="text-xs text-zinc-600">{alertRooms.length} rooms</span>
          </div>
          {alertRooms.length ? (
            <ul className="space-y-2">
              {alertRooms.slice(0, 6).map((room) => (
                <li key={room.id}>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/25 px-4 py-3 transition hover:border-cyan-500/25"
                  >
                    <div>
                      <p className="font-medium text-white">{room.name}</p>
                      <p className="text-xs text-zinc-500">
                        {room.activeRecommendations} alert
                        {room.activeRecommendations === 1 ? "" : "s"}
                        {room.overdueTasks > 0
                          ? ` · ${room.overdueTasks} overdue task`
                          : ""}
                      </p>
                    </div>
                    <RecommendationStatusBadge severity={room.severity} compact />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-6 text-sm text-emerald-300">
              All monitored rooms look good.
            </p>
          )}
        </GlassPanel>

        <GlassPanel padding="lg">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Room operations
          </h2>
          <ul className="mt-4 space-y-3">
            {sortedRooms.slice(0, 6).map((room) => (
              <li key={room.id}>
                <Link
                  href={`/rooms/${room.id}`}
                  className="block space-y-2 rounded-xl border border-white/5 bg-black/25 p-3 transition hover:border-fuchsia-500/20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-zinc-100">{room.name}</span>
                    <span className="text-xs text-zinc-500">{room.status}</span>
                  </div>
                  <BfProgressBar
                    value={
                      room.severity === "good"
                        ? 100
                        : room.severity === "watch"
                          ? 55
                          : 25
                    }
                    accent={
                      room.severity === "action"
                        ? "alert"
                        : room.severity === "watch"
                          ? "magenta"
                          : "cyan"
                    }
                    showValue={false}
                  />
                  <p className="text-xs text-zinc-500">
                    {room.plantCount} plants · {room.openTasks} open tasks
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          {sortedRooms.length > 6 ? (
            <Link
              href="/dashboard/grow-rooms"
              className="mt-4 block text-center text-sm text-cyan-400 hover:text-cyan-300"
            >
              View all rooms →
            </Link>
          ) : null}
        </GlassPanel>
      </section>
    </div>
  );
}
