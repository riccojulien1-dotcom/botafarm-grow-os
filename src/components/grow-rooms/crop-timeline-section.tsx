import { GrowRoomCycleSummary } from "@/components/grow-rooms/grow-room-cycle-summary";
import { getCropCycleEngine } from "@/lib/grow-rooms/crop-cycle";

type CropTimelineSectionProps = {
  status: string;
  cycleStartDate: string | null;
  targetCycleDays: number | null;
  roomName: string;
};

const TIMELINE_PHASES = [
  "Vegetative",
  "Pre-Flower",
  "Flower",
  "Drying",
  "Cure",
] as const;

export function CropTimelineSection({
  status,
  cycleStartDate,
  targetCycleDays,
  roomName,
}: CropTimelineSectionProps) {
  const cycle = getCropCycleEngine(status, cycleStartDate, targetCycleDays);
  const activePhaseIndex = TIMELINE_PHASES.findIndex((phase) => phase === status);

  return (
    <section className="space-y-4 rounded-xl border border-fuchsia-900/30 bg-zinc-900/50 p-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Crop timeline</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Automatic cycle position for {roomName}, calculated from status, start date, and
          target days.
        </p>
      </div>

      <div className="rounded-xl border border-fuchsia-900/40 bg-zinc-950/60 p-4">
        <p className="text-2xl font-semibold tracking-tight text-fuchsia-200">
          {cycle.phaseDayLabel}
        </p>
        {cycle.progressPercent != null ? (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Cycle progress</span>
              <span>{cycle.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-700 to-fuchsia-400 transition-all"
                style={{ width: `${cycle.progressPercent}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <ol className="flex min-w-[32rem] gap-2">
          {TIMELINE_PHASES.map((phase, index) => {
            const isActive = phase === status;
            const isPast = activePhaseIndex >= 0 && index < activePhaseIndex;

            return (
              <li
                key={phase}
                className={`flex-1 rounded-lg border px-3 py-2 text-center text-xs ${
                  isActive
                    ? "border-fuchsia-500 bg-fuchsia-950/50 text-fuchsia-200"
                    : isPast
                      ? "border-zinc-700 bg-zinc-900/80 text-zinc-400"
                      : "border-zinc-800 bg-zinc-950/40 text-zinc-500"
                }`}
              >
                {phase}
              </li>
            );
          })}
        </ol>
      </div>

      <GrowRoomCycleSummary
        status={status}
        cycleStartDate={cycleStartDate}
        targetCycleDays={targetCycleDays}
      />

      {status === "Flower" && cycle.harvestInDaysLabel ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">
          <p>{cycle.harvestInDaysLabel}</p>
          {cycle.estimatedHarvestDateLabel !== "Not set" ? (
            <p className="mt-1 text-zinc-400">
              Estimated harvest: {cycle.estimatedHarvestDateLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      {cycle.harvestAlert ? (
        <p
          className="rounded-md border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm font-medium text-amber-200"
          role="status"
        >
          {cycle.harvestAlert}
        </p>
      ) : null}
    </section>
  );
}
