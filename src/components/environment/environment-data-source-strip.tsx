import type { EnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

type EnvironmentDataSourceStripProps = {
  quality: EnvironmentIntelligence["quality"];
  dense?: boolean;
};

export function EnvironmentDataSourceStrip({
  quality,
  dense = false,
}: EnvironmentDataSourceStripProps) {
  return (
    <div
      className={`bf-inset-panel grid border-white/[0.06] ${
        dense
          ? "grid-cols-3 gap-2 p-2.5 text-xs"
          : "gap-4 p-4 sm:grid-cols-3"
      }`}
    >
      <SourceItem label="Last update" value={quality.lastReadingLabel} dense={dense} />
      <SourceItem label="Records" value={String(quality.recordCount)} dense={dense} />
      <SourceItem label="Source type" value={quality.sourceLabel} dense={dense} />
    </div>
  );
}

function SourceItem({
  label,
  value,
  dense,
}: {
  label: string;
  value: string;
  dense?: boolean;
}) {
  return (
    <div>
      <p className={dense ? "text-[9px] uppercase tracking-wider text-zinc-600" : "bf-lab-label"}>
        {label}
      </p>
      <p
        className={`font-semibold text-zinc-200 ${dense ? "mt-0.5 text-xs" : "mt-1 text-sm"}`}
      >
        {value}
      </p>
    </div>
  );
}
