import Link from "next/link";

import { BfAreaChart } from "@/components/botafarm/bf-area-chart";
import { BfButton } from "@/components/botafarm/bf-button";
import { BfHealthScore } from "@/components/botafarm/bf-health-score";
import { BfMissionKpi } from "@/components/botafarm/bf-mission-kpi";
import { BfHarvestEventCard } from "@/components/botafarm/bf-harvest-event-card";
import { BfRoomStarMetrics } from "@/components/botafarm/bf-room-star-metrics";
import { BfStatTile } from "@/components/botafarm/bf-stat-tile";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { CommandCenterPriority } from "@/lib/dashboard/command-center-priorities";
import type { CommandCenterData, CommandCenterRoom } from "@/lib/dashboard/get-command-center-data";
import { formatHarvestCountdownLine } from "@/lib/ui/format-mission-labels";

type CommandCenterOverviewProps = {
  data: CommandCenterData;
};

function healthStatusLabel(status: CommandCenterData["healthStatus"]) {
  if (status === "stable") return "STABLE";
  if (status === "watch") return "WATCH";
  return "ATTENTION";
}

function severityRank(severity: string) {
  if (severity === "action") return 0;
  if (severity === "watch") return 1;
  return 2;
}

function priorityPresentation(item: CommandCenterPriority) {
  if (item.severity === "action") {
    return {
      tier: "Critique",
      tierClass: "border-red-500/50 bg-red-950/55 text-red-200",
      icon: "⚠",
      badge: "ACTION REQUIRED",
      badgeClass: "border-red-500/50 bg-red-950/60 text-red-200",
    };
  }
  return {
    tier: "Attention",
    tierClass: "border-amber-500/40 bg-amber-950/45 text-amber-100",
    icon: "◆",
    badge: null,
    badgeClass: "",
  };
}

