import { computeBatchMetrics } from "@/lib/cultivation/compute-batch";
import { CULTIVAR_BATCH_SELECT } from "@/lib/cultivation/queries";
import type {
  CultivarBatchRecord,
  RoomCultivarView,
  VarietyDetailContext,
} from "@/lib/cultivation/types";
import { ROOM_VARIETY_SELECT } from "@/lib/varieties/queries";
import type { RoomVarietyRecord } from "@/lib/varieties/types";
import { createClient } from "@/lib/supabase/server";

type RoomRow = {
  id: string;
  name: string;
  status: string;
  cycle_start_date: string | null;
  target_cycle_days: number | null;
};

function synthesizeBatchFromVariety(
  variety: RoomVarietyRecord,
  room: RoomRow,
  userId: string,
): CultivarBatchRecord {
  const now = new Date().toISOString();
  const flowerStart =
    room.status === "Flower" && room.cycle_start_date ? room.cycle_start_date : null;

  return {
    id: `${variety.id}-default`,
    variety_id: variety.id,
    plant_count: variety.plant_count ?? 0,
    start_date: room.cycle_start_date,
    flower_start_date: flowerStart,
    harvest_estimate: null,
    status: room.status === "Flower" ? "flower" : "vegetative",
    notes: null,
    created_at: now,
    updated_at: now,
  };
}

function pickPrimaryBatch(
  batches: CultivarBatchRecord[],
  varietyId: string,
): CultivarBatchRecord | null {
  const forVariety = batches.filter((batch) => batch.variety_id === varietyId);
  if (!forVariety.length) {
    return null;
  }
  const active = forVariety.find(
    (batch) => batch.status === "flower" || batch.status === "preflower",
  );
  return active ?? forVariety[0];
}

export async function fetchBatchesForVarieties(
  userId: string,
  varietyIds: string[],
): Promise<Map<string, CultivarBatchRecord[]>> {
  const map = new Map<string, CultivarBatchRecord[]>();
  if (!varietyIds.length) {
    return map;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cultivar_batches")
    .select(CULTIVAR_BATCH_SELECT)
    .eq("user_id", userId)
    .in("variety_id", varietyIds)
    .order("created_at", { ascending: true });

  if (error) {
    return map;
  }

  for (const row of data ?? []) {
    const batch = row as CultivarBatchRecord;
    const list = map.get(batch.variety_id) ?? [];
    list.push(batch);
    map.set(batch.variety_id, list);
  }

  return map;
}

export async function fetchRoomCultivars(
  userId: string,
  growRoomId: string,
): Promise<RoomCultivarView[]> {
  const supabase = await createClient();

  const { data: room, error: roomError } = await supabase
    .from("grow_rooms")
    .select("id,name,status,cycle_start_date,target_cycle_days")
    .eq("id", growRoomId)
    .eq("user_id", userId)
    .maybeSingle();

  if (roomError || !room) {
    return [];
  }

  const { data: varieties, error: varietiesError } = await supabase
    .from("room_varieties")
    .select(ROOM_VARIETY_SELECT)
    .eq("grow_room_id", growRoomId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (varietiesError || !varieties?.length) {
    return [];
  }

  const varietyRecords = varieties as RoomVarietyRecord[];
  const batchMap = await fetchBatchesForVarieties(
    userId,
    varietyRecords.map((variety) => variety.id),
  );

  const roomRow = room as RoomRow;

  return varietyRecords.map((variety) => {
    const batches = batchMap.get(variety.id) ?? [];
    const batch =
      pickPrimaryBatch(batches, variety.id) ?? synthesizeBatchFromVariety(variety, roomRow, userId);
    const computed = computeBatchMetrics(batch, variety, roomRow);

    return {
      variety,
      batch,
      computed,
      growRoomId: roomRow.id,
      growRoomName: roomRow.name,
    };
  });
}

export async function fetchVarietyDetail(
  userId: string,
  varietyId: string,
): Promise<VarietyDetailContext | null> {
  const supabase = await createClient();

  const { data: varietyRow, error } = await supabase
    .from("room_varieties")
    .select(`${ROOM_VARIETY_SELECT},grow_room_id`)
    .eq("id", varietyId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !varietyRow) {
    return null;
  }

  const { grow_room_id: growRoomId, ...varietyFields } = varietyRow as RoomVarietyRecord & {
    grow_room_id: string;
  };
  const variety = varietyFields as RoomVarietyRecord;

  const { data: room } = await supabase
    .from("grow_rooms")
    .select("id,name,status,cycle_start_date,target_cycle_days")
    .eq("id", growRoomId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!room) {
    return null;
  }

  const batchMap = await fetchBatchesForVarieties(userId, [varietyId]);
  const batches = batchMap.get(varietyId) ?? [];
  const roomRow = room as RoomRow;
  const primaryBatch =
    pickPrimaryBatch(batches, varietyId) ?? synthesizeBatchFromVariety(variety, roomRow, userId);
  const primaryComputed = computeBatchMetrics(primaryBatch, variety, roomRow);

  return {
    variety,
    batches: batches.length ? batches : [primaryBatch],
    primaryBatch,
    primaryComputed,
    growRoom: roomRow,
  };
}

export async function countActiveCultivars(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("room_varieties")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    return 0;
  }
  return count ?? 0;
}
