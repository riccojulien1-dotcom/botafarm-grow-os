import { CreateRoomVarietyForm } from "@/components/varieties/create-room-variety-form";
import { RoomVarietyCard } from "@/components/varieties/room-variety-card";
import type { RoomVarietyRecord, VarietyPreset } from "@/lib/varieties/types";

type RoomVarietiesSectionProps = {
  growRoomId: string;
  roomName: string;
  varieties: RoomVarietyRecord[];
  totalPlantsFromVarieties: number;
  presets: VarietyPreset[];
};

export function RoomVarietiesSection({
  growRoomId,
  roomName,
  varieties,
  totalPlantsFromVarieties,
  presets,
}: RoomVarietiesSectionProps) {
  return (
    <section className="space-y-4 rounded-xl border border-fuchsia-900/30 bg-zinc-900/50 p-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Varieties</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Track multiple genetics in {roomName}. Room plant count syncs from varieties when
          at least one variety exists ({totalPlantsFromVarieties} plants total).
        </p>
      </div>

      <CreateRoomVarietyForm growRoomId={growRoomId} presets={presets} />

      {varieties.length ? (
        <ul className="space-y-3">
          {varieties.map((variety) => (
            <RoomVarietyCard key={variety.id} variety={variety} growRoomId={growRoomId} />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
          No varieties yet. Add your first strain above.
        </p>
      )}
    </section>
  );
}
