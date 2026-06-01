import Link from "next/link";
import type { ReactNode } from "react";

import {
  KNOWLEDGE_SOURCE_TYPE_LABELS,
  type KnowledgeSourceType,
} from "@/lib/knowledge-base";

type KnowledgeLibraryFiltersProps = {
  totalCount: number;
  filteredCount: number;
  facets: {
    sourceTypes: KnowledgeSourceType[];
    phases: string[];
    metrics: string[];
  };
  categories: Array<{ category: string; count: number }>;
  active: {
    category?: string;
    phase?: string;
    metric?: string;
    sourceType?: string;
  };
};

function buildKnowledgeLibraryHref(params: {
  category?: string;
  phase?: string;
  metric?: string;
  sourceType?: string;
}) {
  const search = new URLSearchParams();

  if (params.category) {
    search.set("category", params.category);
  }
  if (params.phase) {
    search.set("phase", params.phase);
  }
  if (params.metric) {
    search.set("metric", params.metric);
  }
  if (params.sourceType) {
    search.set("sourceType", params.sourceType);
  }

  const query = search.toString();
  return query ? `/dashboard/knowledge?${query}` : "/dashboard/knowledge";
}

function filterChipClassName(isActive: boolean, isDisabled = false) {
  if (isDisabled) {
    return "border border-zinc-800 text-zinc-600";
  }
  if (isActive) {
    return "bg-fuchsia-600 text-white";
  }
  return "border border-zinc-700 text-zinc-400 hover:border-fuchsia-500/50";
}

export function KnowledgeLibraryFilters({
  totalCount,
  filteredCount,
  facets,
  categories,
  active,
}: KnowledgeLibraryFiltersProps) {
  const hasActiveFilters =
    !!active.category || !!active.phase || !!active.metric || !!active.sourceType;

  return (
    <aside className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-zinc-200">Filters</h2>
        <p className="text-xs text-zinc-500">
          Showing {filteredCount} of {totalCount}
        </p>
      </div>

      {hasActiveFilters ? (
        <Link
          href="/dashboard/knowledge"
          className="inline-block text-xs text-fuchsia-300 hover:text-fuchsia-200"
        >
          Clear all filters
        </Link>
      ) : null}

      <FilterGroup label="Category">
        <Link
          href={buildKnowledgeLibraryHref({
            phase: active.phase,
            metric: active.metric,
            sourceType: active.sourceType,
          })}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.category)}`}
        >
          All categories
        </Link>
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            href={
              count > 0
                ? buildKnowledgeLibraryHref({
                    category,
                    phase: active.phase,
                    metric: active.metric,
                    sourceType: active.sourceType,
                  })
                : buildKnowledgeLibraryHref({
                    phase: active.phase,
                    metric: active.metric,
                    sourceType: active.sourceType,
                  })
            }
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
          href={buildKnowledgeLibraryHref({
            category: active.category,
            metric: active.metric,
            sourceType: active.sourceType,
          })}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.phase)}`}
        >
          All phases
        </Link>
        {facets.phases.map((phase) => (
          <Link
            key={phase}
            href={buildKnowledgeLibraryHref({
              category: active.category,
              phase,
              metric: active.metric,
              sourceType: active.sourceType,
            })}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(active.phase === phase)}`}
          >
            {phase}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Metric">
        <Link
          href={buildKnowledgeLibraryHref({
            category: active.category,
            phase: active.phase,
            sourceType: active.sourceType,
          })}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.metric)}`}
        >
          All metrics
        </Link>
        {facets.metrics.map((metric) => (
          <Link
            key={metric}
            href={buildKnowledgeLibraryHref({
              category: active.category,
              phase: active.phase,
              metric,
              sourceType: active.sourceType,
            })}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(active.metric === metric)}`}
          >
            {metric}
          </Link>
        ))}
      </FilterGroup>

      <FilterGroup label="Source type">
        <Link
          href={buildKnowledgeLibraryHref({
            category: active.category,
            phase: active.phase,
            metric: active.metric,
          })}
          className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(!active.sourceType)}`}
        >
          All sources
        </Link>
        {facets.sourceTypes.map((sourceType) => (
          <Link
            key={sourceType}
            href={buildKnowledgeLibraryHref({
              category: active.category,
              phase: active.phase,
              metric: active.metric,
              sourceType,
            })}
            className={`rounded-md px-2.5 py-1 text-xs ${filterChipClassName(
              active.sourceType === sourceType,
            )}`}
          >
            {KNOWLEDGE_SOURCE_TYPE_LABELS[sourceType]}
          </Link>
        ))}
      </FilterGroup>

      <p className="text-xs text-zinc-500">
        Reserved categories with no entries are ready for book and SOP imports.
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
