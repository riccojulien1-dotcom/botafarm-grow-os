import { KnowledgeEntryCard } from "@/components/knowledge-base/knowledge-entry-card";
import { KnowledgeLibraryFilters } from "@/components/knowledge-base/knowledge-library-filters";
import { KnowledgeSearchForm } from "@/components/knowledge-base/knowledge-search-form";
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
        title="Knowledge Library"
        subtitle="Validated Botafarm books, SOPs, protocols, and guides — every future recommendation must trace to a catalog entry."
      />

      <GlassPanel padding="lg" glow="magenta">
        <KnowledgeSearchForm
          defaultQuery={query}
          hiddenParams={{ category, phase, metric, topic, tag, sourceType }}
        />
        <p className="mt-3 text-xs text-zinc-500">
          Search only returns indexed Botafarm content. Nothing is generated or invented.
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
            No entries match these filters. Import books and SOPs in a future sprint to populate
            reserved categories.
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
