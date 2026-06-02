"use server";

import { revalidatePath } from "next/cache";

import { ensureDefaultBatchForVariety } from "@/app/rooms/[id]/batch-actions";
import { requireUser } from "@/lib/auth/get-user";
import { mergePresetWithFormPayload } from "@/lib/varieties/build-variety-payload";
import { parseVarietyFormData } from "@/lib/varieties/parse-variety-form";
import { VARIETY_PRESET_SELECT } from "@/lib/varieties/queries";
import { syncRoomPlantCountFromVarieties } from "@/lib/varieties/sync-room-plant-count";
import type { VarietyPreset } from "@/lib/varieties/types";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

function revalidateVarietyPaths(growRoomId: string, varietyId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/grow-rooms");
  revalidatePath(`/rooms/${growRoomId}`);
  if (varietyId) {
    revalidatePath(`/varieties/${varietyId}`);
  }
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

async function loadPresetBySlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
): Promise<VarietyPreset | null> {
  const { data, error } = await supabase
    .from("variety_presets")
    .select(VARIETY_PRESET_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as VarietyPreset;
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

  let payload = parsed.payload;
  const presetSlug = payload.preset_slug;

  if (presetSlug) {
    const preset = await loadPresetBySlug(supabase, presetSlug);
    if (!preset) {
      return { error: "Selected preset was not found." };
    }
    payload = mergePresetWithFormPayload(preset, parsed.payload);
  }

  const now = new Date().toISOString();

  const { data: inserted, error } = await supabase
    .from("room_varieties")
    .insert({
      user_id: user.id,
      grow_room_id: growRoomId,
      ...payload,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (inserted?.id) {
    await ensureDefaultBatchForVariety(
      supabase,
      user.id,
      inserted.id,
      growRoomId,
      payload.plant_count,
      payload.flowering_duration_days,
      payload.harvest_window_end_days,
    );
  }

  await syncRoomPlantCountFromVarieties(supabase, user.id, growRoomId);
  revalidateVarietyPaths(growRoomId, inserted?.id);
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

  const { preset_slug: _ignoredPresetSlug, ...updatePayload } = parsed.payload;

  const { error } = await supabase
    .from("room_varieties")
    .update({
      ...updatePayload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", varietyId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  await syncRoomPlantCountFromVarieties(supabase, user.id, growRoomId);
  revalidateVarietyPaths(growRoomId, varietyId);
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
