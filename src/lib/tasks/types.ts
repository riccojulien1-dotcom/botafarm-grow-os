import type { TaskCategory, TaskPriority } from "@/lib/tasks/constants";

export type GrowRoomTask = {
  id: string;
  grow_room_id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  completed_at: string | null;
  priority: TaskPriority | string;
  category: TaskCategory | string;
  created_at: string;
  updated_at: string;
};
