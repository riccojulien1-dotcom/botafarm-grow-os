"use server";

import { revalidatePath } from "next/cache";

import { ensureDefaultBatchForVariety } from "@/app/rooms/[id]/batch-actions";
import { requireUser } from "@/lib/auth/get-user";
import { buildInitialRoomVarietyFromGrowRoom } from "@/lib/grow-rooms/build-initial-room-variety";
import { parseGrowRoomFormData } from "@/lib/grow-rooms/parse-grow-room-form";
import { syncRoomPlantCountFromVarieties } from "@/lib/varieties/sync-room-plant-count";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

function revalidateGrowRoomPaths(roomId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/grow-rooms");
  if (roomId) {
    revalidatePath(`/rooms/${roomId}`);
  }
}

async function verifyOwnedRoom(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  roomId: string,
) {
  const { data: room, error } = await supabase
    .from("grow_rooms")
    .select("id")
    .eq("id", roomId)
    .eq("user_id", userId)
    .maybeSingle();

  return !error && !!room;
}

export async function createGrowRoomAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const parsed = parseGrowRoomFormData(formData);

  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const { data: inserted, error } = await supabase
    .from("grow_rooms")
    .insert({
      user_id: user.id,
      ...parsed.payload,
    })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    return { error: error?.message ?? "Grow room could not be created." };
  }

  const initialVariety = buildInitialRoomVarietyFromGrowRoom(parsed.payload);
  if (initialVariety) {
    const now = new Date().toISOString();
    const { data: varietyRow, error: varietyError } = await supabase
      .from("room_varieties")
      .insert({
        user_id: user.id,
        grow_room_id: inserted.id,
        ...initialVariety,
        updated_at: now,
      })
      .select("id")
      .single();

    if (varietyError || !varietyRow?.id) {
      await supabase
        .from("grow_rooms")
        .delete()
        .eq("id", inserted.id)
        .eq("user_id", user.id);
      return {
        error: varietyError?.message ?? "Initial cultivar could not be created.",
      };
    }

    await ensureDefaultBatchForVariety(
      supabase,
      user.id,
      varietyRow.id,
      inserted.id,
      initialVariety.plant_count,
      initialVariety.flowering_duration_days,
      initialVariety.harvest_window_end_days,
    );
    await syncRoomPlantCountFromVarieties(supabase, user.id, inserted.id);
  }

  revalidateGrowRoomPaths(inserted.id);
  return { success: "Grow room created." };
}

export async function updateGrowRoomAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const roomId = String(formData.get("room_id") ?? "").trim();

  if (!roomId) {
    return { error: "Missing grow room." };
  }

  if (!(await verifyOwnedRoom(supabase, user.id, roomId))) {
    return { error: "You cannot edit this grow room." };
  }

  const parsed = parseGrowRoomFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const { error } = await supabase
    .from("grow_rooms")
    .update(parsed.payload)
    .eq("id", roomId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateGrowRoomPaths(roomId);
  return { success: "Grow room updated." };
}

export async function deleteGrowRoomAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const roomId = String(formData.get("room_id") ?? "").trim();

  if (!roomId) {
    return { error: "Missing grow room." };
  }

  if (!(await verifyOwnedRoom(supabase, user.id, roomId))) {
    return { error: "You cannot delete this grow room." };
  }

  const { error } = await supabase
    .from("grow_rooms")
    .delete()
    .eq("id", roomId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateGrowRoomPaths();
  return { success: "Grow room deleted." };
}
