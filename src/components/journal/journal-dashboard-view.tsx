"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";

import { CreateDailyLogForm } from "@/components/journal/create-daily-log-form";
import { JournalDashboardStats } from "@/components/journal/journal-dashboard-stats";
import { JournalFilters } from "@/components/journal/journal-filters";
import { JournalTimeline } from "@/components/journal/journal-timeline";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { JournalPageData } from "@/lib/journal/get-journal-page-data";

type JournalDashboardViewProps = {
  data: JournalPageData;
  filters: {
    roomId?: string;
    from?: string;
    to?: string;
  };
};

export function JournalDashboardView({ data, filters }: JournalDashboardViewProps) {
  const t = useTranslations("journal.page");

  return (
    <div className="space-y-8 pb-6">
      <BfPageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <JournalDashboardStats stats={data.stats} />

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
            {t("newEntry")}
          </h2>
          <span className="bf-section-eyebrow">{t("dailyLog")}</span>
        </div>
        {data.rooms.length ? (
          <GlassPanel glow="magenta" padding="lg">
            <CreateDailyLogForm growRooms={data.rooms} />
          </GlassPanel>
        ) : (
          <GlassPanel padding="lg">
            <p className="text-sm text-zinc-400">{t("noRoomsYet")}</p>
          </GlassPanel>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
            {t("browseDiary")}
          </h2>
          <span className="bf-section-eyebrow">{t("filterTimeline")}</span>
        </div>
        <GlassPanel padding="md">
          <Suspense fallback={<p className="text-sm text-zinc-500">{t("loadingFilters")}</p>}>
            <JournalFilters
              rooms={data.rooms}
              initialRoomId={filters.roomId ?? ""}
              initialFrom={filters.from ?? ""}
              initialTo={filters.to ?? ""}
            />
          </Suspense>
        </GlassPanel>
      </section>

      <JournalTimeline entries={data.timeline} />
    </div>
  );
}
