"use client";

import Link from "next/link";
import { useState } from "react";

import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base";
import type { KnowledgeEntrySummary } from "@/lib/knowledge-base/types";

export const NO_BOTAFARM_KNOWLEDGE_MESSAGE =
  "No Botafarm knowledge source linked yet.";

export type RoomMetricKnowledgeBundle = {
  id: string;
  label: string;
  entries: KnowledgeEntrySummary[];
};

type RoomMetricKnowledgePanelProps = {
  roomName: string;
  roomPhase: string;
  bundles: RoomMetricKnowledgeBundle[];
};

export function RoomMetricKnowledgePanel({
  roomName,
  roomPhase,
  bundles,
}: RoomMetricKnowledgePanelProps) {
  const [activeId, setActiveId] = useState(bundles[0]?.id ?? "vpd");
  const active = bundles.find((bundle) => bundle.id === activeId) ?? bundles[0];

  if (!active) {
    return null;
  }

  return (
    <div className="bf-inset-panel space-y-4 border border-fuchsia-500/20 bg-fuchsia-950/10 p-4">
      <div>
        <p className="bf-lab-label text-fuchsia-400/80">Botafarm knowledge</p>
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Metric references
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {roomName} · {roomPhase} — validated sources only
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {bundles.map((bundle) => (
          <button
            key={bundle.id}
            type="button"
            onClick={() => setActiveId(bundle.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
              activeId === bundle.id
                ? "border-fuchsia-500/50 bg-fuchsia-600/30 text-fuchsia-100"
                : "border-white/10 text-zinc-400 hover:border-fuchsia-500/30 hover:text-fuchsia-200"
            }`}
          >
            {bundle.label}
            {bundle.entries.length ? (
              <span className="ml-1.5 tabular-nums text-fuchsia-300/80">
                {bundle.entries.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {active.entries.length ? (
        <ul className="space-y-3">
          {active.entries.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/dashboard/knowledge/${entry.id}`}
                className="block rounded-xl border border-white/[0.08] bg-black/30 p-4 transition hover:border-fuchsia-500/35"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-fuchsia-900/50 bg-fuchsia-950/40 px-2 py-0.5 text-[10px] text-fuchsia-200">
                    {entry.topic}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]}
                  </span>
                </div>
                <h3 className="mt-2 font-medium text-white">{entry.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{entry.shortSummary}</p>
                <p className="mt-2 font-mono text-[10px] text-cyan-500/80">
                  Source ID: {entry.id}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 px-4 py-6 text-center text-sm text-zinc-500">
          {NO_BOTAFARM_KNOWLEDGE_MESSAGE}
        </p>
      )}

      <Link
        href={`/dashboard/knowledge?metric=${active.id}&phase=${encodeURIComponent(roomPhase)}`}
        className="inline-block text-xs text-fuchsia-300 hover:text-fuchsia-200"
      >
        Open full library for {active.label} →
      </Link>
    </div>
  );
}
