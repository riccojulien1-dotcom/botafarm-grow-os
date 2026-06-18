import { JournalTimelineEntryCard } from "@/components/journal/journal-timeline-entry";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { JournalTimelineEntry } from "@/lib/journal/journal-types";

type JournalTimelineProps = {
  entries: JournalTimelineEntry[];
};

export function JournalTimeline({ entries }: JournalTimelineProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
          Timeline
        </h2>
        <span className="bf-section-eyebrow">
          {entries.length} entr{entries.length === 1 ? "y" : "ies"}
        </span>
      </div>

      {entries.length ? (
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <ol className="relative space-y-4 before:absolute before:bottom-0 before:left-[7px] before:top-0 before:w-px before:bg-white/[0.08]">
            {entries.map((entry) => (
              <JournalTimelineEntryCard key={entry.log.id} entry={entry} />
            ))}
          </ol>
        </div>
      ) : (
        <GlassPanel padding="lg">
          <p className="text-sm text-zinc-400">
            No journal entries match these filters. Log your first reading or clear filters to see
            the full diary.
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
