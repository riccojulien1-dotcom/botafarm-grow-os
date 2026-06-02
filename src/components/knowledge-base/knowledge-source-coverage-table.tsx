import {
  getAllSourceCoverageReports,
  getKnowledgeSourceRegistry,
} from "@/lib/knowledge-base/sources/registry";
import { KNOWLEDGE_SOURCE_TYPE_LABELS } from "@/lib/knowledge-base/constants";

export function KnowledgeSourceCoverageTable() {
  const sources = getKnowledgeSourceRegistry();
  const reports = getAllSourceCoverageReports(sources);

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-zinc-500">
            <th className="px-3 py-2 font-medium">Knowledge source</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Entries</th>
            <th className="px-3 py-2 font-medium">Brain categories</th>
            <th className="px-3 py-2 font-medium">Domain coverage</th>
            <th className="px-3 py-2 font-medium">Concept coverage</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const source = sources.find((item) => item.id === report.sourceId);
            return (
              <tr
                key={report.sourceId}
                className="border-b border-white/[0.04] text-zinc-300 last:border-0"
              >
                <td className="px-3 py-2.5">
                  <p className="font-medium text-zinc-100">{report.sourceTitle}</p>
                  {source?.internalReferencePrefix ? (
                    <p className="font-mono text-[10px] text-zinc-600">
                      {source.internalReferencePrefix}-*
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2.5 text-xs">
                  {source ? KNOWLEDGE_SOURCE_TYPE_LABELS[source.sourceType] : "—"}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={report.ingestionStatus} />
                </td>
                <td className="px-3 py-2.5 tabular-nums">
                  {report.entriesCreated}
                  {report.targetConceptCount > 0 ? (
                    <span className="text-zinc-600"> / {report.targetConceptCount}</span>
                  ) : null}
                </td>
                <td className="px-3 py-2.5 text-xs text-zinc-400">
                  {report.categoriesCovered.length ? (
                    <>
                      {report.categoriesCovered.join(", ")}
                      {report.feedsMultipleBrainDomains ? (
                        <span className="mt-0.5 block text-emerald-500/80">multi-domain</span>
                      ) : null}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <CoverageBar percent={report.categoryCoveragePercent} label="cat" />
                </td>
                <td className="px-3 py-2.5">
                  <CoverageBar percent={report.coveragePercent} label="concept" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "indexed"
      ? "border-emerald-500/35 text-emerald-200"
      : status === "ingesting"
        ? "border-cyan-500/35 text-cyan-200"
        : status === "not_ingested"
          ? "border-zinc-700 text-zinc-500"
          : "border-amber-500/35 text-amber-200";

  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${styles}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function CoverageBar({ percent, label }: { percent: number; label?: string }) {
  return (
    <div className="flex min-w-[96px] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-fuchsia-500/80"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-zinc-400">
        {label ? `${label} ` : ""}
        {percent}%
      </span>
    </div>
  );
}
