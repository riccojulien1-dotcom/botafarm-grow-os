import { Suspense } from "react";

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
  return (
    <div className="space-y-8 pb-6">
      <BfPageHeader
        eyebrow="Mission Control"
        title="Grow Journal"
        subtitle="Your cultivation notebook — daily readings, irrigation notes, and photos in one operational logbook."
      />

      <JournalDashboardStats stats={data.stats} />

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
            New entry
          </h2>
          <span className="bf-section-eyebrow">Daily log</span>
        </div>
        {data.rooms.length ? (
          <GlassPanel glow="magenta" padding="lg">
            <CreateDailyLogForm growRooms={data.rooms} />
          </GlassPanel>
        ) : (
          <GlassPanel padding="lg">
            <p className="text-sm text-zinc-400">
              Create a grow room first, then start your cultivation diary here.
            </p>
          </GlassPanel>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
            Browse diary
          </h2>
          <span className="bf-section-eyebrow">Filter timeline</span>
        </div>
        <GlassPanel padding="md">
          <Suspense fallback={<p className="text-sm text-zinc-500">Loading filters...</p>}>
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
