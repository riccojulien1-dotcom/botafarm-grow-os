import Link from "next/link";

import { KnowledgeEntryCard } from "@/components/knowledge-base/knowledge-entry-card";
import {
  getAllKnowledgeEntries,
  getCategoriesWithEntryCounts,
} from "@/lib/knowledge-base";

type KnowledgePageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function KnowledgeBasePage({ searchParams }: KnowledgePageProps) {
  const { category } = await searchParams;
  const categoryFilter = category?.trim();
  const allEntries = getAllKnowledgeEntries();
  const entries = categoryFilter
    ? allEntries.filter((entry) => entry.category === categoryFilter)
    : allEntries;
  const categories = getCategoriesWithEntryCounts();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Knowledge base</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Botafarm cultivation reference — foundation for recommendations, imports, and
          future AI retrieval. No external AI connected yet.
        </p>
      </div>

      <aside className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-sm font-medium text-zinc-200">Categories</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/dashboard/knowledge"
            className={`rounded-md px-2.5 py-1 text-xs ${
              !categoryFilter
                ? "bg-fuchsia-600 text-white"
                : "border border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            All ({allEntries.length})
          </Link>
          {categories.map(({ category: name, count }) => (
            <Link
              key={name}
              href={
                count > 0
                  ? `/dashboard/knowledge?category=${encodeURIComponent(name)}`
                  : "/dashboard/knowledge"
              }
              className={`rounded-md px-2.5 py-1 text-xs ${
                categoryFilter === name
                  ? "bg-fuchsia-600 text-white"
                  : count > 0
                    ? "border border-zinc-700 text-zinc-400 hover:border-fuchsia-500/50"
                    : "border border-zinc-800 text-zinc-600"
              }`}
            >
              {name}
              {count > 0 ? ` (${count})` : ""}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Empty categories are reserved for future book and article imports.
        </p>
      </aside>

      {entries.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {entries.map((entry) => (
            <KnowledgeEntryCard key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
          No entries in this category yet.
        </p>
      )}
    </section>
  );
}
