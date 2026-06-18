"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { parseDailyLogFormData } from "@/lib/journal/parse-daily-log-form";
import { extractPhotoFiles, uploadDailyLogPhotos } from "@/lib/journal/log-photos";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

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

async function verifyOwnedLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  logId: string,
  growRoomId: string,
) {
  const { data: log, error } = await supabase
    .from("daily_logs")
    .select("id")
    .eq("id", logId)
    .eq("user_id", userId)
    .eq("grow_room_id", growRoomId)
    .maybeSingle();

  return !error && !!log;
}

function revalidateJournalPaths(growRoomId: string) {
  revalidatePath("/dashboard/journal");
  revalidatePath("/dashboard");
  revalidatePath(`/rooms/${growRoomId}`);
}

export async function createDailyLogAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();
  if (!growRoomId) {
    return { error: "Please select a grow room." };
  }

  if (!(await verifyOwnedRoom(supabase, user.id, growRoomId))) {
    return { error: "Invalid grow room." };
  }

  const fields = parseDailyLogFormData(formData);
  if (!fields.ok) {
    return { error: fields.error };
  }

  const { data: inserted, error } = await supabase
    .from("daily_logs")
    .insert({
      user_id: user.id,
      grow_room_id: growRoomId,
      ...fields.payload,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { error: error?.message ?? "Could not save log." };
  }

  const photoError = await uploadDailyLogPhotos(
    supabase,
    user.id,
    inserted.id,
    extractPhotoFiles(formData),
  );
  if (photoError) {
    return { error: photoError };
  }

  revalidateJournalPaths(growRoomId);
  return { success: "Journal entry saved." };
}

export async function updateDailyLogAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const logId = String(formData.get("log_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!logId || !growRoomId) {
    return { error: "Missing log or grow room." };
  }

  if (!(await verifyOwnedLog(supabase, user.id, logId, growRoomId))) {
    return { error: "You cannot edit this log." };
  }

  const fields = parseDailyLogFormData(formData);
  if (!fields.ok) {
    return { error: fields.error };
  }

  const { error } = await supabase
    .from("daily_logs")
    .update(fields.payload)
    .eq("id", logId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  const photoError = await uploadDailyLogPhotos(
    supabase,
    user.id,
    logId,
    extractPhotoFiles(formData),
  );
  if (photoError) {
    return { error: photoError };
  }

  revalidateJournalPaths(growRoomId);
  return { success: "Journal entry updated." };
}

export async function deleteDailyLogAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const logId = String(formData.get("log_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!logId || !growRoomId) {
    return { error: "Missing log or grow room." };
  }

  if (!(await verifyOwnedLog(supabase, user.id, logId, growRoomId))) {
    return { error: "You cannot delete this log." };
  }

  const { data: photos } = await supabase
    .from("log_photos")
    .select("storage_path")
    .eq("daily_log_id", logId);

  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  const paths = (photos ?? []).map((photo) => photo.storage_path);
  if (paths.length > 0) {
    await supabase.storage.from("log-photos").remove(paths);
  }

  revalidateJournalPaths(growRoomId);
  return { success: "Journal entry deleted." };
}
