"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { parseVarietyFormData } from "@/lib/varieties/parse-variety-form";
import { syncRoomPlantCountFromVarieties } from "@/lib/varieties/sync-room-plant-count";

type ActionState = { error?: string; success?: string };

function revalidateVarietyPaths(growRoomId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/grow-rooms");
  revalidatePath(`/rooms/${growRoomId}`);
}

async function verifyOwnedRoom(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  growRoomId: string,
) {
  const { data: room, error } = await supabase
    .from("grow_rooms")
    .select("id")
    .eq("id", growRoomId)
    .eq("user_id", userId)
    .maybeSingle();

  return !error && !!room;
}

async function verifyOwnedVariety(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  varietyId: string,
  growRoomId: string,
) {
  const { data: variety, error } = await supabase
    .from("room_varieties")
    .select("id")
    .eq("id", varietyId)
    .eq("grow_room_id", growRoomId)
    .eq("user_id", userId)
    .maybeSingle();

  return !error && !!variety;
}

export async function createRoomVarietyAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!growRoomId) {
    return { error: "Missing grow room." };
  }

  if (!(await verifyOwnedRoom(supabase, user.id, growRoomId))) {
    return { error: "Invalid grow room." };
  }

  const parsed = parseVarietyFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const { error } = await supabase.from("room_varieties").insert({
    user_id: user.id,
    grow_room_id: growRoomId,
    ...parsed.payload,
  });

  if (error) {
    return { error: error.message };
  }

  await syncRoomPlantCountFromVarieties(supabase, user.id, growRoomId);
  revalidateVarietyPaths(growRoomId);
  return { success: "Variety added." };
}

export async function updateRoomVarietyAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const varietyId = String(formData.get("variety_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!varietyId || !growRoomId) {
    return { error: "Missing variety or grow room." };
  }

  if (!(await verifyOwnedVariety(supabase, user.id, varietyId, growRoomId))) {
    return { error: "You cannot edit this variety." };
  }

  const parsed = parseVarietyFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const { error } = await supabase
    .from("room_varieties")
    .update(parsed.payload)
    .eq("id", varietyId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  await syncRoomPlantCountFromVarieties(supabase, user.id, growRoomId);
  revalidateVarietyPaths(growRoomId);
  return { success: "Variety updated." };
}

export async function deleteRoomVarietyAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const varietyId = String(formData.get("variety_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!varietyId || !growRoomId) {
    return { error: "Missing variety or grow room." };
  }

  if (!(await verifyOwnedVariety(supabase, user.id, varietyId, growRoomId))) {
    return { error: "You cannot delete this variety." };
  }

  const { error } = await supabase
    .from("room_varieties")
    .delete()
    .eq("id", varietyId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  await syncRoomPlantCountFromVarieties(supabase, user.id, growRoomId);
  revalidateVarietyPaths(growRoomId);
  return { success: "Variety deleted." };
}
