import {
  isTaskCategory,
  isTaskPriority,
  type TaskCategory,
  type TaskPriority,
} from "@/lib/tasks/constants";

export type TaskFormPayload = {
  title: string;
  description: string | null;
  due_date: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
};

export function parseTaskFormData(
  formData: FormData,
): { ok: true; payload: TaskFormPayload } | { ok: false; error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "medium").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const completed = formData.get("completed") === "on" || formData.get("completed") === "true";

  if (!title) {
    return { ok: false, error: "Task title is required." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { ok: false, error: "Please provide a valid due date." };
  }

  if (!isTaskPriority(priorityRaw)) {
    return { ok: false, error: "Please select a valid priority." };
  }

  if (!isTaskCategory(categoryRaw)) {
    return { ok: false, error: "Please select a valid category." };
  }

  return {
    ok: true,
    payload: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      due_date: dueDate,
      priority: priorityRaw,
      category: categoryRaw,
      completed,
    },
  };
}
