import type { VarietyHarvestTimeline } from "@/lib/grow-rooms/crop-cycle";

type VarietyHarvestTimelineProps = {
  entries: VarietyHarvestTimeline[];
};

export function VarietyHarvestTimelineList({ entries }: VarietyHarvestTimelineProps) {
  if (!entries.length) {
    return (
      <p className="rounded-xl bf-inset-panel px-4 py-5 text-sm text-zinc-400">
        Add varieties with a harvest window or flowering target to see per-strain timing.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li
          key={entry.varietyId}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white">
                {entry.plantCount ?? 0} {entry.name}
              </p>
              <p className="text-sm text-zinc-400">
                {entry.genetics ?? "Genetics not set"}
              </p>
            </div>
            <p className="text-sm font-medium text-fuchsia-200">{entry.phaseDayLabel}</p>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
            <p>
              <span className="text-zinc-500">Timing: </span>
              {entry.harvestWindowLabel ?? entry.floweringDurationLabel}
            </p>
            <p>
              <span className="text-zinc-500">Days remaining: </span>
              {entry.daysRemainingLabel}
            </p>
            <p>
              <span className="text-zinc-500">Est. harvest: </span>
              {entry.estimatedHarvestDateStartLabel !== entry.estimatedHarvestDateEndLabel
                ? `${entry.estimatedHarvestDateStartLabel} – ${entry.estimatedHarvestDateEndLabel}`
                : entry.estimatedHarvestDateLabel}
            </p>
            {entry.harvestInDaysLabel ? (
              <p>
                <span className="text-zinc-500">Countdown: </span>
                {entry.harvestInDaysLabel}
              </p>
            ) : null}
          </div>

          {entry.harvestAlert ? (
            <p className="mt-3 rounded-md border border-amber-900/50 bg-amber-950/40 px-2 py-1.5 text-xs text-amber-200">
              {entry.harvestAlert}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
