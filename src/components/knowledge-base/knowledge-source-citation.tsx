import { buildKnowledgeCitation } from "@/lib/knowledge-base/layers/citation";
import {
  KNOWLEDGE_CONFIDENCE_LABELS,
  KNOWLEDGE_CONTENT_STATUS_LABELS,
  KNOWLEDGE_SOURCE_TYPE_LABELS,
} from "@/lib/knowledge-base";
import type { PublicKnowledgeEntry } from "@/lib/knowledge-base/types";

type KnowledgeSourceCitationProps = {
  entry: PublicKnowledgeEntry;
};

export function KnowledgeSourceCitation({ entry }: KnowledgeSourceCitationProps) {
  const citation = buildKnowledgeCitation(entry);

  return (
    <section className="bf-inset-panel border border-fuchsia-500/20 bg-fuchsia-950/10 p-4">
      <p className="bf-lab-label text-fuchsia-400/80">Source citation</p>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-zinc-600">Source</dt>
          <dd className="font-medium text-zinc-100">{citation.sourceTitle}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Reference</dt>
          <dd className="font-mono text-fuchsia-300">{citation.internalReferenceId}</dd>
        </div>
        {citation.section ? (
          <div>
            <dt className="text-zinc-600">Section</dt>
            <dd className="text-zinc-300">{citation.section}</dd>
          </div>
        ) : null}
      </dl>
      <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-zinc-600">Source type</dt>
          <dd className="text-zinc-300">{KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Catalog entry</dt>
          <dd className="font-mono text-zinc-300">{entry.id}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Content status</dt>
          <dd className="text-zinc-300">
            {KNOWLEDGE_CONTENT_STATUS_LABELS[entry.contentStatus]}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-600">Confidence</dt>
          <dd className="text-zinc-300">
            {KNOWLEDGE_CONFIDENCE_LABELS[entry.confidenceLevel]}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-zinc-500">
        Citation only — original Botafarm documents are never shown, downloaded, or exported.
      </p>
    </section>
  );
}
