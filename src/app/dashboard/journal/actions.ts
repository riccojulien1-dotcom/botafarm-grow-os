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

export async function createDailyLogAction(_: { error?: string; success?: string }, formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!growRoomId) {
    return { error: "Please select a grow room." };
  }

  // Verify ownership before insert.
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
    grow_room_id: growRoomId,
    temperature: numericValue(formData.get("temperature")),
    humidity: numericValue(formData.get("humidity")),
    ec: numericValue(formData.get("ec")),
    ph: numericValue(formData.get("ph")),
    irrigation_ml: numericValue(formData.get("irrigation_ml")),
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  const { error } = await supabase.from("daily_logs").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/journal");
  return { success: "Daily log saved." };
}
