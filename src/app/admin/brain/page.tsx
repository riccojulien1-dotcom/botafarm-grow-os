import { KnowledgeBrainLayers } from "@/components/knowledge-base/knowledge-brain-layers";
import { KnowledgeSourcesOverview } from "@/components/knowledge-base/knowledge-sources-overview";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import {
  buildKnowledgeIndex,
  countKnowledgeRelationships,
  getKnowledgeBrainStats,
  getKnowledgeSourceRegistry,
} from "@/lib/knowledge-base";
import { KNOWLEDGE_BASE_ENTRIES } from "@/lib/knowledge-base/seeds";
import { UPCOMING_BOTAFARM_BOOK_SOURCES } from "@/lib/knowledge-base/upcoming-sources";

export const dynamic = "force-dynamic";

export default function AdminBrainPage() {
  const stats = getKnowledgeBrainStats();
  const registry = getKnowledgeSourceRegistry();
  const indexRecords = buildKnowledgeIndex(KNOWLEDGE_BASE_ENTRIES);

  return (
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Administrator"
        title="Brain operations"
        subtitle="Internal monitoring — ingestion, indexing, retrieval, citations, and source registry. Not visible to growers."
      />

      <GlassPanel padding="lg" glow="magenta">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Knowledge sources</h2>
        <p className="mt-1 text-sm text-zinc-500">Internal source registry and document policy</p>
        <div className="mt-4">
          <KnowledgeSourcesOverview />
        </div>
      </GlassPanel>

      <GlassPanel padding="lg">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Brain architecture</h2>
        <p className="mt-1 text-sm text-zinc-500">Layer readiness for RAG and book ingestion</p>
        <div className="mt-4">
          <KnowledgeBrainLayers />
        </div>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">Operations snapshot</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <AdminStat label="Sources registered" value={String(stats.sourceCount)} />
          <AdminStat label="Extracted entries" value={String(stats.entryCount)} />
          <AdminStat label="Active categories" value={String(stats.categoryCount)} />
          <AdminStat label="Documents loaded" value={String(stats.documentsLoaded)} />
          <AdminStat label="Index records" value={String(indexRecords.length)} />
          <AdminStat
            label="Relationships mapped"
            value={String(countKnowledgeRelationships())}
          />
          <AdminStat label="Ingestion status" value="Foundation ready" />
          <AdminStat label="Indexing status" value="In-memory index active" />
          <AdminStat label="Retrieval status" value="Catalog queries active" />
          <AdminStat label="Citation status" value="Reference IDs enforced" />
        </dl>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          Internal source registry
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          {registry.map((source) => (
            <li
              key={source.id}
              className="flex flex-wrap justify-between gap-2 rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2"
            >
              <span className="text-zinc-200">{source.sourceTitle}</span>
              <span className="font-mono text-xs text-zinc-500">
                {source.ingestionStatus} · {source.extractedEntryCount} entries
                {source.internalReferencePrefix
                  ? ` · ${source.internalReferencePrefix}-*`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">Sprint 26 book slots</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Upcoming injection targets — user Knowledge Center UX stays unchanged
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {UPCOMING_BOTAFARM_BOOK_SOURCES.map((book) => (
            <li
              key={book}
              className="rounded border border-dashed border-zinc-700 px-2.5 py-1 text-xs text-zinc-500"
            >
              {book}
            </li>
          ))}
        </ul>
      </GlassPanel>
    </section>
  );
}

function AdminStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2">
      <dt className="text-xs text-zinc-600">{label}</dt>
      <dd className="mt-0.5 font-medium text-zinc-200">{value}</dd>
    </div>
  );
}
