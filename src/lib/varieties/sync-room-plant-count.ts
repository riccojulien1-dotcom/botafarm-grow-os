import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function syncRoomPlantCountFromVarieties(
  supabase: SupabaseServerClient,
  userId: string,
  growRoomId: string,
) {
  const { data: varieties, error: varietiesError } = await supabase
    .from("room_varieties")
    .select("plant_count")
    .eq("grow_room_id", growRoomId)
    .eq("user_id", userId);

  if (varietiesError || !varieties?.length) {
    return;
  }

  const total = varieties.reduce((sum, variety) => sum + (variety.plant_count ?? 0), 0);

  await supabase
    .from("grow_rooms")
    .update({ plant_count: total })
    .eq("id", growRoomId)
    .eq("user_id", userId);
}
