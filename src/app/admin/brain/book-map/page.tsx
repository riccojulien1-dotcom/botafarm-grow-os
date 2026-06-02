import Link from "next/link";

import { KnowledgeBookMapTree } from "@/components/knowledge-base/knowledge-book-map-tree";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import {
  getIrrigationHandbookBookMap,
  getIrrigationHandbookBookMapStats,
  resolveLearningPath,
  resolveAllMetricContexts,
} from "@/lib/knowledge-base/book-map";
import { HANDBOOK_TARGET_ENTRY_COUNT } from "@/lib/knowledge-base/domains/irrigation-manifest";

export const dynamic = "force-dynamic";

export default function AdminBrainBookMapPage() {
  const bookMap = getIrrigationHandbookBookMap();
  const stats = getIrrigationHandbookBookMapStats();
  const learningPath = resolveLearningPath(bookMap);
  const metricContexts = resolveAllMetricContexts(bookMap);

  return (
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Administrator · Sprint 27"
        title="Irrigation handbook book map"
        subtitle="Pedagogical structure from the real handbook — summaries and IRR ids only. No document stored, no ingestion, no staging."
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/brain"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          Brain operations
        </Link>
        <Link
          href="/admin/brain/ingestion"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-fuchsia-500/30 hover:text-fuchsia-200"
        >
          Ingestion pipeline
        </Link>
      </div>

      <GlassPanel padding="lg" glow="cyan">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Map status</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Built from handbook sommaire and chapter structure (113 pages). Global{" "}
          <span className="font-mono text-fuchsia-300/90">{stats.irrIdRange.first}</span>
          {" → "}
          <span className="font-mono text-fuchsia-300/90">{stats.irrIdRange.last}</span>
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Chapters" value={String(stats.chapterCount)} />
          <Stat
            label="Learning path chapters"
            value={String(stats.learningPathChapterCount)}
          />
          <Stat label="Reference chapters" value={String(stats.referenceChapterCount)} />
          <Stat label="Sections" value={String(stats.sectionCount)} />
          <Stat label="Map nodes" value={String(stats.nodeCount)} />
          <Stat label="Concepts" value={String(stats.conceptCount)} />
          <Stat label="Rules / actions" value={`${stats.ruleCount} / ${stats.actionCount}`} />
          <Stat label="Warnings / metrics" value={`${stats.warningCount} / ${stats.metricCount}`} />
          <Stat label="Learning path steps" value={String(learningPath.length)} />
          <Stat label="Metric contexts" value={String(metricContexts.length)} />
          <Stat label="Target ingest concepts" value={String(HANDBOOK_TARGET_ENTRY_COUNT)} />
          <Stat label="Ingestion" value="Not started" />
          <Stat label="Staging" value="Empty" />
          <Stat label="Published entries" value="Seeds only" />
        </dl>
      </GlassPanel>

      <GlassPanel padding="lg" glow="magenta">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Book → Chapter → Section → Node
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {bookMap.titleEn} · {bookMap.author} · structure metadata only
        </p>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          <KnowledgeBookMapTree bookMap={bookMap} />
        </div>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          Dual retrieval readiness
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          <li>
            <span className="text-zinc-200">Metric-based:</span>{" "}
            {metricContexts.length} metrics linked to IRR nodes (e.g. dryback_percent, ec_runoff)
          </li>
          <li>
            <span className="text-zinc-200">Learning-path:</span>{" "}
            {learningPath.length} ordered steps with dependsOn edges (reference chapters excluded
            from default path)
          </li>
          <li>
            <span className="text-zinc-200">Next step:</span> extract Knowledge Entries from map
            nodes — each entry keeps its IRR citation and chapter context
          </li>
        </ul>
      </GlassPanel>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2">
      <dt className="text-xs text-zinc-600">{label}</dt>
      <dd className="mt-0.5 font-medium text-zinc-200">{value}</dd>
    </div>
  );
}
