import { KnowledgeEntryCard } from "@/components/knowledge-base/knowledge-entry-card";
import { KnowledgeLibraryFilters } from "@/components/knowledge-base/knowledge-library-filters";
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
    sourceType?: string;
  }>;
};

function parseSourceType(value: string | undefined): KnowledgeSourceType | undefined {
  const allowed: KnowledgeSourceType[] = ["book", "SOP", "blog", "protocol", "rule"];
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
  const sourceType = parseSourceType(params.sourceType?.trim());

  const allEntries = getAllKnowledgeEntries();
  const entries = filterKnowledgeEntries({
    category,
    phase,
    metric,
    sourceType,
  });
  const categories = getCategoriesWithEntryCounts();
  const facets = getKnowledgeFilterFacets();

  return (
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Mission Control"
        title="Knowledge Library"
        subtitle="Botafarm books, SOPs, protocols, and cultivation rules — structured for recommendations and retrieval."
      />

      <GlassPanel padding="lg">
        <KnowledgeLibraryFilters
          totalCount={allEntries.length}
          filteredCount={entries.length}
          facets={facets}
          categories={categories}
          active={{ category, phase, metric, sourceType }}
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
          <p className="text-sm text-zinc-400">No entries match these filters.</p>
        </GlassPanel>
      )}
    </section>
  );
}
