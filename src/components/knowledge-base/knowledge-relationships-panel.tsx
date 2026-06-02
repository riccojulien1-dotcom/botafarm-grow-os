import Link from "next/link";

import { getKnowledgeRelationshipsForEntry } from "@/lib/knowledge-base/layers/relationships";
import { getKnowledgeEntryById } from "@/lib/knowledge-base";

type KnowledgeRelationshipsPanelProps = {
  entryId: string;
};

export function KnowledgeRelationshipsPanel({ entryId }: KnowledgeRelationshipsPanelProps) {
  const relationships = getKnowledgeRelationshipsForEntry(entryId).slice(0, 12);

  if (!relationships.length) {
    return (
      <p className="text-sm text-zinc-500">No mapped relationships for this entry yet.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {relationships.map((relationship) => {
        const target = getKnowledgeEntryById(relationship.toEntryId);
        if (!target) {
          return null;
        }

        return (
          <li key={`${relationship.type}-${relationship.toEntryId}`}>
            <Link
              href={`/dashboard/knowledge/${target.id}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2 text-sm transition hover:border-fuchsia-500/30"
            >
              <span className="text-zinc-200">{target.title}</span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                {relationship.type.replace(/_/g, " ")}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
