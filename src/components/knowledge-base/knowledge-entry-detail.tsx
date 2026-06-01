import Link from "next/link";
import type { ReactNode } from "react";

import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base";
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
    <section className="bf-inset-panel p-4">
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
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          Back to knowledge library
        </Link>
      </div>

      <header className="bf-glass bf-glass-shine rounded-2xl border border-fuchsia-500/25 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-fuchsia-900/50 bg-fuchsia-950/30 px-2 py-0.5 text-xs text-fuchsia-200">
            {entry.category}
          </span>
          <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            {KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]}
          </span>
          <span className="text-xs uppercase text-zinc-500">{entry.priority} priority</span>
          <span className="text-xs text-zinc-500">ID: {entry.id}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white">{entry.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{entry.shortSummary}</p>
      </header>

      <SectionBlock title="Detailed content">
        <p className="leading-relaxed">{entry.detailedContent}</p>
      </SectionBlock>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionBlock title="Practical actions">
          <ul className="list-inside list-disc space-y-1">
            {entry.practicalActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Warnings">
          <ul className="list-inside list-disc space-y-1 text-amber-100/90">
            {entry.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </SectionBlock>
      </div>

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
                    : (range.notes ?? "—")}
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

      {entry.sourceMetadata ? (
        <SectionBlock title="Source metadata">
          <dl className="grid gap-2 sm:grid-cols-2">
            {entry.sourceMetadata.documentTitle ? (
              <MetadataItem label="Document" value={entry.sourceMetadata.documentTitle} />
            ) : null}
            {entry.sourceMetadata.author ? (
              <MetadataItem label="Author" value={entry.sourceMetadata.author} />
            ) : null}
            {entry.sourceMetadata.chapter ? (
              <MetadataItem label="Chapter" value={entry.sourceMetadata.chapter} />
            ) : null}
            {entry.sourceMetadata.section ? (
              <MetadataItem label="Section" value={entry.sourceMetadata.section} />
            ) : null}
            {entry.sourceMetadata.documentId ? (
              <MetadataItem label="Document ID" value={entry.sourceMetadata.documentId} />
            ) : null}
            {entry.sourceMetadata.url ? (
              <MetadataItem label="URL" value={entry.sourceMetadata.url} />
            ) : null}
          </dl>
        </SectionBlock>
      ) : null}

      {entry.botafarmNote ? (
        <SectionBlock title="Botafarm note">
          <p className="rounded-lg border border-fuchsia-900/40 bg-fuchsia-950/20 p-3 text-fuchsia-100/90">
            {entry.botafarmNote}
          </p>
        </SectionBlock>
      ) : null}

      {entry.tags.length ? (
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

      <p className="text-xs text-zinc-600">
        Updated {entry.updatedAt.slice(0, 10)} · Catalog entry for future RAG ingestion
      </p>
    </article>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="text-sm text-zinc-200">{value}</dd>
    </div>
  );
}
