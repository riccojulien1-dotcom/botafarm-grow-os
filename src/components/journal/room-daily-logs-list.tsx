import { RoomDailyLogCard, type RoomDailyLog } from "@/components/journal/room-daily-log-card";

type RoomDailyLogsListProps = {
  logs: RoomDailyLog[];
  growRoomId: string;
};

export function RoomDailyLogsList({ logs, growRoomId }: RoomDailyLogsListProps) {
  if (!logs.length) {
    return (
      <p className="rounded-xl bf-inset-panel px-4 py-5 text-sm text-zinc-400">
        No journal logs yet for this room.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <RoomDailyLogCard key={log.id} log={log} growRoomId={growRoomId} />
      ))}
    </ul>
  );
}
