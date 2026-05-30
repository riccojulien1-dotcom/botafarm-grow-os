"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { parseDailyLogFormData } from "@/lib/journal/parse-daily-log-form";
import { createClient } from "@/lib/supabase/server";

export async function createDailyLogAction(
  _: { error?: string; success?: string },
  formData: FormData,
) {
  const user = await requireUser();
  const supabase = await createClient();

  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!growRoomId) {
    return { error: "Please select a grow room." };
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

  const fields = parseDailyLogFormData(formData);
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

  revalidatePath("/dashboard/journal");
  revalidatePath("/dashboard");
  revalidatePath(`/rooms/${growRoomId}`);
  return { success: "Daily log saved." };
}
