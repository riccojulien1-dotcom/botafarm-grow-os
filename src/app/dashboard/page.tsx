import Link from "next/link";

import { StatCard } from "@/components/dashboard/stat-card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [roomsResult, remindersResult] = await Promise.all([
    supabase.from("grow_rooms").select("id", { count: "exact", head: true }),
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("is_completed", false),
  ]);

  const roomsCount = roomsResult.count ?? 0;
  const pendingReminders = remindersResult.count ?? 0;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Today dashboard</h1>
        <p className="text-sm text-zinc-400">
          Core MVP dashboard with room overview, reminders, and quick links.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Grow rooms" value={String(roomsCount)} helpText="Active setups" />
        <StatCard label="Pending tasks" value={String(pendingReminders)} helpText="Open reminders" />
        <StatCard label="Next watering" value="Manual" helpText="Will be automated in phase 2" />
        <StatCard label="AI tips" value="Basic" helpText="Rule-based recommendations" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="font-medium">Quick actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/dashboard/grow-rooms" className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm text-white hover:bg-fuchsia-500">
              Manage grow rooms
            </Link>
            <Link href="/dashboard/journal" className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:border-zinc-500">
              Add journal log
            </Link>
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="font-medium">Initial roadmap status</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>Auth: implemented</li>
            <li>Database schema: prepared</li>
            <li>Grow rooms: basic CRUD (create/list) ready</li>
            <li>Journal logs: first-entry form ready</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
