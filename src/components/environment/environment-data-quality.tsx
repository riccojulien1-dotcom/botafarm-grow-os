import type { EnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

type EnvironmentDataQualityProps = {
  quality: EnvironmentIntelligence["quality"];
  roomContext: EnvironmentIntelligence["roomContext"];
};

export function EnvironmentDataQuality({
  quality,
  roomContext,
}: EnvironmentDataQualityProps) {
  return (
    <div className="bf-inset-panel grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <QualityItem label="Last reading" value={quality.lastReadingLabel} />
      <QualityItem label="Records" value={String(quality.recordCount)} accent="cyan" />
      <QualityItem label="Source" value={quality.sourceLabel} />
      <QualityItem
        label="Context room"
        value={
          roomContext
            ? `${roomContext.name} · ${roomContext.status}`
            : "No room linked"
        }
      />
    </div>
  );
}

function QualityItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "cyan";
}) {
  return (
    <div>
      <p className="bf-lab-label">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          accent === "cyan" ? "text-cyan-300" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
