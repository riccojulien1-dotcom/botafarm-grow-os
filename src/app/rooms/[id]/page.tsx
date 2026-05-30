import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { RoomJournalCharts } from "@/components/analytics/room-journal-charts";
import { CreateRoomDailyLogForm } from "@/components/journal/create-room-daily-log-form";
import { RoomDailyLogsList } from "@/components/journal/room-daily-logs-list";
import type { DailyLogRecord } from "@/lib/journal/daily-log-fields";
import { CropTimelineSection } from "@/components/grow-rooms/crop-timeline-section";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { RoomDetailManagement } from "@/components/grow-rooms/room-detail-management";
import { RoomVarietiesSection } from "@/components/varieties/room-varieties-section";
import { requireUser } from "@/lib/auth/get-user";
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-sm text-zinc-100">{value ?? "Not set"}</p>
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

  const { data: varieties } = await supabase
    .from("room_varieties")
    .select("id,name,genetics,plant_count,flowering_duration_days,notes,created_at")
    .eq("grow_room_id", room.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const totalPlantsFromVarieties = (varieties ?? []).reduce(
    (sum, variety) => sum + (variety.plant_count ?? 0),
    0,
  );

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

  return (
    <AppShell user={user}>
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
          >
            Back to dashboard
          </Link>
          <Link
            href="/dashboard/grow-rooms"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
          >
            Back to grow rooms
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{room.name}</h1>
          <GrowRoomStatusBadge status={room.status} />
        </div>
        <p className="text-sm text-zinc-400">Room details</p>

        <div className="grid gap-3 sm:grid-cols-2">
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

        <RoomDetailManagement room={room} />

        <RoomVarietiesSection
          growRoomId={room.id}
          roomName={room.name}
          varieties={varieties ?? []}
          totalPlantsFromVarieties={totalPlantsFromVarieties}
        />

        <CropTimelineSection
          status={room.status}
          cycleStartDate={room.cycle_start_date}
          targetCycleDays={room.target_cycle_days}
          roomName={room.name}
          varieties={(varieties ?? []).map((variety) => ({
            id: variety.id,
            name: variety.name,
            genetics: variety.genetics,
            plant_count: variety.plant_count,
            flowering_duration_days: variety.flowering_duration_days,
          }))}
        />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Daily Journal</h2>
            <p className="text-sm text-zinc-400">
              Track daily measurements for this grow room.
            </p>
          </div>

          <CreateRoomDailyLogForm growRoomId={room.id} />
          <RoomDailyLogsList logs={logsForList} growRoomId={room.id} />
        </section>

        <RoomJournalCharts logs={logsAsc} />
      </section>
    </AppShell>
  );
}
