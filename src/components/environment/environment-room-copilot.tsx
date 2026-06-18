import { Sparkles } from "lucide-react";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { CopilotBriefing } from "@/lib/copilot/types";

type EnvironmentRoomCopilotProps = {
  roomName: string;
  happening: string;
  why: string;
  next: string;
};

export function EnvironmentRoomCopilot({
  roomName,
  happening,
  why,
  next,
}: EnvironmentRoomCopilotProps) {
  return (
    <GlassPanel glow="magenta" padding="md" className="border-fuchsia-500/20">
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <Sparkles className="h-4 w-4 text-fuchsia-300" aria-hidden />
        <p className="text-sm font-bold text-white">Botafarm AI — {roomName}</p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <AiBlock label="What is happening" value={happening} />
        <AiBlock label="Why" value={why} />
        <AiBlock label="What to do next" value={next} accent />
      </div>
    </GlassPanel>
  );
}

export function EnvironmentFarmCopilot({ briefing }: { briefing: CopilotBriefing }) {
  return (
    <GlassPanel glow="magenta" padding="lg">
      <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-950/40">
          <Sparkles className="h-5 w-5 text-fuchsia-300" aria-hidden />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fuchsia-400/80">
            Environment copilot
          </p>
          <h2 className="text-lg font-bold text-white">Climate &amp; irrigation briefing</h2>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <AiBlock label="What is happening" value={briefing.happening} />
        <AiBlock label="Why" value={briefing.why} />
        <AiBlock label="What to do next" value={briefing.next} accent />
      </div>
    </GlassPanel>
  );
}

function AiBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        accent
          ? "border-emerald-500/25 bg-emerald-950/15"
          : "border-white/[0.06] bg-black/25"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
          accent ? "text-emerald-400/80" : "text-zinc-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-200">{value}</p>
    </div>
  );
}