export function CommandCenterOverview({ data }: CommandCenterOverviewProps) {
  const sortedRooms = [...data.rooms].sort(
    (left, right) => severityRank(left.severity) - severityRank(right.severity),
  );

  const heroHarvest = data.primaryHarvest
    ? formatHarvestCountdownLine(data.primaryHarvest.daysRemaining)
    : "NO HARVEST WINDOW SET";

  return (
    <div className="space-y-12 pb-6">
      {/* Mission Control Hero */}
      <section className="bf-mission-hero bf-atmosphere-deep px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_0%_0%,rgba(34,211,238,0.16),transparent_55%),radial-gradient(ellipse_65%_45%_at_100%_100%,rgba(232,121,249,0.12),transparent_50%)]" />
        <div className="relative space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="bf-section-eyebrow text-cyan-500/80">Botafarm California</p>
              <h1 className="bf-hero-display bf-gradient-text">GROW OS</h1>
              <p className="font-mono text-base uppercase tracking-[0.42em] text-zinc-300 sm:text-lg">
                Mission Control
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <BfButton href="/dashboard/grow-rooms" variant="primary">
                Grow rooms
              </BfButton>
              <BfButton href="/dashboard/journal" variant="secondary">
                Journal
              </BfButton>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BfMissionKpi
              value={data.base.totalPlantCount}
              label="Plants"
              accent="white"
            />
            <BfMissionKpi
              value={data.base.totalGrowRooms}
              label="Rooms"
              accent="cyan"
            />
            <BfMissionKpi
              value={data.taskOpen}
              label="Tasks"
              accent={data.taskOverdue > 0 ? "alert" : "white"}
            />
            <BfMissionKpi
              value={heroHarvest}
              label="Harvest window"
              accent="magenta"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Health Score — centerpiece */}
      <section className="space-y-4">
        <SectionHeader title="Garden health" />
        <BfHealthScore
          score={data.healthScore}
          statusLabel={healthStatusLabel(data.healthStatus)}
          actionCount={data.alertCounts.action}
          watchCount={data.alertCounts.watch}
          goodCount={data.alertCounts.good}
        />
      </section>

      {/* Quick ops metrics */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <BfStatTile label="Rooms" value={data.base.totalGrowRooms} accent="cyan" hero />
        <BfStatTile label="Plants" value={data.base.totalPlantCount} accent="neutral" hero />
        <BfStatTile
          label="Tasks"
          value={data.taskOpen}
          accent={data.taskOverdue > 0 ? "magenta" : "cyan"}
          trend={data.taskOverdue > 0 ? `${data.taskOverdue} overdue` : undefined}
          hero
        />
        <BfStatTile label="Logs" value={data.base.totalJournalLogs} accent="neutral" hero />
      </section>

      {/* Today's priorities */}
      <section className="space-y-4">
        <SectionHeader title="Today's priorities" subtitle="Critique · Attention" />
        <GlassPanel padding="lg" glow={data.priorities.some((p) => p.severity === "action") ? "red" : "none"}>
          {data.priorities.length ? (
            <ul className="space-y-3">
              {data.priorities.map((item) => {
                const presentation = priorityPresentation(item);
                return (
                  <li key={item.id}>
                    <Link
                      href={`/rooms/${item.roomId}`}
                      className={`bf-interactive block rounded-2xl border px-5 py-5 transition sm:px-6 ${
                        item.severity === "action"
                          ? "border-red-500/35 bg-red-950/25 hover:border-red-400/50"
                          : "border-white/[0.06] bg-black/25 hover:border-amber-500/30"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <span
                          className={`rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${presentation.tierClass}`}
                        >
                          {presentation.tier}
                        </span>
                        {presentation.badge ? (
                          <span
                            className={`rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${presentation.badgeClass}`}
                          >
                            {presentation.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-4 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                        <span className="mr-2 opacity-90">{presentation.icon}</span>
                        {item.title}
                      </p>
                      <p className="mt-2 font-mono text-sm uppercase tracking-[0.22em] text-fuchsia-400/90">
                        {item.roomName}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-6 py-8 text-center text-sm text-emerald-300">
              No urgent priorities — operation is on track.
            </p>
          )}
        </GlassPanel>
      </section>

      {/* Harvest event */}
      {data.primaryHarvest ? (
        <section className="space-y-4">
          <SectionHeader title="Harvest event" subtitle="Facility priority" />
          <Link href={`/rooms/${data.primaryHarvest.roomId}`} className="block">
            <GlassPanel
              glow="magenta"
              padding="lg"
              interactive
              className="bf-atmosphere-deep bf-lab-scan !p-6 sm:!p-8"
            >
              <BfHarvestEventCard harvest={data.primaryHarvest} />
            </GlassPanel>
          </Link>
        </section>
      ) : null}

      {/* Environmental trends */}
      <section className="space-y-4">
        <SectionHeader title="Environmental trends" subtitle="Recent journal logs" />
        <GlassPanel glow="cyan" padding="lg" interactive className="bf-atmosphere-deep">
          <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-4">
            <EnvChart
              title="Temperature"
              data={data.envTrend.temp}
              labels={data.envTrend.labels}
              accent="cyan"
              latestValue={
                data.base.latestTemperature != null
                  ? String(data.base.latestTemperature)
                  : null
              }
              unit="°C"
            />
            <EnvChart
              title="Humidity"
              data={data.envTrend.humidity}
              labels={data.envTrend.labels}
              accent="magenta"
              latestValue={
                data.base.latestHumidity != null ? String(data.base.latestHumidity) : null
              }
              unit="%"
            />
            <EnvChart
              title="EC in"
              data={data.envTrend.ec}
              labels={data.envTrend.labels}
              accent="cyan"
              latestValue={data.base.latestEc != null ? String(data.base.latestEc) : null}
            />
            <EnvChart
              title="VPD"
              data={data.envTrend.vpd}
              labels={data.envTrend.labels}
              accent="magenta"
              latestValue={
                data.envTrend.vpd.length ? String(data.envTrend.vpd.at(-1)) : null
              }
              unit="kPa"
            />
          </div>
        </GlassPanel>
      </section>

      {/* Room stars */}
      <section className="space-y-4">
        <SectionHeader title="Active zones" subtitle="Lifecycle priority" />
        <div className="space-y-4">
          {sortedRooms.map((room) => (
            <RoomStarCard key={room.id} room={room} />
          ))}
          {!data.rooms.length ? (
            <GlassPanel padding="lg">
              <p className="text-sm text-zinc-500">
                Deploy your first grow room to see cycle progress here.
              </p>
              <BfButton href="/dashboard/grow-rooms" variant="primary" className="mt-4">
                Open grow rooms
              </BfButton>
            </GlassPanel>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle ? <span className="bf-section-eyebrow">{subtitle}</span> : null}
    </div>
  );
}

function EnvChart({
  title,
  data,
  labels,
  accent,
  latestValue,
  unit,
}: {
  title: string;
  data: number[];
  labels: string[];
  accent: "cyan" | "magenta";
  latestValue: string | null;
  unit?: string;
}) {
  return (
    <div className="bf-interactive rounded-xl p-2 transition">
      <p
        className={`mb-4 font-mono text-xs uppercase tracking-[0.22em] ${
          accent === "cyan" ? "text-cyan-400/90" : "text-fuchsia-400/90"
        }`}
      >
        {title}
      </p>
      <BfAreaChart
        data={data}
        labels={labels}
        accent={accent}
        width={280}
        height={96}
        latestValue={latestValue}
        unit={unit}
      />
    </div>
  );
}

function RoomStarCard({ room }: { room: CommandCenterRoom }) {
  const daysLeft =
    room.daysRemaining != null ? Math.max(room.daysRemaining, 0) : null;

  return (
    <Link href={`/rooms/${room.id}`} className="block">
      <GlassPanel
        glow={
          room.severity === "action" ? "red" : room.severity === "watch" ? "magenta" : "cyan"
        }
        padding="lg"
        interactive
        className="bf-atmosphere-deep bf-lab-scan"
      >
        <BfRoomStarMetrics
          status={room.status}
          roomName={room.name}
          showRoomName
          cultivarName={room.cultivarName}
          genetics={room.genetics}
          varietyCount={room.varietyCount}
          currentDay={room.currentDay}
          targetCycleDays={room.targetCycleDays}
          daysLeft={daysLeft}
          plantCount={room.plantCount}
          harvestDate={room.harvestDateLabel}
          phaseLabel={room.phaseLabel}
          progressPercent={room.progressPercent}
          actionLabel={room.actionRequired}
        />
      </GlassPanel>
    </Link>
  );
}
