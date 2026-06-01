import Link from "next/link";
import type { ReactNode } from "react";

import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

type KnowledgeEntryDetailProps = {
  entry: KnowledgeEntry;
};

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-sm font-medium uppercase tracking-wide text-fuchsia-300/90">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-sm text-zinc-300">{children}</div>
    </section>
  );
}

export function KnowledgeEntryDetail({ entry }: KnowledgeEntryDetailProps) {
  return (
    <article className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/knowledge"
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
        >
          Back to knowledge base
        </Link>
      </div>

      <header className="rounded-xl border border-fuchsia-900/30 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-fuchsia-900/50 bg-fuchsia-950/30 px-2 py-0.5 text-xs text-fuchsia-200">
            {entry.category}
          </span>
          <span className="text-xs text-zinc-500">Source: {entry.sourceType}</span>
          <span className="text-xs text-zinc-500">ID: {entry.id}</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-white">{entry.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{entry.shortExplanation}</p>
      </header>

      <SectionBlock title="Detailed explanation">
        <p className="leading-relaxed">{entry.detailedExplanation}</p>
      </SectionBlock>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionBlock title="Phase relevance">
          <ul className="list-inside list-disc space-y-1">
            {entry.phaseRelevance.map((phase) => (
              <li key={phase}>{phase}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Related metrics">
          <div className="flex flex-wrap gap-2">
            {entry.relatedMetrics.map((metric) => (
              <span
                key={metric}
                className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200"
              >
                {metric}
              </span>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock title="Recommended ranges">
        {entry.recommendedRanges.length ? (
          <ul className="space-y-3">
            {entry.recommendedRanges.map((range) => (
              <li
                key={`${range.label}-${range.phase ?? "all"}`}
                className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3"
              >
                <p className="font-medium text-zinc-100">{range.label}</p>
                {range.phase ? (
                  <p className="text-xs text-zinc-500">Phase: {range.phase}</p>
                ) : null}
                <p className="mt-1 text-zinc-300">
                  {range.min != null && range.max != null
                    ? `${range.min} – ${range.max}${range.unit ? ` ${range.unit}` : ""}`
                    : range.notes ?? "—"}
                </p>
                {range.notes && range.min != null ? (
                  <p className="mt-1 text-xs text-zinc-500">{range.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No ranges documented yet.</p>
        )}
      </SectionBlock>

      <SectionBlock title="Warning signs">
        <ul className="list-inside list-disc space-y-1 text-amber-100/90">
          {entry.warningSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title="Botafarm note">
        <p className="rounded-lg border border-fuchsia-900/40 bg-fuchsia-950/20 p-3 text-fuchsia-100/90">
          {entry.botafarmNote}
        </p>
      </SectionBlock>

      {entry.tags?.length ? (
        <SectionBlock title="Tags">
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </SectionBlock>
      ) : null}
    </article>
  );
}
