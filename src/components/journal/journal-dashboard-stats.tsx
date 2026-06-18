import Link from "next/link";
import { BookOpen, CalendarDays, ClipboardList, DoorOpen } from "lucide-react";

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
  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatChip
          icon={CalendarDays}
          label="Latest entry"
          value={stats.latestEntryDate ?? "No logs yet"}
          tone="cyan"
        />
        <StatChip
          icon={ClipboardList}
          label="Total logs"
          value={String(stats.totalLogs)}
          tone="white"
        />
        <StatChip
          icon={DoorOpen}
          label="Missing today"
          value={String(stats.missingTodayCount)}
          tone={stats.missingTodayCount > 0 ? "amber" : "emerald"}
        />
        <StatChip
          icon={BookOpen}
          label="Rooms without updates"
          value={String(stats.staleRoomCount)}
          tone={stats.staleRoomCount > 0 ? "red" : "emerald"}
        />
      </div>

      <GlassPanel padding="md">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
            Logs per room
          </h2>
          <span className="bf-section-eyebrow">{stats.rooms.length} rooms</span>
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
                    Last entry: {room.lastLogDate ?? "Never"}
                    {!room.hasLogToday ? " · No log today" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-xs text-zinc-300">
                    {room.logCount} log{room.logCount === 1 ? "" : "s"}
                  </span>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Open room →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">Create a grow room to start logging.</p>
        )}
      </GlassPanel>
    </section>
  );
}
