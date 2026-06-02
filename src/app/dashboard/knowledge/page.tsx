import { KnowledgeEntryCard } from "@/components/knowledge-base/knowledge-entry-card";
import { KnowledgeLibraryFilters } from "@/components/knowledge-base/knowledge-library-filters";
import { KnowledgePopularTopics } from "@/components/knowledge-base/knowledge-popular-topics";
import { KnowledgeRecentlyViewed } from "@/components/knowledge-base/knowledge-recently-viewed";
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

type KnowledgePageProps = {
  searchParams: Promise<{
    category?: string;
    phase?: string;
    metric?: string;
    topic?: string;
    tag?: string;
    q?: string;
  }>;
};

export default async function KnowledgeCenterPage({ searchParams }: KnowledgePageProps) {
  const params = await searchParams;
  const category = params.category?.trim();
  const phase = params.phase?.trim();
  const metric = params.metric?.trim();
  const topic = params.topic?.trim();
  const tag = params.tag?.trim();
  const query = params.q?.trim();

  const allEntries = getAllKnowledgeEntries();
  const entries = filterKnowledgeEntries({
    category,
    phase,
    metric,
    topic,
    tag,
    query,
  });
  const categories = getCategoriesWithEntryCounts();
  const facets = getKnowledgeFilterFacets();

  return (
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Botafarm"
        title="Knowledge Center"
        subtitle="Explore concepts, cultivation metrics, irrigation strategies, crop steering principles, environmental control, and growing knowledge."
      />

      <GlassPanel padding="lg" glow="magenta">
        <h2 className="text-sm font-bold uppercase tracking-wide text-fuchsia-300/90">
          Popular topics
        </h2>
        <div className="mt-3">
          <KnowledgePopularTopics />
        </div>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
          Recently viewed
        </h2>
        <div className="mt-3">
          <KnowledgeRecentlyViewed />
        </div>
      </GlassPanel>

      <GlassPanel padding="lg" glow="cyan">
        <KnowledgeSearchForm
          defaultQuery={query}
          hiddenParams={{ category, phase, metric, topic, tag }}
        />
        <p className="mt-3 text-xs text-zinc-500">
          Search Botafarm cultivation concepts — referenced expertise only.
        </p>
      </GlassPanel>

      <GlassPanel padding="lg">
        <KnowledgeLibraryFilters
          totalCount={allEntries.length}
          filteredCount={entries.length}
          facets={facets}
          categories={categories}
          active={{ category, phase, metric, topic, tag, query }}
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
            No concepts match your search. Try another topic or metric.
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
