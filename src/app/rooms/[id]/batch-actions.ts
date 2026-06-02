"use server";

import { revalidatePath } from "next/cache";

import { buildDefaultBatchPayload } from "@/lib/cultivation/create-default-batch";
import { requireUser } from "@/lib/auth/get-user";
import { syncRoomPlantCountFromVarieties } from "@/lib/varieties/sync-room-plant-count";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

export async function ensureDefaultBatchForVariety(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  varietyId: string,
  growRoomId: string,
  plantCount: number,
  floweringDurationDays: number | null,
  harvestWindowEndDays: number | null,
) {
  const { data: existing } = await supabase
    .from("cultivar_batches")
    .select("id")
    .eq("variety_id", varietyId)
    .eq("user_id", userId)
    .limit(1);

  if (existing?.length) {
    return;
  }

  const { data: room } = await supabase
    .from("grow_rooms")
    .select("status,cycle_start_date")
    .eq("id", growRoomId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!room) {
    return;
  }

  const payload = buildDefaultBatchPayload(
    userId,
    varietyId,
    {
      plant_count: plantCount,
      flowering_duration_days: floweringDurationDays,
      harvest_window_end_days: harvestWindowEndDays,
    },
    room,
  );

  await supabase.from("cultivar_batches").insert(payload);
}

export async function updateBatchAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const batchId = String(formData.get("batch_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();
  const plantCount = Number(formData.get("plant_count") ?? 0);
  const flowerStartDate = String(formData.get("flower_start_date") ?? "").trim() || null;
  const harvestEstimate = String(formData.get("harvest_estimate") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "flower").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!batchId || !growRoomId) {
    return { error: "Missing batch or room." };
  }

  const { data: batch } = await supabase
    .from("cultivar_batches")
    .select("id,variety_id")
    .eq("id", batchId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!batch) {
    return { error: "Batch not found." };
  }

  const { error } = await supabase
    .from("cultivar_batches")
    .update({
      plant_count: Number.isFinite(plantCount) ? Math.max(0, plantCount) : 0,
      flower_start_date: flowerStartDate,
      harvest_estimate: harvestEstimate,
      status,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", batchId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from("room_varieties")
    .update({ plant_count: Math.max(0, plantCount) })
    .eq("id", batch.variety_id)
    .eq("user_id", user.id);

  await syncRoomPlantCountFromVarieties(supabase, user.id, growRoomId);

  revalidatePath("/dashboard");
  revalidatePath(`/rooms/${growRoomId}`);
  revalidatePath(`/varieties/${batch.variety_id}`);
  return { success: "Batch updated." };
}
