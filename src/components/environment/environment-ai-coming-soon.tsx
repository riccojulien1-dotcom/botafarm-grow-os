type EnvironmentAiComingSoonProps = {
  compact?: boolean;
};

const FUTURE_CAPABILITIES = [
  "Screenshot import",
  "Temperature curve analysis",
  "Humidity & VPD diagnostics",
  "Excess irrigation detection",
  "Dryback monitoring",
  "EC accumulation alerts",
];

export function EnvironmentAiComingSoon({ compact = false }: EnvironmentAiComingSoonProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-white/[0.08] bg-black/20 px-3 py-2">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-zinc-600">
            Environment intelligence
          </p>
          <p className="text-xs font-medium text-zinc-400">AI analysis coming soon</p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-fuchsia-400/70">
          Future
        </span>
      </div>
    );
  }

  return (
    <div className="bf-inset-panel border border-dashed border-fuchsia-500/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="bf-lab-label text-fuchsia-400/80">Environment intelligence</p>
          <p className="mt-1 text-base font-semibold text-zinc-300">AI analysis coming soon</p>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Future analysis from controller screenshots, graph photos, and your log history — no
            AI in this release.
          </p>
        </div>
        <span className="rounded-full border border-fuchsia-500/25 bg-fuchsia-950/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-fuchsia-300/80">
          Planned
        </span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {FUTURE_CAPABILITIES.map((item) => (
          <li
            key={item}
            className="rounded border border-white/[0.06] bg-black/25 px-2 py-0.5 text-[11px] text-zinc-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
