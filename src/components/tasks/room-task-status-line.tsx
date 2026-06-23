"use client";

import { useTranslations } from "next-intl";

import type { RoomTaskSummary } from "@/lib/tasks/task-stats";

type RoomTaskStatusLineProps = {
  summary: RoomTaskSummary | undefined;
};

export function RoomTaskStatusLine({ summary }: RoomTaskStatusLineProps) {
  const t = useTranslations("growRooms.tasks");

  if (!summary || summary.totalCount === 0) {
    return <p className="text-xs text-zinc-500">{t("openZero")}</p>;
  }

  if (summary.hasOverdue) {
    return (
      <p className="text-xs font-medium text-red-300">
        <span aria-hidden>🔴</span> {t("overdue", { count: summary.overdueCount })}
      </p>
    );
  }

  if (summary.allComplete) {
    return (
      <p className="text-xs font-medium text-emerald-300">
        <span aria-hidden>🟢</span> {t("complete")}
      </p>
    );
  }

  return <p className="text-xs text-zinc-400">{t("openCount", { count: summary.openCount })}</p>;
}
