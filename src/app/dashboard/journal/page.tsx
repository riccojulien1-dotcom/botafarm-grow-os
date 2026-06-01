import { CreateDailyLogForm } from "@/components/journal/create-daily-log-form";
import { BfPageHeader } from "@/components/botafarm/bf-page-header";
import { GlassPanel } from "@/components/botafarm/glass-panel";
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
    <section className="space-y-8">
      <BfPageHeader
        eyebrow="Mission Control"
        title="Daily Journal"
        subtitle="Log climate and irrigation values for each room."
      />

      {rooms?.length ? (
        <GlassPanel glow="cyan" padding="lg" interactive>
          <CreateDailyLogForm growRooms={rooms} />
        </GlassPanel>
      ) : (
        <GlassPanel padding="lg">
          <p className="text-sm text-zinc-400">
            You need at least one grow room before creating a journal log.
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
