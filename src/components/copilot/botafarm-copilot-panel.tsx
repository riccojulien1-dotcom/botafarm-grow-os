"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { CopilotBriefing, CopilotSignal } from "@/lib/copilot/types";

type BotafarmCopilotPanelProps = {
  briefing: CopilotBriefing;
  compact?: boolean;
};

const toneStyles: Record<CopilotSignal["tone"], string> = {
  good: "border-emerald-500/30 bg-emerald-950/25 text-emerald-200",
  watch: "border-amber-500/30 bg-amber-950/25 text-amber-100",
  action: "border-red-500/35 bg-red-950/30 text-red-200",
};

function SignalIcon({ tone }: { tone: CopilotSignal["tone"] }) {
  if (tone === "good") {
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />;
  }
  if (tone === "action") {
    return <CircleAlert className="h-4 w-4 shrink-0 text-red-400" aria-hidden />;
  }
  return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />;
}

export function BotafarmCopilotPanel({ briefing, compact = false }: BotafarmCopilotPanelProps) {
  const t = useTranslations("dashboard.copilot");

  return (
    <GlassPanel glow="magenta" padding={compact ? "md" : "lg"} className="h-full">
      <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-950/40">
          <Sparkles className="h-5 w-5 text-fuchsia-300" aria-hidden />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fuchsia-400/80">
            {t("eyebrow")}
          </p>
          <h2 className="text-lg font-bold text-white">{t("title")}</h2>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <BriefBlock label={t("happening")} value={briefing.happening} accent="cyan" />
        <BriefBlock label={t("why")} value={briefing.why} accent="amber" />
        <BriefBlock label={t("next")} value={briefing.next} accent="emerald" />
      </div>

      {briefing.signals.length ? (
        <ul className="mt-5 space-y-2">
          {briefing.signals.map((signal) => (
            <li key={signal.id}>
              {signal.href ? (
                <Link
                  href={signal.href}
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition hover:brightness-110 ${toneStyles[signal.tone]}`}
                >
                  <SignalIcon tone={signal.tone} />
                  <span className="flex-1 leading-snug">{signal.text}</span>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 opacity-60" aria-hidden />
                </Link>
              ) : (
                <div
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${toneStyles[signal.tone]}`}
                >
                  <SignalIcon tone={signal.tone} />
                  <span className="leading-snug">{signal.text}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </GlassPanel>
  );
}

function BriefBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "cyan" | "amber" | "emerald";
}) {
  const labelColor =
    accent === "cyan"
      ? "text-cyan-400/80"
      : accent === "amber"
        ? "text-amber-400/80"
        : "text-emerald-400/80";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/25 px-3 py-3">
      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${labelColor}`}>
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{value}</p>
    </div>
  );
}
