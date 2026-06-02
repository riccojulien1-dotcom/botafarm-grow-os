import { formatKnowledgeSourceCitation } from "@/lib/knowledge-base/brain";
import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base";
import type { KnowledgeEntry } from "@/lib/knowledge-base/types";

type KnowledgeSourceCitationProps = {
  entry: KnowledgeEntry;
};

export function KnowledgeSourceCitation({ entry }: KnowledgeSourceCitationProps) {
  const citation = formatKnowledgeSourceCitation(entry);

  return (
    <section className="bf-inset-panel border border-fuchsia-500/20 bg-fuchsia-950/10 p-4">
      <p className="bf-lab-label text-fuchsia-400/80">Botafarm source</p>
      <p className="mt-2 text-sm font-medium text-zinc-100">{citation}</p>
      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-zinc-600">Source type</dt>
          <dd className="text-zinc-300">{KNOWLEDGE_SOURCE_TYPE_LABELS[entry.sourceType]}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Catalog ID</dt>
          <dd className="font-mono text-zinc-300">{entry.id}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Topic</dt>
          <dd className="text-zinc-300">{entry.topic}</dd>
        </div>
        <div>
          <dt className="text-zinc-600">Subject</dt>
          <dd className="text-zinc-300">{entry.subject}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-zinc-500">
        Future recommendations and AI responses must cite this entry — no invented cultivation
        advice.
      </p>
    </section>
  );
}
