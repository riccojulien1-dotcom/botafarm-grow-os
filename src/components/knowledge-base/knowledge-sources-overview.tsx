import { KNOWLEDGE_ACCESS_POLICY } from "@/lib/knowledge-base";
import {
  getKnowledgeBrainStats,
  getKnowledgeSourceRegistry,
} from "@/lib/knowledge-base/sources/registry";
import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base/constants";

export function KnowledgeSourcesOverview() {
  const stats = getKnowledgeBrainStats();
  const sources = getKnowledgeSourceRegistry();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sources registered" value={String(stats.sourceCount)} />
        <StatCard label="Extracted entries" value={String(stats.entryCount)} accent />
        <StatCard label="Active categories" value={String(stats.categoryCount)} />
        <StatCard label="Documents loaded" value={String(stats.documentsLoaded)} muted />
      </div>

      <p className="text-xs text-zinc-500">
        {stats.relationshipsMapped} knowledge relationships mapped · No PDFs or books are stored
        or exposed in Grow OS.
      </p>

      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Entries</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr
                key={source.id}
                className="border-b border-white/[0.04] text-zinc-300 last:border-0"
              >
                <td className="px-3 py-2.5 font-medium text-zinc-100">{source.sourceTitle}</td>
                <td className="px-3 py-2.5 text-xs">
                  {KNOWLEDGE_SOURCE_TYPE_LABELS[source.sourceType]}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={source.ingestionStatus} />
                </td>
                <td className="px-3 py-2.5 tabular-nums">{source.extractedEntryCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-3 py-2 text-xs text-amber-100/90">
        IP policy:{" "}
        {KNOWLEDGE_ACCESS_POLICY.allowsExtractedKnowledgeOnly
          ? "extracted knowledge only"
          : "restricted"}
        . Users cannot download, browse, or read original Botafarm documents.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p>
      <p
        className={`mt-0.5 text-xl font-bold tabular-nums ${
          muted ? "text-zinc-600" : accent ? "text-fuchsia-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "indexed"
      ? "border-emerald-500/35 text-emerald-200"
      : status === "not_ingested"
        ? "border-zinc-700 text-zinc-500"
        : "border-cyan-500/35 text-cyan-200";

  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${styles}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
