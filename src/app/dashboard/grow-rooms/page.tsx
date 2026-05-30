import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { GrowRoomCard } from "@/components/grow-rooms/grow-room-card";
import { requireUser } from "@/lib/auth/get-user";
import type { VarietyForHarvest } from "@/lib/grow-rooms/crop-cycle";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function groupVarietiesByRoom(
  varieties: Array<VarietyForHarvest & { grow_room_id: string }>,
) {
  const map = new Map<string, VarietyForHarvest[]>();

  for (const variety of varieties) {
    const { grow_room_id: growRoomId, ...entry } = variety;
    const existing = map.get(growRoomId) ?? [];
    existing.push(entry);
    map.set(growRoomId, existing);
  }

  return map;
}

export default async function GrowRoomsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: rooms }, { data: varieties }] = await Promise.all([
    supabase
      .from("grow_rooms")
      .select(
        "id,name,status,room_type,plant_count,dimensions,lighting,substrate,genetics,irrigation,notes,cycle_start_date,target_cycle_days,created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("room_varieties")
      .select("id,grow_room_id,name,genetics,plant_count,flowering_duration_days")
      .eq("user_id", user.id),
  ]);

  const varietiesByRoom = groupVarietiesByRoom(varieties ?? []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Grow rooms</h1>
        <p className="text-sm text-zinc-400">Create and manage your rooms and tents.</p>
      </div>

      <div id="create-room">
        <CreateGrowRoomForm />
      </div>

      <div className="space-y-3">
        <p className="text-sm text-zinc-400">Existing rooms</p>
        {rooms?.length ? (
          <ul className="space-y-3">
            {rooms.map((room) => (
              <GrowRoomCard
                key={room.id}
                room={room}
                varieties={varietiesByRoom.get(room.id) ?? []}
              />
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
            No grow room yet. Create your first one above.
          </p>
        )}
      </div>
    </section>
  );
}
