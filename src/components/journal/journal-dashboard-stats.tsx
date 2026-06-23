"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, ClipboardList, DoorOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { JournalDashboardStats } from "@/lib/journal/journal-types";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type JournalDashboardStatsProps = {
  stats: JournalDashboardStats;
};

function StatChip({
  icon: Icon,
  label,
  value,
  tone = "white",
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  tone?: "cyan" | "magenta" | "red" | "emerald" | "white" | "amber";
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-300"
      : tone === "magenta"
        ? "text-fuchsia-300"
        : tone === "red"
          ? "text-red-300"
          : tone === "emerald"
            ? "text-emerald-300"
            : tone === "amber"
              ? "text-amber-300"
              : "text-white";

  return (
    <GlassPanel padding="md" className="h-full">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${toneClass}`} aria-hidden />
        <div>
          <p className="bf-section-eyebrow">{label}</p>
          <p className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>{value}</p>
        </div>
      </div>
    </GlassPanel>
  );
}

export function JournalDashboardStats({ stats }: JournalDashboardStatsProps) {
  const t = useTranslations("journal.stats");

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatChip
          icon={CalendarDays}
          label={t("latestEntry")}
          value={stats.latestEntryDate ?? t("noLogsYet")}
          tone="cyan"
        />
        <StatChip
          icon={ClipboardList}
          label={t("totalLogs")}
          value={String(stats.totalLogs)}
          tone="white"
        />
        <StatChip
          icon={DoorOpen}
          label={t("missingToday")}
          value={String(stats.missingTodayCount)}
          tone={stats.missingTodayCount > 0 ? "amber" : "emerald"}
        />
        <StatChip
          icon={BookOpen}
          label={t("roomsWithoutUpdates")}
          value={String(stats.staleRoomCount)}
          tone={stats.staleRoomCount > 0 ? "red" : "emerald"}
        />
      </div>

      <GlassPanel padding="md">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
            {t("logsPerRoom")}
          </h2>
          <span className="bf-section-eyebrow">{t("roomsCount", { count: stats.rooms.length })}</span>
        </div>
        {stats.rooms.length ? (
          <ul className="mt-3 divide-y divide-white/[0.06]">
            {stats.rooms.map((room) => (
              <li
                key={room.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-zinc-100">{toTitleCase(room.name)}</p>
                  <p className="text-xs text-zinc-500">
                    {t("lastEntry", {
                      date: room.lastLogDate ?? t("never"),
                    })}
                    {!room.hasLogToday ? t("noLogToday") : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-xs text-zinc-300">
                    {t("logCount", { count: room.logCount })}
                  </span>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    {t("openRoom")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">{t("createRoomFirst")}</p>
        )}
      </GlassPanel>
    </section>
  );
}
