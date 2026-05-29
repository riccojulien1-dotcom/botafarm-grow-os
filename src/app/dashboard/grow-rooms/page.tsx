import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { GrowRoomCard } from "@/components/grow-rooms/grow-room-card";
import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GrowRoomsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from("grow_rooms")
    .select(
      "id,name,status,room_type,plant_count,dimensions,lighting,substrate,genetics,irrigation,notes,created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
              <GrowRoomCard key={room.id} room={room} />
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
