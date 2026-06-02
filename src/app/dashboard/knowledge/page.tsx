import { KnowledgeBrainLayers } from "@/components/knowledge-base/knowledge-brain-layers";
import { KnowledgeEntryCard } from "@/components/knowledge-base/knowledge-entry-card";
import { KnowledgeLibraryFilters } from "@/components/knowledge-base/knowledge-library-filters";
import { KnowledgeSearchForm } from "@/components/knowledge-base/knowledge-search-form";
import { KnowledgeSourcesOverview } from "@/components/knowledge-base/knowledge-sources-overview";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import {
  filterKnowledgeEntries,
  getAllKnowledgeEntries,
  getCategoriesWithEntryCounts,
  getKnowledgeFilterFacets,
  toKnowledgeSummary,
} from "@/lib/knowledge-base";
import type { KnowledgeSourceType } from "@/lib/knowledge-base";

type KnowledgePageProps = {
  searchParams: Promise<{
    category?: string;
    phase?: string;
    metric?: string;
    topic?: string;
    tag?: string;
    sourceType?: string;
    q?: string;
  }>;
};

function parseSourceType(value: string | undefined): KnowledgeSourceType | undefined {
  const allowed: KnowledgeSourceType[] = [
    "book",
    "SOP",
    "blog",
    "protocol",
    "guide",
    "article",
    "rule",
  ];
  if (!value) {
    return undefined;
  }
  return allowed.includes(value as KnowledgeSourceType)
    ? (value as KnowledgeSourceType)
    : undefined;
}

export default async function KnowledgeLibraryPage({ searchParams }: KnowledgePageProps) {
  const params = await searchParams;
  const category = params.category?.trim();
  const phase = params.phase?.trim();
  const metric = params.metric?.trim();
  const topic = params.topic?.trim();
  const tag = params.tag?.trim();
  const query = params.q?.trim();
  const sourceType = parseSourceType(params.sourceType?.trim());

  const allEntries = getAllKnowledgeEntries();
  const entries = filterKnowledgeEntries({
    category,
    phase,
    metric,
    topic,
    tag,
    sourceType,
    query,
  });
  const categories = getCategoriesWithEntryCounts();
  const facets = getKnowledgeFilterFacets();

  return (
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Botafarm Brain"
        title="Knowledge extraction"
        subtitle="Extracted rules, SOP summaries, and diagnostics — traceable citations only. No books, PDFs, or raw source text."
      />

      <GlassPanel padding="lg" glow="magenta">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Knowledge sources</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Source registry for Sprint 25 ingestion — documents are not loaded or visible.
        </p>
        <div className="mt-4">
          <KnowledgeSourcesOverview />
        </div>
      </GlassPanel>

      <GlassPanel padding="lg">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Brain architecture</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Ingestion, indexing, retrieval, citation, and relationship layers — ready without OpenAI or
          embeddings.
        </p>
        <div className="mt-4">
          <KnowledgeBrainLayers />
        </div>
      </GlassPanel>

      <GlassPanel padding="lg" glow="magenta">
        <KnowledgeSearchForm
          defaultQuery={query}
          hiddenParams={{ category, phase, metric, topic, tag, sourceType }}
        />
        <p className="mt-3 text-xs text-zinc-500">
          Search returns extracted Botafarm knowledge only. Nothing is generated or invented.
        </p>
      </GlassPanel>

      <GlassPanel padding="lg">
        <KnowledgeLibraryFilters
          totalCount={allEntries.length}
          filteredCount={entries.length}
          facets={facets}
          categories={categories}
          active={{ category, phase, metric, topic, tag, sourceType, query }}
        />
      </GlassPanel>

      {entries.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <KnowledgeEntryCard key={entry.id} entry={toKnowledgeSummary(entry)} />
          ))}
        </ul>
      ) : (
        <GlassPanel padding="lg">
          <p className="text-sm text-zinc-400">
            No extracted entries match these filters. Reserved sources await Sprint 25 book &amp; SOP
            ingestion.
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
