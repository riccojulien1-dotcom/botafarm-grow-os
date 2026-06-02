import { KnowledgeEntryCard } from "@/components/knowledge-base/knowledge-entry-card";
import { getRelatedKnowledge, toKnowledgeSummary, toPublicKnowledgeEntry } from "@/lib/knowledge-base";

type KnowledgeRelatedEntriesProps = {
  entryId: string;
};

export function KnowledgeRelatedEntries({ entryId }: KnowledgeRelatedEntriesProps) {
  const related = getRelatedKnowledge(entryId);

  if (!related.length) {
    return (
      <p className="text-sm text-zinc-500">No related Botafarm knowledge entries in the catalog yet.</p>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {related.map((entry) => (
        <KnowledgeEntryCard
          key={entry.id}
          entry={toKnowledgeSummary(toPublicKnowledgeEntry(entry))}
        />
      ))}
    </ul>
  );
}
