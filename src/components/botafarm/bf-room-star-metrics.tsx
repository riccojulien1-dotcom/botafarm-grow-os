import {
  formatMissionDate,
  formatRoomStatusLabel,
} from "@/lib/ui/format-mission-labels";

type BfRoomStarMetricsProps = {
  status: string;
  roomName?: string;
  currentDay: number | null;
  daysLeft: number | null;
  plantCount: number;
  harvestDate: string | null;
  actionLabel?: string | null;
  showRoomName?: boolean;
};

export function BfRoomStarMetrics({
  status,
  roomName,
  currentDay,
  daysLeft,
  plantCount,
  harvestDate,
  actionLabel,
  showRoomName = false,
}: BfRoomStarMetricsProps) {
  const harvestDisplay =
    harvestDate && harvestDate !== "Not set"
      ? formatMissionDate(harvestDate)
      : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="bf-section-eyebrow text-fuchsia-400/80">
            {formatRoomStatusLabel(status)}
          </p>
          {showRoomName && roomName ? (
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
              {roomName}
            </h3>
          ) : null}
        </div>
        {actionLabel ? (
          <span className="rounded-lg border border-red-500/45 bg-red-950/55 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red-200 shadow-[0_0_20px_rgba(248,113,113,0.2)]">
            {actionLabel}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-white/[0.06] py-6 sm:grid-cols-4">
        <StarMetric
          label="Current day"
          value={currentDay != null ? `DAY ${currentDay}` : "—"}
          large
        />
        <StarMetric
          label="Days left"
          value={daysLeft != null ? String(Math.max(daysLeft, 0)) : "—"}
          suffix={daysLeft != null ? "DAYS LEFT" : undefined}
          accent="magenta"
          large
        />
        <StarMetric label="Plants" value={String(plantCount)} large />
        <StarMetric label="Next harvest" value={harvestDisplay} accent="cyan" />
      </div>
    </div>
  );
}

function StarMetric({
  label,
  value,
  suffix,
  accent,
  large = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: "cyan" | "magenta";
  large?: boolean;
}) {
  const valueClass =
    accent === "magenta"
      ? "text-fuchsia-300"
      : accent === "cyan"
        ? "text-cyan-300"
        : "text-white";

  return (
    <div>
      <p className="bf-section-eyebrow">{label}</p>
      <p
        className={`mt-2 font-bold uppercase tracking-tight ${valueClass} ${
          large ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg"
        }`}
      >
        {value}
      </p>
      {suffix ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          {suffix}
        </p>
      ) : null}
    </div>
  );
}
