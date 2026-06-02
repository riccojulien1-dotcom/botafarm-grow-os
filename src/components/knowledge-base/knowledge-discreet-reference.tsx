import type { PublicKnowledgeEntry } from "@/lib/knowledge-base/types";

type KnowledgeDiscreetReferenceProps = {
  entry: PublicKnowledgeEntry;
};

/** Traceability only — no source document exposure */
export function KnowledgeDiscreetReference({ entry }: KnowledgeDiscreetReferenceProps) {
  const ref = entry.sourceReference;

  return (
    <p className="text-center text-[11px] text-zinc-600">
      Botafarm reference · {ref.internalReferenceId}
      {ref.section ? ` · ${ref.section}` : ""}
    </p>
  );
}
