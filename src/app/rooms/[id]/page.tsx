import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { RoomJournalCharts } from "@/components/analytics/room-journal-charts";
import { RoomRecommendationsPanel } from "@/components/recommendations/room-recommendations-panel";
import { formatLogDateLabel } from "@/lib/recommendations/latest-log-by-room";
import { CreateRoomDailyLogForm } from "@/components/journal/create-room-daily-log-form";
import { RoomDailyLogsList } from "@/components/journal/room-daily-logs-list";
import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";
import { CropTimelineSection } from "@/components/grow-rooms/crop-timeline-section";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { RoomDetailManagement } from "@/components/grow-rooms/room-detail-management";
import { RoomTasksSection } from "@/components/tasks/room-tasks-section";
import { RoomVarietiesSection } from "@/components/varieties/room-varieties-section";
import { BfRoomStarMetrics } from "@/components/botafarm/bf-room-star-metrics";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import {
  getCropCycleEngine,
  getCurrentCycleDay,
  getNextHarvestPreview,
} from "@/lib/grow-rooms/crop-cycle";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { requireUser } from "@/lib/auth/get-user";
import { toVarietyForHarvest } from "@/lib/varieties/intelligence";
import { ROOM_VARIETY_SELECT, VARIETY_PRESET_SELECT } from "@/lib/varieties/queries";
import type { RoomVarietyRecord, VarietyPreset } from "@/lib/varieties/types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RoomDetailsPageProps = {
  params: Promise<{ id: string }>;
};

type FieldRowProps = {
  label: string;
  value: string | number | null;
};

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="bf-inset-panel p-3">
      <p className="bf-section-eyebrow text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-zinc-100">{value ?? "Not set"}</p>
    </div>
  );
}

export default async function RoomDetailsPage({ params }: RoomDetailsPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: room, error } = await supabase
    .from("grow_rooms")
    .select(
      "id,name,status,room_type,plant_count,dimensions,lighting,substrate,genetics,irrigation,notes,cycle_start_date,target_cycle_days",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !room) {
    notFound();
  }

  const [{ data: varieties }, { data: presets }] = await Promise.all([
    supabase
      .from("room_varieties")
      .select(ROOM_VARIETY_SELECT)
      .eq("grow_room_id", room.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase.from("variety_presets").select(VARIETY_PRESET_SELECT).order("name"),
  ]);

  const roomVarieties = (varieties ?? []) as RoomVarietyRecord[];
  const harvestVarieties = roomVarieties.map(toVarietyForHarvest);

  const totalPlantsFromVarieties = roomVarieties.reduce(
    (sum, variety) => sum + (variety.plant_count ?? 0),
    0,
  );

  const { data: tasks } = await supabase
    .from("grow_room_tasks")
    .select(
      "id,grow_room_id,title,description,due_date,completed,completed_at,priority,category,created_at,updated_at",
    )
    .eq("grow_room_id", room.id)
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  const { data: logsRaw } = await supabase
    .from("daily_logs")
    .select(
      "id,log_date,logged_at,temperature,humidity,vpd,ppfd,dli,ec_in,ph_in,ec_runoff,ph_runoff,irrigation_count,irrigation_volume_per_event,runoff_percent,dryback_percent,plant_height_cm,stretch_percent,notes",
    )
    .eq("grow_room_id", room.id)
    .eq("user_id", user.id)
    .order("log_date", { ascending: true })
    .order("logged_at", { ascending: true });

  const logsAsc = (logsRaw ?? []) as DailyLogRecord[];
  const logsForList = [...logsAsc].reverse();
  const latestLog = logsForList[0] ?? null;

  const currentDay = getCurrentCycleDay(room.cycle_start_date);
  const cycle = getCropCycleEngine(
    room.status,
    room.cycle_start_date,
    room.target_cycle_days,
    { varieties: harvestVarieties },
  );
  const nextHarvest = getNextHarvestPreview(
    room.status,
    room.cycle_start_date,
    room.target_cycle_days,
    harvestVarieties,
  );
  const daysLeft = nextHarvest?.daysRemaining ?? cycle.daysRemaining ?? null;
  const harvestDate =
    nextHarvest?.estimatedHarvestDateLabel ?? cycle.estimatedHarvestDateLabel;

  return (
    <AppShell user={user}>
      <section className="space-y-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
          >
            Mission Control
          </Link>
          <Link
            href="/dashboard/grow-rooms"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-fuchsia-500/30 hover:text-fuchsia-200"
          >
            Grow rooms
          </Link>
        </div>

        <GlassPanel glow="cyan" padding="lg" className="bf-atmosphere-deep">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              {room.name}
            </h1>
            <GrowRoomStatusBadge status={room.status} />
          </div>
          <div className="mt-8">
            <BfRoomStarMetrics
              status={room.status}
              currentDay={currentDay}
              daysLeft={daysLeft}
              plantCount={room.plant_count ?? 0}
              harvestDate={harvestDate}
            />
          </div>
        </GlassPanel>

        <GlassPanel padding="lg">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white">Room profile</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <FieldRow label="status" value={room.status} />
            <FieldRow label="room_type" value={room.room_type} />
            <FieldRow label="plant_count" value={room.plant_count} />
            <FieldRow label="dimensions" value={room.dimensions} />
            <FieldRow label="lighting" value={room.lighting} />
            <FieldRow label="substrate" value={room.substrate} />
            <FieldRow label="genetics" value={room.genetics} />
            <FieldRow label="irrigation" value={room.irrigation} />
            <FieldRow label="notes" value={room.notes} />
          </div>
        </GlassPanel>

        <RoomDetailManagement room={room} />

        <RoomVarietiesSection
          growRoomId={room.id}
          roomName={room.name}
          varieties={roomVarieties}
          totalPlantsFromVarieties={totalPlantsFromVarieties}
          presets={(presets ?? []) as VarietyPreset[]}
        />

        <CropTimelineSection
          status={room.status}
          cycleStartDate={room.cycle_start_date}
          targetCycleDays={room.target_cycle_days}
          roomName={room.name}
          varieties={harvestVarieties}
        />

        <RoomTasksSection
          growRoomId={room.id}
          roomName={room.name}
          roomStatus={room.status}
          cycleStartDate={room.cycle_start_date}
          tasks={(tasks ?? []) as GrowRoomTask[]}
        />

        <GlassPanel glow="cyan" padding="lg" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              Daily Journal
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Track daily measurements for this grow room.
            </p>
          </div>

          <CreateRoomDailyLogForm growRoomId={room.id} />
          <RoomDailyLogsList logs={logsForList} growRoomId={room.id} />
        </GlassPanel>

        <RoomRecommendationsPanel
          roomStatus={room.status}
          latestLog={latestLog}
          varieties={roomVarieties}
          logDateLabel={formatLogDateLabel(
            latestLog
              ? { ...latestLog, grow_room_id: room.id }
              : null,
          )}
        />

        <RoomJournalCharts logs={logsAsc} />
      </section>
    </AppShell>
  );
}
