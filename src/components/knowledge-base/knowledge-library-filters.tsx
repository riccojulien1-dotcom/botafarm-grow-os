import Link from "next/link";
import type { ReactNode } from "react";

import {
  KNOWLEDGE_SOURCE_TYPE_LABELS,
  type KnowledgeSourceType,
} from "@/lib/knowledge-base";

type ActiveFilters = {
  category?: string;
  phase?: string;
  metric?: string;
  topic?: string;
  tag?: string;
  sourceType?: string;
  query?: string;
};

type KnowledgeLibraryFiltersProps = {
  totalCount: number;
  filteredCount: number;
  facets: {
    sourceTypes: KnowledgeSourceType[];
    phases: string[];
    metrics: string[];
    topics: string[];
    tags: string[];
  };
  categories: Array<{ category: string; count: number }>;
  active: ActiveFilters;
};

function buildKnowledgeLibraryHref(overrides: ActiveFilters & { clear?: boolean }) {
  if (overrides.clear) {
    return overrides.query ? `/dashboard/knowledge?q=${encodeURIComponent(overrides.query)}` : "/dashboard/knowledge";
  }

  const search = new URLSearchParams();

  const merged: ActiveFilters = {
    category: overrides.category,
    phase: overrides.phase,
    metric: overrides.metric,
    topic: overrides.topic,
    tag: overrides.tag,
    sourceType: overrides.sourceType,
    query: overrides.query,
  };

  if (merged.query) {
    search.set("q", merged.query);
  }
  if (merged.category) {
    search.set("category", merged.category);
  }
  if (merged.phase) {
    search.set("phase", merged.phase);
  }
  if (merged.metric) {
    search.set("metric", merged.metric);
  }
  if (merged.topic) {
    search.set("topic", merged.topic);
  }
  if (merged.tag) {
    search.set("tag", merged.tag);
  }
  if (merged.sourceType) {
    search.set("sourceType", merged.sourceType);
  }

  const query = search.toString();
  return query ? `/dashboard/knowledge?${query}` : "/dashboard/knowledge";
}

function withActive(
  active: ActiveFilters,
  patch: Partial<ActiveFilters>,
): ActiveFilters {
  return {
    category: patch.category !== undefined ? patch.category : active.category,
    phase: patch.phase !== undefined ? patch.phase : active.phase,
    metric: patch.metric !== undefined ? patch.metric : active.metric,
    topic: patch.topic !== undefined ? patch.topic : active.topic,
    tag: patch.tag !== undefined ? patch.tag : active.tag,
    sourceType: patch.sourceType !== undefined ? patch.sourceType : active.sourceType,
    query: active.query,
  };
}

function filterChipClassName(isActive: boolean, isDisabled = false) {
  if (isDisabled) {
    return "border border-zinc-800 text-zinc-600";
  }
  if (isActive) {
    return "bg-fuchsia-600 text-white";
  }
  return "border border-white/10 text-zinc-400 transition hover:border-fuchsia-500/50 hover:text-fuchsia-200";
}

export function KnowledgeLibraryFilters({
  totalCount,
  filteredCount,
  facets,
  categories,
  active,
}: KnowledgeLibraryFiltersProps) {
  const hasActiveFilters =
    !!active.category ||
    !!active.phase ||
    !!active.metric ||
    !!active.topic ||
    !!active.tag ||
    !!active.sourceType;

  return (
    <aside className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-zinc-200">Categories &amp; filters</h2>
        <p className="text-xs text-zinc-500">
          Showing {filteredCount} of {totalCount}
        </p>
      </div>

      {hasActiveFilters ? (
        <Link
          href={buildKnowledgeLibraryHref({ clear: true, query: active.query })}
          className="inline-block text-xs text-fuchsia-300 hover:text-fuchsia-200"
        >
          Clear filters
        </Link>
      ) : null}

      <FilterGroup label="Topic">
        <Link
          href={buildKnowledgeLibraryHref(withActive(active, { topic: undefined }))}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.topic)}`}
        >
          All topics
        </Link>
        {facets.topics.map((topic) => (
          <Link
            key={topic}
            href={buildKnowledgeLibraryHref(withActive(active, { topic }))}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(active.topic === topic)}`}
          >
            {topic}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Category">
        <Link
          href={buildKnowledgeLibraryHref(withActive(active, { category: undefined }))}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.category)}`}
        >
          All categories
        </Link>
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            href={buildKnowledgeLibraryHref(
              withActive(active, { category: count > 0 ? category : undefined }),
            )}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(
              active.category === category,
              count === 0,
            )}`}
          >
            {category}
            {count > 0 ? ` (${count})` : ""}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Phase">
        <Link
          href={buildKnowledgeLibraryHref(withActive(active, { phase: undefined }))}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.phase)}`}
        >
          All phases
        </Link>
        {facets.phases.map((phase) => (
          <Link
            key={phase}
            href={buildKnowledgeLibraryHref(withActive(active, { phase }))}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(active.phase === phase)}`}
          >
            {phase}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Metric">
        <Link
          href={buildKnowledgeLibraryHref(withActive(active, { metric: undefined }))}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.metric)}`}
        >
          All metrics
        </Link>
        {facets.metrics.map((metric) => (
          <Link
            key={metric}
            href={buildKnowledgeLibraryHref(withActive(active, { metric }))}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(active.metric === metric)}`}
          >
            {metric}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Tags">
        <Link
          href={buildKnowledgeLibraryHref(withActive(active, { tag: undefined }))}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.tag)}`}
        >
          All tags
        </Link>
        {facets.tags.map((tag) => (
          <Link
            key={tag}
            href={buildKnowledgeLibraryHref(withActive(active, { tag }))}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(active.tag === tag)}`}
          >
            {tag}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Source type">
        <Link
          href={buildKnowledgeLibraryHref(withActive(active, { sourceType: undefined }))}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.sourceType)}`}
        >
          All sources
        </Link>
        {facets.sourceTypes.map((sourceType) => (
          <Link
            key={sourceType}
            href={buildKnowledgeLibraryHref(withActive(active, { sourceType }))}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(
              active.sourceType === sourceType,
            )}`}
          >
            {KNOWLEDGE_SOURCE_TYPE_LABELS[sourceType]}
          </Link>
        ))}
      </FilterGroup>

      <p className="text-xs text-zinc-500">
        Reserved categories await Sprint 24 book &amp; SOP ingestion. Retrieval APIs are ready for
        RAG in Sprint 25.
      </p>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
