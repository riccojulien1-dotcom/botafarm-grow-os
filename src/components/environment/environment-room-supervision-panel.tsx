"use client";

import Link from "next/link";
import { useState } from "react";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentMetricDetailPanel } from "@/components/environment/environment-metric-detail-panel";
import { EnvironmentMetricSupervisionCard } from "@/components/environment/environment-metric-supervision-card";
import { EnvironmentRoomCopilot } from "@/components/environment/environment-room-copilot";
import { supervisionRoomStatusStyles } from "@/components/environment/environment-status-styles";
import { pickPrimarySupervisionMetric } from "@/lib/environment/environment-room-attention";
import type { SupervisionRoom } from "@/lib/environment/get-environment-supervision-data";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type EnvironmentRoomSupervisionPanelProps = {
  room: SupervisionRoom;
  highlighted?: boolean;
};

export function EnvironmentRoomSupervisionPanel({
  room,
  highlighted = false,
}: EnvironmentRoomSupervisionPanelProps) {
  const [expandedMetricKey, setExpandedMetricKey] = useState<string | null>(null);
  const expandedMetric = room.metrics.find((metric) => metric.key === expandedMetricKey) ?? null;
  const primaryMetric = pickPrimarySupervisionMetric(room.metrics);

  return (
    <li id={`room-env-${room.id}`} className="scroll-mt-24">
      <GlassPanel
        glow={
          room.roomStatus === "action"
            ? "red"
            : room.roomStatus === "watch"
              ? "magenta"
              : "cyan"
        }
        padding="lg"
        className={`w-full transition ${
          highlighted ? "ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-zinc-950" : ""
        }`}
      >
        <div className="space-y-5">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div className="min-w-0 space-y-2">
              <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
                {toTitleCase(room.name)}
              </h2>
              {room.attentionReason ? (
                <p className="text-sm font-medium text-zinc-300">{room.attentionReason}</p>
              ) : null}
              {room.lastLogFreshness ? (
                <p className="text-sm text-zinc-500">
                  Last log: <span className="text-zinc-300">{room.lastLogFreshness}</span>
                  {room.lastLogDate ? (
                    <span className="text-zinc-600"> · {room.lastLogDate}</span>
                  ) : null}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">Not enough readings</p>
              )}
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${supervisionRoomStatusStyles[room.roomStatus]}`}
            >
              <span aria-hidden>{room.roomHealthEmoji}</span>
              {room.roomStatusLabel}
            </span>
          </header>

          {room.hasJournalEntries ? (
            <>
              <EnvironmentRoomCopilot
                roomName={toTitleCase(room.name)}
                happening={
                  room.attentionReason ??
                  (room.roomStatus === "good"
                    ? "All metrics within target"
                    : "One or more metrics need review")
                }
                why={primaryMetric?.interpretation ?? room.attentionReason ?? "Not enough trend data yet."}
                next={primaryMetric?.recommendation ?? "Log this room on your next journal entry."}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
                {room.metrics.map((metric) => (
                  <EnvironmentMetricSupervisionCard
                    key={metric.key}
                    metric={metric}
                    expanded={expandedMetricKey === metric.key}
                    onToggle={() => toggleMetric(metric.key)}
                  />
                ))}
              </div>
              {expandedMetric ? <EnvironmentMetricDetailPanel metric={expandedMetric} /> : null}
            </>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-black/20 px-6 py-10 text-center">
              <p className="text-sm text-zinc-500">Not enough readings for this room yet</p>
              <Link
                href={`/rooms/${room.id}`}
                className="mt-3 inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Add journal log
              </Link>
            </div>
          )}

          <footer className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
            <QuickAction href={`/rooms/${room.id}`} label="View room journal" />
            <QuickAction href={`/rooms/${room.id}`} label="Add journal entry" />
            <QuickAction href={`/rooms/${room.id}`} label="Open room" />
          </footer>
        </div>
      </GlassPanel>
    </li>
  );

  function toggleMetric(key: string) {
    setExpandedMetricKey((current) => (current === key ? null : key));
  }
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:border-cyan-500/35 hover:text-cyan-200"
    >
      {label}
    </Link>
  );
}
