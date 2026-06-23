"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { EnvironmentDataSourceStrip } from "@/components/environment/environment-data-source-strip";
import { EnvironmentImportPlaceholder } from "@/components/environment/environment-import-placeholder";
import { EnvironmentFarmCopilot } from "@/components/environment/environment-room-copilot";
import { EnvironmentSupervisionShell } from "@/components/environment/environment-supervision-shell";
import { localizeEnvironmentFarmBriefing } from "@/lib/i18n/localize-environment";
import type { EnvironmentSupervisionData } from "@/lib/environment/get-environment-supervision-data";

type EnvironmentSupervisionViewProps = {
  data: EnvironmentSupervisionData;
};

export function EnvironmentSupervisionView({ data }: EnvironmentSupervisionViewProps) {
  const t = useTranslations("environment");
  const roomsNeedingAttention = data.rooms.filter(
    (room) => room.roomStatus === "action" || room.roomStatus === "watch",
  ).length;

  const farmBriefing = localizeEnvironmentFarmBriefing(t, data.rooms);
  const readingLabel =
    data.totalLogs > 0 ? t("page.readingCount", { count: data.totalLogs }) : t("page.noReadingsYet");

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          {t("page.missionControl")}
        </Link>
      </div>

      <BfPageHeader
        eyebrow={t("page.eyebrow")}
        title={t("page.title")}
        subtitle={t("page.subtitle")}
      />

      {data.rooms.length ? (
        <>
          <EnvironmentFarmCopilot briefing={farmBriefing} />
          <EnvironmentSupervisionShell data={data} />
        </>
      ) : (
        <GlassPanel padding="md">
          <p className="text-sm text-zinc-500">{t("page.empty")}</p>
        </GlassPanel>
      )}

      <section className="space-y-3 border-t border-white/[0.06] pt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
          {t("page.currentConditions")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryTile label={t("page.growRooms")} value={String(data.rooms.length)} />
          <SummaryTile label={t("page.roomsNeedingAttention")} value={String(roomsNeedingAttention)} />
          <SummaryTile label={t("page.journalReadings")} value={String(data.totalLogs)} />
        </div>
      </section>

      <section className="space-y-3 border-t border-white/[0.06] pt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
          {t("page.moreTools")}
        </h2>
        <GlassPanel padding="md">
          <EnvironmentDataSourceStrip
            growerFriendly
            quality={{
              lastReadingAt: null,
              lastReadingLabel: readingLabel,
              recordCount: data.totalLogs,
              sourceLabel: t("page.manualLogs"),
            }}
          />
        </GlassPanel>
        <EnvironmentImportPlaceholder />
      </section>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <GlassPanel padding="md">
      <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{label}</p>
    </GlassPanel>
  );
}
