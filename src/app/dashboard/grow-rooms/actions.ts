"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export async function createGrowRoomAction(_: { error?: string; success?: string }, formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const plantCountRaw = formData.get("plant_count");
  const plantCount =
    typeof plantCountRaw === "string" && plantCountRaw.length > 0
      ? Number(plantCountRaw)
      : null;

  const payload = {
    user_id: user.id,
    name: String(formData.get("name") ?? "").trim(),
    room_type: String(formData.get("room_type") ?? "").trim() || null,
    dimensions: String(formData.get("dimensions") ?? "").trim() || null,
    lighting: String(formData.get("lighting") ?? "").trim() || null,
    substrate: String(formData.get("substrate") ?? "").trim() || null,
    genetics: String(formData.get("genetics") ?? "").trim() || null,
    irrigation: String(formData.get("irrigation") ?? "").trim() || null,
    plant_count: Number.isNaN(plantCount) ? null : plantCount,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  if (!payload.name) {
    return { error: "Grow room name is required." };
  }

  const { error } = await supabase.from("grow_rooms").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/grow-rooms");
  revalidatePath("/dashboard");
  return { success: "Grow room created." };
}
