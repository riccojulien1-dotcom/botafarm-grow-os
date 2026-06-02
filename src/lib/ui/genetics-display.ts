import type { RoomVarietyRecord } from "@/lib/varieties/types";

export type GeneticsLine = {
  cultivarName: string;
  genetics: string | null;
};

export function varietyCrossLine(variety: RoomVarietyRecord): string | null {
  return variety.lineage ?? variety.genetics;
}

export function toGeneticsLine(variety: RoomVarietyRecord): GeneticsLine {
  return {
    cultivarName: variety.name.toUpperCase(),
    genetics: varietyCrossLine(variety),
  };
}

export function pickPrimaryVariety(
  varieties: RoomVarietyRecord[],
  preferredName?: string | null,
): RoomVarietyRecord | null {
  if (!varieties.length) {
    return null;
  }

  if (preferredName && preferredName !== "Room cycle") {
    const match = varieties.find((entry) => entry.name === preferredName);
    if (match) {
      return match;
    }
  }

  return varieties[0];
}

export function formatGeneticsCross(genetics: string | null): string | null {
  if (!genetics?.trim()) {
    return null;
  }
  return genetics.trim();
}
