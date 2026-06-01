import Link from "next/link";

import { BfAreaChart } from "@/components/botafarm/bf-area-chart";
import { BfButton } from "@/components/botafarm/bf-button";
import { BfProgressBar } from "@/components/botafarm/bf-progress-bar";
import { BfProgressRing } from "@/components/botafarm/bf-progress-ring";
import { BfStatTile } from "@/components/botafarm/bf-stat-tile";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { RecommendationStatusBadge } from "@/components/recommendations/recommendation-status-badge";
import type { CommandCenterData, CommandCenterRoom } from "@/lib/dashboard/get-command-center-data";

type CommandCenterOverviewProps = {
  data: CommandCenterData;
};

function healthAccent(data: CommandCenterData): "healthy" | "cyan" | "magenta" {
  if (data.healthScore >= 80) return "healthy";
  if (data.healthScore >= 50) return "cyan";
  return "magenta";
}

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

function pickLeadRoom(rooms: CommandCenterRoom[]) {
  const flower = rooms.filter((room) => room.status === "Flower");
  const pool = flower.length ? flower : rooms;
  return [...pool].sort(
    (left, right) => severityRank(left.severity) - severityRank(right.severity),
  )[0];
}

export function CommandCenterOverview({ data }: CommandCenterOverviewProps) {
  const leadRoom = pickLeadRoom(data.rooms);
  const sortedRooms = [...data.rooms].sort(
    (left, right) => severityRank(left.severity) - severityRank(right.severity),
  );

  const heroHarvestLine = data.primaryHarvest
    ? `NEXT HARVEST IN ${data.primaryHarvest.daysRemaining} DAYS`
    : "NO HARVEST WINDOW SET";

  return (
    <div className="space-y-10 pb-4">
      {/* 1 — Hero */}
      <section className="bf-atmosphere-deep overflow-hidden rounded-3xl border border-white/[0.07] bg-black/40 px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_0%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(232,121,249,0.1),transparent_50%)]" />
        <div className="relative space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="bf-section-eyebrow text-cyan-500/80">Botafarm</p>
              <h1 className="bf-hero-display bf-gradient-text">GROW OS</h1>
              <p className="font-mono text-sm uppercase tracking-[0.35em] text-zinc-400 sm:text-base">
                Your garden today
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

          <div className="grid gap-6 border-t border-white/[0.06] pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="bf-section-eyebrow">Plants</p>
              <p className="bf-hero-stat mt-2 text-white">{data.base.totalPlantCount}</p>
            </div>
            <div>
              <p className="bf-section-eyebrow">Rooms</p>
              <p className="bf-hero-stat mt-2 text-cyan-300">{data.base.totalGrowRooms}</p>
            </div>
            <div>
              <p className="bf-section-eyebrow">Open tasks</p>
              <p
                className={`bf-hero-stat mt-2 ${
                  data.taskOverdue > 0 ? "text-fuchsia-300" : "text-white"
                }`}
              >
                {data.taskOpen}
              </p>
            </div>
            <div>
              <p className="bf-section-eyebrow">Harvest</p>
              <p className="mt-2 text-xl font-bold uppercase leading-tight tracking-tight text-fuchsia-300 sm:text-2xl lg:text-3xl">
                {heroHarvestLine}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Garden health (dominant) */}
      <section>
        <GlassPanel glow="cyan" padding="lg" className="bf-atmosphere-deep !p-8 sm:!p-10">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
            <BfProgressRing
              value={data.healthScore}
              size={200}
              strokeWidth={10}
              label="HEALTH SCORE"
              sublabel={healthStatusLabel(data.healthStatus)}
              accent={healthAccent(data)}
              showPercent={false}
            />
            <div className="max-w-md space-y-6 text-center lg:text-left">
              <p className="bf-section-eyebrow text-cyan-500/70">Garden health</p>
              <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {healthStatusLabel(data.healthStatus)}
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <HealthPill count={data.alertCounts.action} label="ACTION" tone="alert" />
                <HealthPill count={data.alertCounts.watch} label="WATCH" tone="watch" />
                <HealthPill count={data.alertCounts.good} label="GOOD" tone="good" />
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* 3 — Big numbers */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
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

      {/* 4 — Today's priorities */}
      <section className="space-y-4">
        <SectionHeader title="Today's priorities" />
        <GlassPanel padding="lg">
          {data.priorities.length ? (
            <ul className="divide-y divide-white/[0.06]">
              {data.priorities.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/rooms/${item.roomId}`}
                    className="group flex flex-col gap-1 py-5 transition first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-lg font-bold uppercase tracking-tight text-white transition group-hover:text-cyan-200 sm:text-xl">
                      {item.title}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-400/90">
                      {item.roomName}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-emerald-300/90">
              No urgent priorities — operation is on track.
            </p>
          )}
        </GlassPanel>
      </section>

      {/* 5 — Harvest countdown */}
      {data.primaryHarvest ? (
        <section className="space-y-4">
          <SectionHeader title="Harvest countdown" />
          <Link href={`/rooms/${data.primaryHarvest.roomId}`} className="block">
            <GlassPanel
              glow="magenta"
              padding="lg"
              className="bf-atmosphere-deep transition hover:border-fuchsia-500/40"
            >
              <p className="bf-section-eyebrow text-fuchsia-400/80">Next harvest</p>
              <p className="mt-3 text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                {data.primaryHarvest.varietyName}
              </p>
              <p className="bf-hero-display mt-4 text-fuchsia-300">
                {data.primaryHarvest.daysRemaining}
                <span className="ml-3 text-2xl font-bold uppercase tracking-[0.12em] text-fuchsia-400/80 sm:text-3xl">
                  days
                </span>
              </p>
              <p className="mt-4 font-mono text-lg uppercase tracking-[0.25em] text-zinc-300">
                {data.primaryHarvest.dateLabel}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{data.primaryHarvest.roomName}</p>
            </GlassPanel>
          </Link>
        </section>
      ) : null}

      {/* 6 — Environmental trends */}
      <section className="space-y-4">
        <SectionHeader title="Environmental trends" subtitle="Recent journal logs" />
        <GlassPanel glow="cyan" padding="lg" className="bf-atmosphere-deep">
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

      {/* 7 — Room progress */}
      <section className="space-y-4">
        <SectionHeader title="Rooms" subtitle="Lifecycle at a glance" />
        <div className="space-y-4">
          {leadRoom ? (
            <RoomProgressCard room={leadRoom} featured />
          ) : null}
          {sortedRooms
            .filter((room) => room.id !== leadRoom?.id)
            .map((room) => (
              <RoomProgressCard key={room.id} room={room} />
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
      <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
      {subtitle ? <span className="bf-section-eyebrow">{subtitle}</span> : null}
    </div>
  );
}

function HealthPill({
  count,
  label,
  tone,
}: {
  count: number;
  label: string;
  tone: "alert" | "watch" | "good";
}) {
  const styles = {
    alert: "border-red-500/40 bg-red-950/50 text-red-200",
    watch: "border-amber-500/35 bg-amber-950/40 text-amber-100",
    good: "border-emerald-500/35 bg-emerald-950/40 text-emerald-200",
  };

  return (
    <span
      className={`rounded-lg border px-4 py-2 font-mono text-sm tabular-nums ${styles[tone]}`}
    >
      <span className="text-lg font-bold">{count}</span>{" "}
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </span>
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

function RoomProgressCard({
  room,
  featured = false,
}: {
  room: CommandCenterRoom;
  featured?: boolean;
}) {
  const daysLeft =
    room.daysRemaining != null ? Math.max(room.daysRemaining, 0) : null;
  const dayLine =
    room.currentDay != null && room.targetCycleDays != null
      ? `DAY ${room.currentDay} OF ${room.targetCycleDays}`
      : room.currentDay != null
        ? `DAY ${room.currentDay}`
        : "CYCLE NOT SET";

  return (
    <Link href={`/rooms/${room.id}`} className="block">
      <GlassPanel
        glow={room.severity === "action" ? "magenta" : featured ? "cyan" : "none"}
        padding="lg"
        className={`transition hover:border-cyan-500/25 ${featured ? "bf-atmosphere-deep" : ""}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="bf-section-eyebrow">{room.status} room</p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
              {room.name}
            </h3>
          </div>
          <RecommendationStatusBadge severity={room.severity} compact />
        </div>

        <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-cyan-400/90">
          {dayLine}
        </p>

        {room.progressPercent != null ? (
          <div className="mt-6 space-y-3">
            <BfProgressBar
              value={room.progressPercent}
              accent="magenta"
              showValue={false}
              size="large"
            />
            <div className="flex flex-wrap items-end justify-between gap-4">
              {daysLeft != null ? (
                <p className="text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                  {daysLeft}
                  <span className="ml-3 text-lg font-medium text-zinc-400">days left</span>
                </p>
              ) : null}
              {room.progressPercent != null ? (
                <p className="font-mono text-sm tabular-nums text-zinc-600">
                  {room.progressPercent}% cycle
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RoomMetric label="Current phase" value={room.phaseLabel} />
          <RoomMetric
            label="Next harvest"
            value={room.harvestDateLabel ?? "—"}
            accent="magenta"
          />
          <RoomMetric label="Plants" value={String(room.plantCount)} />
          {room.actionRequired ? (
            <RoomMetric label="Action" value={room.actionRequired} accent="alert" />
          ) : (
            <RoomMetric label="Tasks open" value={String(room.openTasks)} />
          )}
        </div>
      </GlassPanel>
    </Link>
  );
}

function RoomMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "magenta" | "alert";
}) {
  const valueClass =
    accent === "magenta"
      ? "text-fuchsia-300"
      : accent === "alert"
        ? "text-red-300"
        : "text-white";

  return (
    <div>
      <p className="bf-section-eyebrow">{label}</p>
      <p className={`mt-2 text-sm font-bold uppercase tracking-wide sm:text-base ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
