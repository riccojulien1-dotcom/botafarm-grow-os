import {
  buildRoomEnvironmentSummaries,
  indexTrendLogsByRoom,
  type DashboardRoomEnvironmentLog,
} from "@/lib/dashboard/build-room-environment-summaries";
import { buildCommandCenterPriorities } from "@/lib/dashboard/command-center-priorities";
import { buildOperationBriefing } from "@/lib/copilot/build-operation-briefing";
import type { CopilotBriefing } from "@/lib/copilot/types";
import {
  getCropCycleEngine,
  getCurrentCycleDay,
  getNextHarvestPreview,
} from "@/lib/grow-rooms/crop-cycle";
import { indexLatestLogsByRoom } from "@/lib/recommendations/latest-log-by-room";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
import { indexTaskSummariesByRoom } from "@/lib/tasks/task-stats";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { toVarietyForHarvest } from "@/lib/varieties/intelligence";
import { ROOM_VARIETY_SELECT } from "@/lib/varieties/queries";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { createClient } from "@/lib/supabase/server";

export async function getCopilotBriefing(userId: string): Promise<CopilotBriefing> {
  const supabase = await createClient();

  const [roomsResult, varietiesResult, logsResult, tasksResult] = await Promise.all([
    supabase
      .from("grow_rooms")
      .select("id,name,status,plant_count,cycle_start_date,target_cycle_days,genetics")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("room_varieties")
      .select(`${ROOM_VARIETY_SELECT},grow_room_id`)
      .eq("user_id", userId),
    supabase
      .from("daily_logs")
      .select(
        "grow_room_id,log_date,logged_at,temperature,humidity,ec_in,ph_in,ec_runoff,ph_runoff,dryback_percent,vpd,ppfd",
      )
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false }),
    supabase
      .from("grow_room_tasks")
      .select("id,grow_room_id,title,due_date,completed,completed_at,priority,category")
      .eq("user_id", userId),
  ]);

  const rooms = roomsResult.data ?? [];
  const varieties = (varietiesResult.data ?? []) as Array<
    RoomVarietyRecord & { grow_room_id: string }
  >;
  const tasks = (tasksResult.data ?? []) as GrowRoomTask[];
  const logs = (logsResult.data ?? []) as DashboardRoomEnvironmentLog[];

  const varietiesByRoom = new Map<string, RoomVarietyRecord[]>();
  const harvestVarietiesByRoom = new Map<string, ReturnType<typeof toVarietyForHarvest>[]>();

  for (const row of varieties) {
    const { grow_room_id: roomId, ...variety } = row;
    const list = varietiesByRoom.get(roomId) ?? [];
    list.push(variety);
    varietiesByRoom.set(roomId, list);

    const harvestList = harvestVarietiesByRoom.get(roomId) ?? [];
    harvestList.push(toVarietyForHarvest(variety));
    harvestVarietiesByRoom.set(roomId, harvestList);
  }

  const latestLogByRoom = indexLatestLogsByRoom(logs) as Map<string, DashboardRoomEnvironmentLog>;
  const trendLogsByRoom = indexTrendLogsByRoom(logs);
  const roomsById = new Map(rooms.map((room) => [room.id, { name: room.name }]));

  const commandRooms = rooms.map((room) => {
    const roomVarieties = varietiesByRoom.get(room.id) ?? [];
    const latestLog = latestLogByRoom.get(room.id) ?? null;
    const summary = getRecommendationSummary(latestLog, room.status, roomVarieties);
    const taskSummary = indexTaskSummariesByRoom(tasks).get(room.id);
    const harvestVarieties = harvestVarietiesByRoom.get(room.id) ?? [];
    const harvest = getNextHarvestPreview(
      room.status,
      room.cycle_start_date,
      room.target_cycle_days,
      harvestVarieties,
    );
    const cycle = getCropCycleEngine(
      room.status,
      room.cycle_start_date,
      room.target_cycle_days,
      { varieties: harvestVarieties },
    );

    return {
      id: room.id,
      name: room.name,
      status: room.status,
      plantCount: room.plant_count ?? 0,
      severity: summary.severity,
      activeRecommendations: summary.activeItems.length,
      openTasks: taskSummary?.openCount ?? 0,
      overdueTasks: taskSummary?.overdueCount ?? 0,
      harvestLabel: harvest?.label ?? null,
      currentDay: getCurrentCycleDay(room.cycle_start_date),
      targetCycleDays: room.target_cycle_days,
      daysRemaining: harvest?.daysRemaining ?? cycle.daysRemaining,
      progressPercent: cycle.progressPercent,
      phaseLabel: room.status,
      harvestDateLabel: harvest?.estimatedHarvestDateLabel ?? null,
      nextVarietyName: harvest?.varietyName ?? null,
      cultivarName: null,
      cultivarDisplayName: null,
      genetics: null,
      varietyCount: roomVarieties.length,
      actionRequired: null,
    };
  });

  const roomEnvironments = buildRoomEnvironmentSummaries(
    commandRooms.map((room) => ({
      id: room.id,
      name: room.name,
      status: room.status,
      severity: room.severity,
    })),
    latestLogByRoom,
    trendLogsByRoom,
  );

  const harvestCandidate = commandRooms
    .filter((room) => room.daysRemaining != null)
    .sort((left, right) => (left.daysRemaining ?? 999) - (right.daysRemaining ?? 999))[0];

  return buildOperationBriefing({
    rooms: commandRooms,
    roomEnvironments,
    priorities: buildCommandCenterPriorities(roomsById, tasks),
    primaryHarvestDays: harvestCandidate?.daysRemaining ?? null,
    primaryHarvestRoom: harvestCandidate?.name ?? null,
    latestLogByRoom,
    varietiesByRoom,
  });
}
