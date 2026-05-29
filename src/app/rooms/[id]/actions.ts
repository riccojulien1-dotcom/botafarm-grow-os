"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

function numericValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseLogDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return {
    logDate: value,
    loggedAt: parsed.toISOString(),
  };
}

function buildLogFields(formData: FormData):
  | { ok: false; error: string }
  | {
      ok: true;
      payload: {
        log_date: string;
        logged_at: string;
        temperature: number | null;
        humidity: number | null;
        vpd: number | null;
        ec: number | null;
        ph: number | null;
        irrigation_volume: number | null;
        dryback_percent: number | null;
        notes: string | null;
      };
    } {
  const logDateValue = parseLogDate(formData.get("log_date"));

  if (!logDateValue) {
    return { ok: false, error: "Please provide a valid log date." };
  }

  return {
    ok: true,
    payload: {
      log_date: logDateValue.logDate,
      logged_at: logDateValue.loggedAt,
      temperature: numericValue(formData.get("temperature")),
      humidity: numericValue(formData.get("humidity")),
      vpd: numericValue(formData.get("vpd")),
      ec: numericValue(formData.get("ec")),
      ph: numericValue(formData.get("ph")),
      irrigation_volume: numericValue(formData.get("irrigation_volume")),
      dryback_percent: numericValue(formData.get("dryback_percent")),
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  };
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

  if (error || !log) {
    return false;
  }

  return true;
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

export async function createRoomDailyLogAction(
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

  const fields = buildLogFields(formData);
  if (!fields.ok) {
    return { error: fields.error };
  }

  const { error } = await supabase.from("daily_logs").insert({
    user_id: user.id,
    grow_room_id: growRoomId,
    ...fields.payload,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/rooms/${growRoomId}`);
  return { success: "Daily journal log saved." };
}

export async function updateRoomDailyLogAction(
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

  const fields = buildLogFields(formData);
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

  revalidatePath(`/rooms/${growRoomId}`);
  return { success: "Journal log updated." };
}

export async function deleteRoomDailyLogAction(
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

  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/rooms/${growRoomId}`);
  return { success: "Journal log deleted." };
}
