import { CreateDailyLogForm } from "@/components/journal/create-daily-log-form";
import { requireUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function JournalPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from("grow_rooms")
    .select("id,name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Daily journal</h1>
        <p className="text-sm text-zinc-400">Log climate and irrigation values for each room.</p>
      </div>

      {rooms?.length ? (
        <CreateDailyLogForm growRooms={rooms} />
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
          You need at least one grow room before creating a journal log.
        </div>
      )}
    </section>
  );
}
