import { CreateGrowRoomForm } from "@/components/grow-rooms/create-grow-room-form";
import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function GrowRoomsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from("grow_rooms")
    .select("id,name,room_type,plant_count,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Grow rooms</h1>
        <p className="text-sm text-zinc-400">Create and manage your rooms and tents.</p>
      </div>

      <CreateGrowRoomForm />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-400">Existing rooms</div>
        <ul className="divide-y divide-zinc-800">
          {rooms?.length ? (
            rooms.map((room) => (
              <li key={room.id} className="px-4 py-3 text-sm">
                <p className="font-medium">{room.name}</p>
                <p className="text-zinc-400">
                  {room.room_type ?? "No type"} · {room.plant_count ?? 0} plants
                </p>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-sm text-zinc-400">No grow room yet. Create your first one above.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
