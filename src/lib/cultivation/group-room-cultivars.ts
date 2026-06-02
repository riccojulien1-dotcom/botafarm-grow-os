import { computeBatchMetrics } from "@/lib/cultivation/compute-batch";
import type { CultivarBatchStatus } from "@/lib/cultivation/constants";
import type {
  CultivarBatchComputed,
  CultivarBatchRecord,
  GroupedRoomCultivarView,
  RoomCultivarView,
} from "@/lib/cultivation/types";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

const STATUS_RANK: Record<CultivarBatchStatus, number> = {
  clone: 0,
  vegetative: 1,
  preflower: 2,
  flower: 3,
  harvest: 4,
  completed: 5,
};

type RoomContext = {
  id: string;
  name: string;
  status: string;
  cycle_start_date: string | null;
  target_cycle_days: number | null;
};

type BatchWithContext = {
  batch: CultivarBatchRecord;
  variety: RoomVarietyRecord;
  computed: CultivarBatchComputed;
};

function normalizeLineage(variety: RoomVarietyRecord): string {
  const raw = variety.lineage ?? variety.genetics ?? "";
  return raw.trim().toLowerCase();
}

export function cultivarGroupKey(growRoomId: string, variety: RoomVarietyRecord): string {
  const name = variety.name.trim().toLowerCase();
  const lineage = normalizeLineage(variety);
  return `${growRoomId}::${name}::${lineage}`;
}

function isActiveStatus(status: CultivarBatchStatus): boolean {
  return status !== "completed";
}

function pickMostAdvancedBatch(entries: BatchWithContext[]): BatchWithContext {
  const pool = entries.filter((entry) => isActiveStatus(entry.batch.status));
  const candidates = pool.length ? pool : entries;

  return candidates.reduce((best, current) => {
    const bestRank = STATUS_RANK[best.batch.status];
    const currentRank = STATUS_RANK[current.batch.status];
    if (currentRank !== bestRank) {
      return currentRank > bestRank ? current : best;
    }

    const bestDay = best.computed.currentDay ?? -1;
    const currentDay = current.computed.currentDay ?? -1;
    if (currentDay !== bestDay) {
      return currentDay > bestDay ? current : best;
    }

    return best;
  });
}

function pickNearestHarvest(entries: BatchWithContext[]): BatchWithContext | null {
  const withCountdown = entries.filter((entry) => entry.computed.daysRemaining != null);
  if (!withCountdown.length) {
    return null;
  }

  return withCountdown.reduce((nearest, current) => {
    const nearestDays = nearest.computed.daysRemaining!;
    const currentDays = current.computed.daysRemaining!;
    if (currentDays !== nearestDays) {
      return currentDays < nearestDays ? current : nearest;
    }
    return nearest;
  });
}

function buildDisplayComputed(
  lead: BatchWithContext,
  harvest: BatchWithContext | null,
): CultivarBatchComputed {
  if (!harvest || harvest === lead) {
    return lead.computed;
  }

  return {
    currentDay: lead.computed.currentDay,
    currentDayLabel: lead.computed.currentDayLabel,
    harvestEstimateLabel: harvest.computed.harvestEstimateLabel,
    daysRemaining: harvest.computed.daysRemaining,
    daysRemainingLabel: harvest.computed.daysRemainingLabel,
  };
}

/**
 * Display-only grouping: same room + variety name + lineage → one card.
 * Underlying variety rows and batches are unchanged.
 */
export function groupRoomCultivarsForDisplay(
  views: RoomCultivarView[],
  batchMap: Map<string, CultivarBatchRecord[]>,
  room: RoomContext,
): GroupedRoomCultivarView[] {
  const groups = new Map<string, RoomCultivarView[]>();

  for (const view of views) {
    const key = cultivarGroupKey(view.growRoomId, view.variety);
    const list = groups.get(key) ?? [];
    list.push(view);
    groups.set(key, list);
  }

  const grouped: GroupedRoomCultivarView[] = [];

  for (const [groupKey, members] of groups) {
    const batchEntries: BatchWithContext[] = [];

    for (const member of members) {
      const batches = batchMap.get(member.variety.id) ?? [member.batch];
      for (const batch of batches) {
        batchEntries.push({
          batch,
          variety: member.variety,
          computed: computeBatchMetrics(batch, member.variety, room),
        });
      }
    }

    const lead = pickMostAdvancedBatch(batchEntries);
    const nearestHarvest = pickNearestHarvest(batchEntries);
    const totalPlantCount = batchEntries.reduce(
      (sum, entry) => sum + entry.batch.plant_count,
      0,
    );

    grouped.push({
      groupKey,
      displayName: members[0].variety.name,
      lineage: members[0].variety.lineage ?? members[0].variety.genetics,
      growRoomId: room.id,
      growRoomName: room.name,
      varietyIds: members.map((member) => member.variety.id),
      primaryVarietyId: lead.variety.id,
      batchCount: batchEntries.length,
      totalPlantCount,
      status: lead.batch.status,
      computed: buildDisplayComputed(lead, nearestHarvest),
      representativeVariety: lead.variety,
      members,
    });
  }

  return grouped.sort((left, right) =>
    left.displayName.localeCompare(right.displayName),
  );
}
