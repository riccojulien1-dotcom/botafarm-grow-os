type BfMissionKpiProps = {
  value: string | number;
  label: string;
  accent?: "cyan" | "magenta" | "white" | "alert";
  multiline?: boolean;
};

const valueColors = {
  cyan: "text-cyan-300",
  magenta: "text-fuchsia-300",
  white: "text-white",
  alert: "text-red-300",
};

export function BfMissionKpi({
  value,
  label,
  accent = "white",
  multiline = false,
}: BfMissionKpiProps) {
  return (
    <div className="bf-interactive rounded-2xl border border-white/[0.06] bg-black/30 px-5 py-6 sm:px-6">
      {multiline ? (
        <p
          className={`text-lg font-bold uppercase leading-snug tracking-tight sm:text-xl lg:text-2xl ${valueColors[accent]}`}
        >
          {value}
        </p>
      ) : (
        <p className={`bf-mega-stat tabular-nums ${valueColors[accent]}`}>{value}</p>
      )}
      <p className="bf-section-eyebrow mt-3 text-zinc-500">{label}</p>
    </div>
  );
}
