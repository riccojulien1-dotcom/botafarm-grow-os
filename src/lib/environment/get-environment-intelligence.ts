import { buildEnvironmentMetrics } from "@/lib/environment/build-environment-metrics";
import type {
  EnvironmentMetricKey,
  EnvironmentMetricSnapshot,
} from "@/lib/environment/build-environment-metrics";
import { formatRelativeTime } from "@/lib/environment/format-relative-time";
import { createClient } from "@/lib/supabase/server";

export type {
  EnvironmentMetricKey,
  EnvironmentMetricSnapshot,
} from "@/lib/environment/build-environment-metrics";

export type EnvironmentLogRow = {
  id: string;
  logDate: string;
  loggedAt: string;
  roomName: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ecIn: number | null;
  phIn: number | null;
  ecRunoff: number | null;
  phRunoff: number | null;
};

export type EnvironmentIntelligence = {
  metrics: EnvironmentMetricSnapshot[];
  quality: {
    lastReadingAt: string | null;
    lastReadingLabel: string;
    recordCount: number;
    sourceLabel: string;
  };
  roomContext: { id: string; name: string; status: string } | null;
  history: EnvironmentLogRow[];
};

type EnvLogRow = {
  id: string;
  log_date: string | null;
  logged_at: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ec_in: number | null;
  ph_in: number | null;
  ec_runoff: number | null;
  ph_runoff: number | null;
  grow_room_id: string;
  grow_rooms: { name: string; status: string } | { name: string; status: string }[] | null;
};

function resolveRoom(
  relation: EnvLogRow["grow_rooms"],
): { name: string; status: string } | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

export async function getEnvironmentIntelligence(
  userId: string,
): Promise<EnvironmentIntelligence> {
  const supabase = await createClient();

  const [trendResult, countResult, historyResult] = await Promise.all([
    supabase
      .from("daily_logs")
      .select(
        "id,log_date,logged_at,temperature,humidity,vpd,ec_in,ph_in,ec_runoff,ph_runoff,grow_room_id,grow_rooms(name,status)",
      )
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false })
      .limit(30),
    supabase
      .from("daily_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("daily_logs")
      .select(
        "id,log_date,logged_at,temperature,humidity,vpd,ec_in,ph_in,ec_runoff,ph_runoff,grow_room_id,grow_rooms(name,status)",
      )
      .eq("user_id", userId)
      .order("log_date", { ascending: false })
      .order("logged_at", { ascending: false })
      .limit(20),
  ]);

  const trendDesc = (trendResult.data ?? []) as EnvLogRow[];
  const trendRows = [...trendDesc].reverse();
  const latest = trendDesc[0] ?? null;
  const latestRoom = latest ? resolveRoom(latest.grow_rooms) : null;
  const roomStatus = latestRoom?.status ?? "Flower";

  const metrics = buildEnvironmentMetrics(trendRows, roomStatus);

  const history: EnvironmentLogRow[] = (historyResult.data ?? []).map((row) => {
    const entry = row as EnvLogRow;
    const room = resolveRoom(entry.grow_rooms);
    return {
      id: entry.id,
      logDate: entry.log_date ?? entry.logged_at.slice(0, 10),
      loggedAt: entry.logged_at,
      roomName: room?.name ?? "Unknown",
      temperature: entry.temperature,
      humidity: entry.humidity,
      vpd: entry.vpd,
      ecIn: entry.ec_in,
      phIn: entry.ph_in,
      ecRunoff: entry.ec_runoff,
      phRunoff: entry.ph_runoff,
    };
  });

  return {
    metrics,
    quality: {
      lastReadingAt: latest?.logged_at ?? null,
      lastReadingLabel: latest
        ? formatRelativeTime(latest.logged_at)
        : "No readings yet",
      recordCount: countResult.count ?? 0,
      sourceLabel: "Manual Logs",
    },
    roomContext: latest
      ? {
          id: latest.grow_room_id,
          name: latestRoom?.name ?? "Unknown room",
          status: roomStatus,
        }
      : null,
    history,
  };
}
