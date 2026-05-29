import Link from "next/link";

type DashboardQuickActionsProps = {
  latestActiveRoomId: string | null;
};

export function DashboardQuickActions({ latestActiveRoomId }: DashboardQuickActionsProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium text-white">Quick actions</h2>
      <p className="mt-1 text-sm text-zinc-400">Move fast across your grow operation.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/dashboard/grow-rooms"
          className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm text-white hover:bg-fuchsia-500"
        >
          Manage grow rooms
        </Link>
        <Link
          href="/dashboard/grow-rooms#create-room"
          className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
        >
          Create new grow room
        </Link>
        {latestActiveRoomId ? (
          <Link
            href={`/rooms/${latestActiveRoomId}`}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
          >
            Open latest active room
          </Link>
        ) : (
          <span className="rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-500">
            Open latest active room
          </span>
        )}
      </div>
    </article>
  );
}
