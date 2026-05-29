"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

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

export async function createRoomDailyLogAction(
  _: { error?: string; success?: string },
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  const user = await requireUser();
  const supabase = await createClient();

  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();
  const logDateValue = parseLogDate(formData.get("log_date"));

  if (!growRoomId) {
    return { error: "Missing grow room." };
  }

  if (!logDateValue) {
    return { error: "Please provide a valid log date." };
  }

  const { data: room, error: roomError } = await supabase
    .from("grow_rooms")
    .select("id")
    .eq("id", growRoomId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (roomError || !room) {
    return { error: "Invalid grow room." };
  }

  const payload = {
    user_id: user.id,
    grow_room_id: growRoomId,
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
  };

  const { error } = await supabase.from("daily_logs").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/rooms/${growRoomId}`);
  return { success: "Daily journal log saved." };
}
