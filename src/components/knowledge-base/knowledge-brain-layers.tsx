const LAYERS = [
  {
    name: "Knowledge Ingestion",
    status: "Ready",
    note: "Extracted payloads only — rejects raw books and PDFs",
  },
  {
    name: "Knowledge Indexing",
    status: "Ready",
    note: "Index records built from summaries, not source files",
  },
  {
    name: "Knowledge Retrieval",
    status: "Ready",
    note: "Public entries — no proprietary text in API responses",
  },
  {
    name: "Source Citation",
    status: "Ready",
    note: "Title + internal reference ID — never full chapters",
  },
  {
    name: "Knowledge Relationships",
    status: "Ready",
    note: "Metrics, tags, topics, and shared sources",
  },
] as const;

export function KnowledgeBrainLayers() {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {LAYERS.map((layer) => (
        <li
          key={layer.name}
          className="rounded-xl border border-fuchsia-500/15 bg-fuchsia-950/10 px-3 py-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-200/90">
              {layer.name}
            </p>
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400/90">
              {layer.status}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">{layer.note}</p>
        </li>
      ))}
    </ul>
  );
}
