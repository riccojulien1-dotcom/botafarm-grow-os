import Link from "next/link";

import { BfAreaChart } from "@/components/botafarm/bf-area-chart";
import { BfButton } from "@/components/botafarm/bf-button";
import { BfCultivarSpotlight } from "@/components/botafarm/bf-cultivar-spotlight";
import { BfGeneticsOverview } from "@/components/botafarm/bf-genetics-overview";
import { BfHealthScore } from "@/components/botafarm/bf-health-score";
import { BfMissionKpi } from "@/components/botafarm/bf-mission-kpi";
import { BfRoomStarMetrics } from "@/components/botafarm/bf-room-star-metrics";
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

function pickSpotlightRoom(data: CommandCenterData): CommandCenterRoom | null {
  if (data.primaryHarvest) {
    const match = data.rooms.find((room) => room.id === data.primaryHarvest?.roomId);
    if (match) return match;
  }
  return data.rooms.find((room) => room.cultivarName) ?? data.rooms[0] ?? null;
}

function priorityTone(item: CommandCenterPriority) {
  if (item.severity === "action") {
    return {
      label: "Urgent",
      rowClass: "border-red-500/25 bg-red-950/20 hover:border-red-400/40",
      labelClass: "border-red-500/30 bg-red-950/40 text-red-200/90",
    };
  }
  return {
    label: "Review",
    rowClass: "border-white/[0.06] bg-black/20 hover:border-amber-500/25",
    labelClass: "border-amber-500/25 bg-amber-950/35 text-amber-100/90",
  };
}

export function CommandCenterOverview({ data }: CommandCenterOverviewProps) {
  const sortedRooms = [...data.rooms].sort(
    (left, right) => severityRank(left.severity) - severityRank(right.severity),
  );
  const spotlightRoom = pickSpotlightRoom(data);

  const heroHarvest = data.primaryHarvest
    ? formatHarvestCountdownLine(data.primaryHarvest.daysRemaining)
    : "No harvest window set";

  return (
    <div className="space-y-6 pb-4">
      {/* Hero — compact */}
      <section className="bf-mission-hero bf-atmosphere-deep px-5 py-7 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_0%_0%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(ellipse_65%_45%_at_100%_100%,rgba(232,121,249,0.1),transparent_50%)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="bf-section-eyebrow text-cyan-500/80">Botafarm California</p>
              <h1 className="bf-hero-display bf-gradient-text text-[clamp(2.5rem,8vw,5.5rem)]">
                GROW OS
              </h1>
              <p className="font-mono text-sm uppercase tracking-[0.38em] text-zinc-400">
                Cultivar command center
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <BfMissionKpi value={data.base.totalPlantCount} label="Plants" accent="white" />
            <BfMissionKpi value={data.base.totalGrowRooms} label="Rooms" accent="cyan" />
            <BfMissionKpi
              value={data.taskOpen}
              label="Tasks"
              accent={data.taskOverdue > 0 ? "alert" : "white"}
            />
            <BfMissionKpi value={heroHarvest} label="Harvest" accent="magenta" multiline />
          </div>
        </div>
      </section>

      {/* Cultivar spotlight + compact health */}
      <section className="grid gap-4 lg:grid-cols-[1.65fr_1fr] lg:items-stretch">
        {spotlightRoom ? (
          <BfCultivarSpotlight
            cultivarName={spotlightRoom.cultivarName ?? spotlightRoom.nextVarietyName ?? spotlightRoom.name}
            genetics={spotlightRoom.genetics}
            phaseLabel={spotlightRoom.phaseLabel}
            daysRemaining={spotlightRoom.daysRemaining}
            harvestDateLabel={spotlightRoom.harvestDateLabel}
            progressPercent={spotlightRoom.progressPercent}
            roomHref={`/rooms/${spotlightRoom.id}`}
          />
        ) : (
          <GlassPanel padding="md">
            <p className="text-sm text-zinc-500">Assign a cultivar to a room to activate spotlight.</p>
          </GlassPanel>
        )}

        <BfHealthScore
          score={data.healthScore}
          statusLabel={healthStatusLabel(data.healthStatus)}
          actionCount={data.alertCounts.action}
          watchCount={data.alertCounts.watch}
          goodCount={data.alertCounts.good}
          compact
        />
      </section>

      {/* Genetics datasheet */}
      {spotlightRoom ? (
        <BfGeneticsOverview
          cultivarName={spotlightRoom.cultivarName}
          genetics={spotlightRoom.genetics}
          roomName={spotlightRoom.name}
          roomStatus={spotlightRoom.status}
          plantCount={spotlightRoom.plantCount}
        />
      ) : null}

      {/* Priorities + environment */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-3">
          <SectionHeader title="Cultivation notes" subtitle="Today" compact />
          <GlassPanel padding="md" glow={data.priorities.some((p) => p.severity === "action") ? "red" : "none"}>
            {data.priorities.length ? (
              <ul className="divide-y divide-white/[0.06]">
                {data.priorities.map((item) => {
                  const tone = priorityTone(item);
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/rooms/${item.roomId}`}
                        className={`bf-interactive -mx-1 block rounded-xl border px-4 py-3.5 transition ${tone.rowClass}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone.labelClass}`}
                          >
                            {tone.label}
                          </span>
                          <span className="text-xs text-zinc-500">{item.roomName}</span>
                        </div>
                        <p className="mt-2 text-base font-semibold leading-snug text-zinc-100">
                          {item.title}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-emerald-300/90">
                No urgent cultivation notes — operation is on track.
              </p>
            )}
          </GlassPanel>
        </div>

        <div className="space-y-3">
          <SectionHeader title="Environment" subtitle="Recent logs" compact />
          <GlassPanel glow="cyan" padding="md" className="bf-atmosphere-deep">
            <div className="grid gap-6 sm:grid-cols-2">
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
        </div>
      </section>

      {/* Active zones — dense grid */}
      <section className="space-y-3">
        <SectionHeader title="Active zones" subtitle={`${sortedRooms.length} rooms`} compact />
        {sortedRooms.length ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {sortedRooms.map((room) => (
              <RoomStarCard key={room.id} room={room} />
            ))}
          </ul>
        ) : (
          <GlassPanel padding="md">
            <p className="text-sm text-zinc-500">Deploy your first grow room to begin tracking cultivars.</p>
            <BfButton href="/dashboard/grow-rooms" variant="primary" className="mt-3">
              Open grow rooms
            </BfButton>
          </GlassPanel>
        )}
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  compact,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2
        className={`font-bold uppercase tracking-tight text-white ${
          compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
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
    <div>
      <p
        className={`mb-2 font-mono text-[10px] uppercase tracking-[0.2em] ${
          accent === "cyan" ? "text-cyan-400/90" : "text-fuchsia-400/90"
        }`}
      >
        {title}
      </p>
      <BfAreaChart
        data={data}
        labels={labels}
        accent={accent}
        width={240}
        height={72}
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
    <li>
      <Link href={`/rooms/${room.id}`} className="block h-full">
        <GlassPanel
          glow={
            room.severity === "action" ? "red" : room.severity === "watch" ? "magenta" : "none"
          }
          padding="md"
          interactive
          className="h-full"
        >
          <BfRoomStarMetrics
            status={room.status}
            roomName={room.name}
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
            compact
          />
        </GlassPanel>
      </Link>
    </li>
  );
}
