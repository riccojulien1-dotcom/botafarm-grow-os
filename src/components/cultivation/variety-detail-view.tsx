import Link from "next/link";

import { VarietyKnowledgeLinksPanel } from "@/components/cultivation/variety-knowledge-links-panel";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import { CULTIVAR_BATCH_STATUS_LABELS } from "@/lib/cultivation/constants";
import type { VarietyDetailContext } from "@/lib/cultivation/types";
import { getVarietyKnowledgeLinks } from "@/lib/cultivation/variety-knowledge-links";
import { varietyCrossLine } from "@/lib/ui/genetics-display";

type VarietyDetailViewProps = {
  context: VarietyDetailContext;
};

function DetailField({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="bf-inset-panel p-3">
      <p className="bf-section-eyebrow text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-zinc-100">{value ?? "Not set"}</p>
    </div>
  );
}

export function VarietyDetailView({ context }: VarietyDetailViewProps) {
  const { variety, primaryBatch, primaryComputed, growRoom } = context;
  const cross = varietyCrossLine(variety);
  const knowledgeLinks = getVarietyKnowledgeLinks(variety);
  const phaseLabel = primaryBatch
    ? CULTIVAR_BATCH_STATUS_LABELS[primaryBatch.status]
    : "Not set";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-200"
        >
          Mission Control
        </Link>
        <Link
          href={`/rooms/${growRoom.id}`}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-fuchsia-500/30 hover:text-fuchsia-200"
        >
          {growRoom.name}
        </Link>
      </div>

      <GlassPanel glow="magenta" padding="lg">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            {variety.name}
          </h1>
          <GrowRoomStatusBadge status={growRoom.status} />
        </div>
        {cross ? (
          <p className="mt-3 text-lg font-medium text-fuchsia-300/90">{cross}</p>
        ) : null}
        {variety.breeder ? (
          <p className="mt-1 text-sm text-zinc-400">Breeder: {variety.breeder}</p>
        ) : null}
        <p className="mt-2 text-sm text-zinc-500">
          Room:{" "}
          <Link href={`/rooms/${growRoom.id}`} className="text-cyan-300/90 hover:text-cyan-200">
            {growRoom.name}
          </Link>
        </p>
      </GlassPanel>

      <GlassPanel padding="lg">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">Batch profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField
            label="Plants"
            value={primaryBatch?.plant_count ?? variety.plant_count ?? 0}
          />
          <DetailField label="Phase" value={phaseLabel} />
          <DetailField
            label="Current day"
            value={primaryComputed?.currentDayLabel ?? "Day —"}
          />
          <DetailField
            label="Harvest estimate"
            value={primaryComputed?.harvestEstimateLabel ?? "Not set"}
          />
          <DetailField
            label="Countdown"
            value={primaryComputed?.daysRemainingLabel ?? "Harvest not set"}
          />
          <DetailField label="Variety type" value={variety.variety_type} />
        </div>
      </GlassPanel>

      {(variety.notes || variety.phenotype_notes) && (
        <GlassPanel padding="lg" className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white">Notes</h2>
          {variety.phenotype_notes ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Phenotype</p>
              <p className="mt-2 text-sm text-zinc-300">{variety.phenotype_notes}</p>
            </div>
          ) : null}
          {variety.notes ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">Grow notes</p>
              <p className="mt-2 text-sm text-zinc-300">{variety.notes}</p>
            </div>
          ) : null}
        </GlassPanel>
      )}

      <VarietyKnowledgeLinksPanel varietyName={variety.name} links={knowledgeLinks} />
    </div>
  );
}
