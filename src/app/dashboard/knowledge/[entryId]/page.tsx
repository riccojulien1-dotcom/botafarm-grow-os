import { notFound } from "next/navigation";

import { KnowledgeEntryDetail } from "@/components/knowledge-base/knowledge-entry-detail";
import { getKnowledgeEntryById, toPublicKnowledgeEntry } from "@/lib/knowledge-base";

export const dynamic = "force-dynamic";

type KnowledgeEntryPageProps = {
  params: Promise<{ entryId: string }>;
};

export default async function KnowledgeEntryPage({ params }: KnowledgeEntryPageProps) {
  const { entryId } = await params;
  const entry = getKnowledgeEntryById(entryId);

  if (!entry) {
    notFound();
  }

  return <KnowledgeEntryDetail entry={toPublicKnowledgeEntry(entry)} />;
}
