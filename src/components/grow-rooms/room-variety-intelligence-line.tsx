import type { RoomVarietyIntelligenceSummary } from "@/lib/varieties/types";

type RoomVarietyIntelligenceLineProps = {
  summary: RoomVarietyIntelligenceSummary;
};

export function RoomVarietyIntelligenceLine({ summary }: RoomVarietyIntelligenceLineProps) {
  if (summary.varietyCount === 0) {
    return <p className="text-xs text-zinc-500">Varieties: none added</p>;
  }

  return (
    <div className="space-y-1 text-xs text-zinc-400">
      <p>
        {summary.totalPlantCount} plants · {summary.varietyCount} variet
        {summary.varietyCount === 1 ? "y" : "ies"}
      </p>
      {summary.nearestHarvestLabel ? (
        <p>
          <span className="text-zinc-500">Nearest harvest: </span>
          {summary.nearestHarvestLabel}
        </p>
      ) : null}
      {summary.furthestHarvestLabel &&
      summary.furthestHarvestLabel !== summary.nearestHarvestLabel ? (
        <p>
          <span className="text-zinc-500">Furthest harvest: </span>
          {summary.furthestHarvestLabel}
        </p>
      ) : null}
      {!summary.nearestHarvestLabel && summary.harvestWindowSummaryLabel ? (
        <p className="text-zinc-500">{summary.harvestWindowSummaryLabel}</p>
      ) : null}
    </div>
  );
}
