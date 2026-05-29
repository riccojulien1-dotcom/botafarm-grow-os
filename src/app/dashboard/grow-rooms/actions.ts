"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/get-user";
import { parseGrowRoomFormData } from "@/lib/grow-rooms/parse-grow-room-form";
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

  const { error } = await supabase.from("grow_rooms").insert({
    user_id: user.id,
    ...parsed.payload,
  });

  if (error) {
    return { error: error.message };
  }

  revalidateGrowRoomPaths();
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
  redirect("/dashboard/grow-rooms");
}
