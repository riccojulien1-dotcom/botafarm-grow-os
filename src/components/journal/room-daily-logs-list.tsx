type RoomDailyLog = {
  id: string;
  log_date: string | null;
  logged_at: string;
  temperature: number | null;
  humidity: number | null;
  vpd: number | null;
  ec: number | null;
  ph: number | null;
  irrigation_volume: number | null;
  dryback_percent: number | null;
  notes: string | null;
};

type RoomDailyLogsListProps = {
  logs: RoomDailyLog[];
};

function formatDate(log: RoomDailyLog) {
  if (log.log_date) {
    return log.log_date;
  }
  return new Date(log.logged_at).toISOString().slice(0, 10);
}

function formatValue(value: string | number | null) {
  return value ?? "—";
}

export function RoomDailyLogsList({ logs }: RoomDailyLogsListProps) {
  if (!logs.length) {
    return (
      <p className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-sm text-zinc-400">
        No journal logs yet for this room.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <li key={log.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm font-medium text-fuchsia-300">{formatDate(log)}</p>
          <div className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2 lg:grid-cols-4">
            <p>Temp: {formatValue(log.temperature)} °C</p>
            <p>Humidity: {formatValue(log.humidity)} %</p>
            <p>VPD: {formatValue(log.vpd)}</p>
            <p>EC: {formatValue(log.ec)}</p>
            <p>pH: {formatValue(log.ph)}</p>
            <p>Irrigation vol.: {formatValue(log.irrigation_volume)}</p>
            <p>Dryback: {formatValue(log.dryback_percent)} %</p>
          </div>
          {log.notes ? <p className="mt-3 text-sm text-zinc-400">{log.notes}</p> : null}
        </li>
      ))}
    </ul>
  );
}
