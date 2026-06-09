import type { EnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

type EnvironmentDataSourceStripProps = {
  quality: EnvironmentIntelligence["quality"];
  dense?: boolean;
  growerFriendly?: boolean;
};

export function EnvironmentDataSourceStrip({
  quality,
  dense = false,
  growerFriendly = false,
}: EnvironmentDataSourceStripProps) {
  const items = growerFriendly
    ? [
        { label: "Last reading", value: quality.lastReadingLabel },
        { label: "Total readings", value: String(quality.recordCount), accent: true },
        { label: "Logged from", value: "Room journals" },
      ]
    : [
        { label: "Last update", value: quality.lastReadingLabel },
        { label: "Records", value: String(quality.recordCount), accent: true },
        { label: "Source", value: quality.sourceLabel },
      ];

  if (dense) {
    return (
      <div className="flex flex-wrap items-stretch gap-2 rounded-xl border border-cyan-500/15 bg-cyan-950/25 p-2">
        {items.map((item) => (
          <CockpitChip
            key={item.label}
            label={item.label}
            value={item.value}
            accent={item.accent}
            inline
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <CockpitChip key={item.label} label={item.label} value={item.value} accent={item.accent} />
      ))}
    </div>
  );
}

function CockpitChip({
  label,
  value,
  accent,
  inline,
}: {
  label: string;
  value: string;
  accent?: boolean;
  inline?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2 ${
        inline ? "min-w-[7rem] flex-1" : ""
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">{label}</p>
      <p
        className={`mt-0.5 text-sm font-semibold tabular-nums ${
          accent ? "text-cyan-300" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
