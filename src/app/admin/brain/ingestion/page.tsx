import Link from "next/link";

import { KnowledgeIngestionPipelinePanel } from "@/components/knowledge-base/knowledge-ingestion-pipeline-panel";
import { KnowledgeSourceCoverageTable } from "@/components/knowledge-base/knowledge-source-coverage-table";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { KnowledgeClassificationGuide } from "@/components/knowledge-base/knowledge-classification-guide";
import { HANDBOOK_TARGET_CONCEPTS } from "@/lib/knowledge-base/domains/irrigation-manifest";
import { getPipelineReadiness } from "@/lib/knowledge-base";

export const dynamic = "force-dynamic";

export default function AdminBrainIngestionPage() {
  const pipeline = getPipelineReadiness();

  return (
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Administrator · Sprint 26"
        title="Handbook ingestion pipeline"
        subtitle="One Botafarm handbook source feeds multiple Brain domains. Each entry is classified independently — PDFs and chapters are never stored."
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/brain"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          Brain operations
        </Link>
      </div>

      <GlassPanel padding="lg" glow="cyan">
        <KnowledgeIngestionPipelinePanel
          stages={pipeline.stages}
          stagedEntryCount={pipeline.stagedEntryCount}
          readyForIrrigationBook={pipeline.readyForIrrigationBook}
        />
      </GlassPanel>

      <GlassPanel padding="lg">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Source coverage
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Handbook target: {HANDBOOK_TARGET_CONCEPTS.length} concepts across multiple Brain
          categories
        </p>
        <div className="mt-4">
          <KnowledgeSourceCoverageTable />
        </div>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          Target irrigation concepts
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {HANDBOOK_TARGET_CONCEPTS.map((concept) => (
            <li
              key={concept.slug}
              className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2 text-sm text-zinc-300"
            >
              <span className="font-medium text-zinc-100">{concept.label}</span>
              <span className="mt-0.5 block text-[11px] text-fuchsia-300/80">
                {concept.category}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] text-zinc-600">
                {concept.slug} · {concept.subcategory}
              </span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </section>
  );
}
