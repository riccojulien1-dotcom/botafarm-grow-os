export function EnvironmentImportPlaceholder() {
  const sources = [
    "Growlink screen capture",
    "Aroya dashboard capture",
    "TrolMaster screen capture",
    "Graph photo import",
  ];

  return (
    <div className="bf-inset-panel border border-dashed border-cyan-500/25 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="bf-lab-label text-cyan-500/80">Import data</p>
          <p className="mt-2 text-lg font-semibold text-white">Coming soon</p>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            Future AI-assisted import from controller screenshots and graph photos. Manual
            journal logs remain the source of truth for this release.
          </p>
        </div>
        <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300/90">
          AI ready
        </span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {sources.map((source) => (
          <li
            key={source}
            className="rounded-md border border-white/[0.08] bg-black/30 px-2.5 py-1 text-xs text-zinc-500"
          >
            {source}
          </li>
        ))}
      </ul>
    </div>
  );
}
