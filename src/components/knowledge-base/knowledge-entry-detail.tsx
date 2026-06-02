import Link from "next/link";
import type { ReactNode } from "react";

import { KnowledgeRelatedEntries } from "@/components/knowledge-base/knowledge-related-entries";
import { KnowledgeRelationshipsPanel } from "@/components/knowledge-base/knowledge-relationships-panel";
import { KnowledgeSourceCitation } from "@/components/knowledge-base/knowledge-source-citation";
import {
  KNOWLEDGE_CONFIDENCE_LABELS,
  KNOWLEDGE_CONTENT_STATUS_LABELS,
  KNOWLEDGE_SOURCE_TYPE_LABELS,
} from "@/lib/knowledge-base";
import type { PublicKnowledgeEntry } from "@/lib/knowledge-base/types";

type KnowledgeEntryDetailProps = {
  entry: PublicKnowledgeEntry;
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
          Back to Brain
        </Link>
        <Link
          href={`/dashboard/knowledge?topic=${encodeURIComponent(entry.topic)}`}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-fuchsia-500/30 hover:text-fuchsia-200"
        >
          More in {entry.topic}
        </Link>
      </div>

      <header className="bf-glass bf-glass-shine rounded-2xl border border-fuchsia-500/25 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-fuchsia-900/50 bg-fuchsia-950/30 px-2 py-0.5 text-xs text-fuchsia-200">
            {entry.category}
          </span>
          <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
            {entry.subcategory}
          </span>
          <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            {KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]}
          </span>
          <span className="text-xs text-zinc-500">
            {KNOWLEDGE_CONTENT_STATUS_LABELS[entry.contentStatus]} ·{" "}
            {KNOWLEDGE_CONFIDENCE_LABELS[entry.confidenceLevel]} confidence
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white">{entry.title}</h1>
        <p className="mt-1 text-sm text-fuchsia-300/80">
          {entry.topic} · {entry.subject}
        </p>
        <p className="mt-2 text-sm text-zinc-400">{entry.shortSummary}</p>
      </header>

      <KnowledgeSourceCitation entry={entry} />

      <SectionBlock title="Extracted knowledge">
        <p className="leading-relaxed">{entry.knowledgeSummary}</p>
        <p className="text-xs text-zinc-600">
          This is Botafarm-extracted guidance — not a full book chapter or downloadable document.
        </p>
      </SectionBlock>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionBlock title="Practical actions">
          <ul className="list-inside list-disc space-y-1">
            {entry.practicalActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Common mistakes">
          <ul className="list-inside list-disc space-y-1 text-amber-100/90">
            {entry.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </SectionBlock>
      </div>

      <SectionBlock title="Warnings">
        <ul className="list-inside list-disc space-y-1 text-amber-100/90">
          {entry.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </SectionBlock>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionBlock title="Growth phases">
          <ul className="list-inside list-disc space-y-1">
            {entry.phaseRelevance.map((phase) => (
              <li key={phase}>
                <Link
                  href={`/dashboard/knowledge?phase=${encodeURIComponent(phase)}`}
                  className="text-cyan-300/90 hover:text-cyan-200"
                >
                  {phase}
                </Link>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Related metrics">
          <div className="flex flex-wrap gap-2">
            {entry.relatedMetrics.map((metric) => (
              <Link
                key={metric}
                href={`/dashboard/knowledge?metric=${encodeURIComponent(metric)}`}
                className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 transition hover:border-cyan-500/40"
              >
                {metric}
              </Link>
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No ranges documented yet.</p>
        )}
      </SectionBlock>

      {entry.tags.length ? (
        <SectionBlock title="Tags">
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Link
                key={tag}
                href={`/dashboard/knowledge?tag=${encodeURIComponent(tag)}`}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 transition hover:border-fuchsia-500/40"
              >
                {tag}
              </Link>
            ))}
          </div>
        </SectionBlock>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Knowledge relationships
        </h2>
        <GlassInset>
          <KnowledgeRelationshipsPanel entryId={entry.id} />
        </GlassInset>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Related knowledge</h2>
        <KnowledgeRelatedEntries entryId={entry.id} />
      </section>
    </article>
  );
}

function GlassInset({ children }: { children: ReactNode }) {
  return <div className="bf-inset-panel p-4">{children}</div>;
}
