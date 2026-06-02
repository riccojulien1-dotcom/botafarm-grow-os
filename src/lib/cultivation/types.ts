import type { CultivarBatchStatus } from "@/lib/cultivation/constants";
import type { RoomVarietyRecord } from "@/lib/varieties/types";

export type CultivarBatchRecord = {
  id: string;
  variety_id: string;
  plant_count: number;
  start_date: string | null;
  flower_start_date: string | null;
  harvest_estimate: string | null;
  status: CultivarBatchStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CultivarBatchComputed = {
  currentDay: number | null;
  currentDayLabel: string;
  harvestEstimateLabel: string;
  daysRemaining: number | null;
  daysRemainingLabel: string;
};

export type RoomCultivarView = {
  variety: RoomVarietyRecord;
  batch: CultivarBatchRecord;
  computed: CultivarBatchComputed;
  growRoomId: string;
  growRoomName: string;
};

/** Display-only aggregate — multiple variety/batch rows, one room card */
export type GroupedRoomCultivarView = {
  groupKey: string;
  displayName: string;
  lineage: string | null;
  growRoomId: string;
  growRoomName: string;
  varietyIds: string[];
  primaryVarietyId: string;
  batchCount: number;
  totalPlantCount: number;
  status: CultivarBatchStatus;
  computed: CultivarBatchComputed;
  representativeVariety: RoomVarietyRecord;
  members: RoomCultivarView[];
};

export type VarietyDetailContext = {
  variety: RoomVarietyRecord;
  batches: CultivarBatchRecord[];
  primaryBatch: CultivarBatchRecord | null;
  primaryComputed: CultivarBatchComputed | null;
  growRoom: {
    id: string;
    name: string;
    status: string;
    cycle_start_date: string | null;
    target_cycle_days: number | null;
  };
};
