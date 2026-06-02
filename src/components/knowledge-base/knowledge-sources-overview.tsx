import { KnowledgeSourceCoverageTable } from "@/components/knowledge-base/knowledge-source-coverage-table";
import { KNOWLEDGE_ACCESS_POLICY } from "@/lib/knowledge-base";
import { getKnowledgeBrainStats } from "@/lib/knowledge-base/sources/registry";

export function KnowledgeSourcesOverview() {
  const stats = getKnowledgeBrainStats();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Knowledge sources" value={String(stats.sourceCount)} />
        <StatCard label="Entries created" value={String(stats.entryCount)} accent />
        <StatCard label="Categories covered" value={String(stats.categoryCount)} />
        <StatCard
          label="Handbook coverage"
          value={`${stats.handbookCoveragePercent}%`}
          accent
        />
        <StatCard label="Staged (admin)" value={String(stats.stagedEntryCount)} />
        <StatCard label="Documents loaded" value={String(stats.documentsLoaded)} muted />
      </div>

      <p className="text-xs text-zinc-500">
        {stats.relationshipsMapped} knowledge relationships mapped · No PDFs or books are stored
        or exposed in Grow OS.
      </p>

      <KnowledgeSourceCoverageTable />

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
