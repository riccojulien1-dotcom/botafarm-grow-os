import { getTranslations } from "next-intl/server";

import { RoomDailyLogCard, type RoomDailyLog } from "@/components/journal/room-daily-log-card";
import type { JournalLogPhoto } from "@/lib/journal/journal-types";

type RoomDailyLogsListProps = {
  logs: RoomDailyLog[];
  growRoomId: string;
  photosByLogId?: Map<string, JournalLogPhoto[]>;
};

export async function RoomDailyLogsList({
  logs,
  growRoomId,
  photosByLogId,
}: RoomDailyLogsListProps) {
  const t = await getTranslations("journal.roomSection");

  if (!logs.length) {
    return (
      <p className="rounded-xl bf-inset-panel px-4 py-5 text-sm text-zinc-400">
        {t("emptyLogs")}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <RoomDailyLogCard
          key={log.id}
          log={log}
          growRoomId={growRoomId}
          photos={photosByLogId?.get(log.id) ?? []}
        />
      ))}
    </ul>
  );
}
