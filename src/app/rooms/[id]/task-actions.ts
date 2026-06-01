"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/get-user";
import { parseTaskFormData } from "@/lib/tasks/parse-task-form";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error?: string; success?: string };

function revalidateTaskPaths(growRoomId: string) {
  revalidatePath(`/rooms/${growRoomId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/grow-rooms");
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

async function verifyOwnedTask(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  taskId: string,
  growRoomId: string,
) {
  const { data: task, error } = await supabase
    .from("grow_room_tasks")
    .select("id")
    .eq("id", taskId)
    .eq("grow_room_id", growRoomId)
    .eq("user_id", userId)
    .maybeSingle();

  return !error && !!task;
}

export async function createGrowRoomTaskAction(
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

  const parsed = parseTaskFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const now = new Date().toISOString();

  const { error } = await supabase.from("grow_room_tasks").insert({
    user_id: user.id,
    grow_room_id: growRoomId,
    title: parsed.payload.title,
    description: parsed.payload.description,
    due_date: parsed.payload.due_date,
    priority: parsed.payload.priority,
    category: parsed.payload.category,
    completed: parsed.payload.completed,
    completed_at: parsed.payload.completed ? now : null,
    updated_at: now,
  });

  if (error) {
    return { error: error.message };
  }

  revalidateTaskPaths(growRoomId);
  return { success: "Task created." };
}

export async function updateGrowRoomTaskAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const taskId = String(formData.get("task_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!taskId || !growRoomId) {
    return { error: "Missing task or grow room." };
  }

  if (!(await verifyOwnedTask(supabase, user.id, taskId, growRoomId))) {
    return { error: "You cannot edit this task." };
  }

  const parsed = parseTaskFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("grow_room_tasks")
    .update({
      title: parsed.payload.title,
      description: parsed.payload.description,
      due_date: parsed.payload.due_date,
      priority: parsed.payload.priority,
      category: parsed.payload.category,
      completed: parsed.payload.completed,
      completed_at: parsed.payload.completed ? now : null,
      updated_at: now,
    })
    .eq("id", taskId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  revalidateTaskPaths(growRoomId);
  return { success: "Task updated." };
}

export async function toggleGrowRoomTaskCompleteAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const taskId = String(formData.get("task_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();
  const markComplete = formData.get("mark_complete") === "true";

  if (!taskId || !growRoomId) {
    return { error: "Missing task or grow room." };
  }

  if (!(await verifyOwnedTask(supabase, user.id, taskId, growRoomId))) {
    return { error: "You cannot update this task." };
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("grow_room_tasks")
    .update({
      completed: markComplete,
      completed_at: markComplete ? now : null,
      updated_at: now,
    })
    .eq("id", taskId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  revalidateTaskPaths(growRoomId);
  return { success: markComplete ? "Task completed." : "Task reopened." };
}

export async function deleteGrowRoomTaskAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const taskId = String(formData.get("task_id") ?? "").trim();
  const growRoomId = String(formData.get("grow_room_id") ?? "").trim();

  if (!taskId || !growRoomId) {
    return { error: "Missing task or grow room." };
  }

  if (!(await verifyOwnedTask(supabase, user.id, taskId, growRoomId))) {
    return { error: "You cannot delete this task." };
  }

  const { error } = await supabase
    .from("grow_room_tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id)
    .eq("grow_room_id", growRoomId);

  if (error) {
    return { error: error.message };
  }

  revalidateTaskPaths(growRoomId);
  return { success: "Task deleted." };
}
