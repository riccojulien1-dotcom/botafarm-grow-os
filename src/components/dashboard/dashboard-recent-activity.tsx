import Link from "next/link";

import { GrowRoomStatusBadge } from "@/components/grow-rooms/grow-room-status-badge";
import type { DashboardRecentLog } from "@/lib/dashboard/get-dashboard-data";

type DashboardRecentActivityProps = {
  latestRoom: { id: string; name: string; status: string; created_at: string } | null;
  recentLogs: DashboardRecentLog[];
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

function formatLogDate(log: DashboardRecentLog) {
  return log.log_date ?? new Date(log.logged_at).toISOString().slice(0, 10);
}

export function DashboardRecentActivity({
  latestRoom,
  recentLogs,
}: DashboardRecentActivityProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium text-white">Recent activity</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Latest room and journal events across your operation.
      </p>

      <div className="mt-4 space-y-4">
        <section>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Latest room created</p>
          {latestRoom ? (
            <Link
              href={`/rooms/${latestRoom.id}`}
              className="mt-2 block rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 transition hover:border-fuchsia-800"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-zinc-100">{latestRoom.name}</p>
                <GrowRoomStatusBadge status={latestRoom.status} />
              </div>
              <p className="text-xs text-zinc-400">
                Created {formatTimestamp(latestRoom.created_at)}
              </p>
            </Link>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No grow room created yet.</p>
          )}
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Latest journal logs</p>
          {recentLogs.length ? (
            <ul className="mt-2 space-y-2">
              {recentLogs.map((log) => (
                <li key={log.id}>
                  <Link
                    href={`/rooms/${log.grow_room_id}`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 transition hover:border-fuchsia-800"
                  >
                    <p className="text-sm font-medium text-zinc-100">
                      {log.room_name} · {formatLogDate(log)}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {log.temperature !== null ? `${log.temperature} °C` : "No temperature"}
                      {log.notes ? ` · ${log.notes}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No journal logs yet.</p>
          )}
        </section>

        <p className="text-xs text-zinc-500">
          Edited-log history is not shown yet because `daily_logs` has no `updated_at` column.
        </p>
      </div>
    </article>
  );
}
