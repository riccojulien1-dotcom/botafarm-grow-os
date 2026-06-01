import { getNextHarvestPreview } from "@/lib/grow-rooms/crop-cycle";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import {
  indexLatestLogsByRoom,
  type DailyLogForRecommendations,
} from "@/lib/recommendations/latest-log-by-room";
import { getRecommendationSummary } from "@/lib/recommendations/evaluate-recommendations";
import type { RecommendationSeverity } from "@/lib/recommendations/types";
import { indexTaskSummariesByRoom, summarizeRoomTasks } from "@/lib/tasks/task-stats";
import type { GrowRoomTask } from "@/lib/tasks/types";
import { toVarietyForHarvest } from "@/lib/varieties/intelligence";
import { ROOM_VARIETY_SELECT } from "@/lib/varieties/queries";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { createClient } from "@/lib/supabase/server";

export type CommandCenterRoom = {
  id: string;
  name: string;
  status: string;
  plantCount: number;
  severity: RecommendationSeverity;
  activeRecommendations: number;
  openTasks: number;
  overdueTasks: number;
  harvestLabel: string | null;
};

export type CommandCenterData = {
  base: Awaited<ReturnType<typeof getDashboardData>>;
  healthScore: number;
  alertCounts: { action: number; watch: number; good: number };
  taskOpen: number;
  taskOverdue: number;
  rooms: CommandCenterRoom[];
  envTrend: {
    ec: number[];
    vpd: number[];
    temp: number[];
    labels: string[];
  };
  harvestPreviews: Array<{ roomId: string; roomName: string; label: string }>;
};

function computeHealthScore(alertCounts: CommandCenterData["alertCounts"]) {
  const penalty = alertCounts.action * 18 + alertCounts.watch * 8;
  return Math.max(0, Math.min(100, 100 - penalty));
}

export async function getCommandCenterData(userId: string): Promise<CommandCenterData> {
  const supabase = await createClient();
  const base = await getDashboardData(userId);

  const [roomsResult, varietiesResult, logsResult, tasksResult, trendLogsResult] =
    await Promise.all([
      supabase
        .from("grow_rooms")
        .select("id,name,status,plant_count,cycle_start_date,target_cycle_days")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("room_varieties")
        .select(`${ROOM_VARIETY_SELECT},grow_room_id`)
        .eq("user_id", userId),
      supabase
        .from("daily_logs")
        .select(
          "grow_room_id,log_date,logged_at,ec_in,ph_in,ec_runoff,ph_runoff,dryback_percent,vpd,ppfd",
        )
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .order("logged_at", { ascending: false }),
      supabase
        .from("grow_room_tasks")
        .select("id,grow_room_id,title,due_date,completed,completed_at,priority,category")
        .eq("user_id", userId),
      supabase
        .from("daily_logs")
        .select("log_date,logged_at,ec_in,vpd,temperature")
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .order("logged_at", { ascending: false })
        .limit(14),
    ]);

  const rooms = roomsResult.data ?? [];
  const varieties = (varietiesResult.data ?? []) as Array<
    RoomVarietyRecord & { grow_room_id: string }
  >;
  const tasks = (tasksResult.data ?? []) as GrowRoomTask[];

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

  const latestLogByRoom = indexLatestLogsByRoom(
    (logsResult.data ?? []) as DailyLogForRecommendations[],
  );
  const taskSummaryByRoom = indexTaskSummariesByRoom(tasks);

  const alertCounts = { action: 0, watch: 0, good: 0 };
  let taskOpen = 0;
  let taskOverdue = 0;

  const commandRooms: CommandCenterRoom[] = rooms.map((room) => {
    const roomVarieties = varietiesByRoom.get(room.id) ?? [];
    const latestLog = latestLogByRoom.get(room.id) ?? null;
    const summary = getRecommendationSummary(latestLog, room.status, roomVarieties);
    const taskSummary = taskSummaryByRoom.get(room.id) ?? summarizeRoomTasks([]);

    alertCounts[summary.severity] += 1;
    taskOpen += taskSummary.openCount;
    taskOverdue += taskSummary.overdueCount;

    const harvest = getNextHarvestPreview(
      room.status,
      room.cycle_start_date,
      room.target_cycle_days,
      harvestVarietiesByRoom.get(room.id) ?? [],
    );

    return {
      id: room.id,
      name: room.name,
      status: room.status,
      plantCount: room.plant_count ?? 0,
      severity: summary.severity,
      activeRecommendations: summary.activeItems.length,
      openTasks: taskSummary.openCount,
      overdueTasks: taskSummary.overdueCount,
      harvestLabel: harvest?.label ?? null,
    };
  });

  const trendRows = [...(trendLogsResult.data ?? [])].reverse();
  const envTrend = {
    ec: trendRows.map((row) => row.ec_in).filter((v): v is number => v != null),
    vpd: trendRows.map((row) => row.vpd).filter((v): v is number => v != null),
    temp: trendRows.map((row) => row.temperature).filter((v): v is number => v != null),
    labels: trendRows.map((row) =>
      (row.log_date ?? row.logged_at.slice(0, 10)).slice(5),
    ),
  };

  const harvestPreviews = commandRooms
    .filter((room) => room.harvestLabel)
    .map((room) => ({
      roomId: room.id,
      roomName: room.name,
      label: room.harvestLabel as string,
    }))
    .slice(0, 4);

  return {
    base,
    healthScore: computeHealthScore(alertCounts),
    alertCounts,
    taskOpen,
    taskOverdue,
    rooms: commandRooms,
    envTrend,
    harvestPreviews,
  };
}
