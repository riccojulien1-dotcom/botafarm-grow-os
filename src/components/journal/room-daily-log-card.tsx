"use client";

import { useActionState, useState } from "react";

import {
  deleteRoomDailyLogAction,
  updateRoomDailyLogAction,
} from "@/app/rooms/[id]/actions";

export type RoomDailyLog = {
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

type RoomDailyLogCardProps = {
  log: RoomDailyLog;
  growRoomId: string;
};

const initialState: { error?: string; success?: string } = {};

function formatDate(log: RoomDailyLog) {
  if (log.log_date) {
    return log.log_date;
  }
  return new Date(log.logged_at).toISOString().slice(0, 10);
}

function inputValue(value: number | null) {
  return value === null ? "" : String(value);
}

function formatDisplay(value: string | number | null) {
  return value ?? "—";
}

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

export function RoomDailyLogCard({ log, growRoomId }: RoomDailyLogCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateRoomDailyLogAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteRoomDailyLogAction,
    initialState,
  );

  const logDate = formatDate(log);

  if (isEditing && !updateState?.success) {
    return (
      <li className="rounded-xl border border-fuchsia-900/50 bg-zinc-900 p-4">
        <form action={updateAction} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="log_id" value={log.id} />
          <input type="hidden" name="grow_room_id" value={growRoomId} />

          <div className="md:col-span-2">
            <label htmlFor={`log_date-${log.id}`} className="text-sm text-zinc-200">
              Log date
            </label>
            <input
              id={`log_date-${log.id}`}
              name="log_date"
              type="date"
              required
              defaultValue={logDate}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`temperature-${log.id}`} className="text-sm text-zinc-200">
              Temperature (°C)
            </label>
            <input
              id={`temperature-${log.id}`}
              name="temperature"
              type="number"
              step="0.1"
              defaultValue={inputValue(log.temperature)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`humidity-${log.id}`} className="text-sm text-zinc-200">
              Humidity (%)
            </label>
            <input
              id={`humidity-${log.id}`}
              name="humidity"
              type="number"
              step="0.1"
              defaultValue={inputValue(log.humidity)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`vpd-${log.id}`} className="text-sm text-zinc-200">
              VPD
            </label>
            <input
              id={`vpd-${log.id}`}
              name="vpd"
              type="number"
              step="0.01"
              defaultValue={inputValue(log.vpd)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`ec-${log.id}`} className="text-sm text-zinc-200">
              EC
            </label>
            <input
              id={`ec-${log.id}`}
              name="ec"
              type="number"
              step="0.1"
              defaultValue={inputValue(log.ec)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`ph-${log.id}`} className="text-sm text-zinc-200">
              pH
            </label>
            <input
              id={`ph-${log.id}`}
              name="ph"
              type="number"
              step="0.1"
              defaultValue={inputValue(log.ph)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`irrigation_volume-${log.id}`} className="text-sm text-zinc-200">
              Irrigation volume
            </label>
            <input
              id={`irrigation_volume-${log.id}`}
              name="irrigation_volume"
              type="number"
              step="0.1"
              min={0}
              defaultValue={inputValue(log.irrigation_volume)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor={`dryback_percent-${log.id}`} className="text-sm text-zinc-200">
              Dryback (%)
            </label>
            <input
              id={`dryback_percent-${log.id}`}
              name="dryback_percent"
              type="number"
              step="0.1"
              min={0}
              defaultValue={inputValue(log.dryback_percent)}
              className={inputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor={`notes-${log.id}`} className="text-sm text-zinc-200">
              Notes
            </label>
            <textarea
              id={`notes-${log.id}`}
              name="notes"
              rows={3}
              defaultValue={log.notes ?? ""}
              className={inputClassName}
            />
          </div>

          {updateState?.error ? (
            <p className="md:col-span-2 text-sm text-red-400">{updateState.error}</p>
          ) : null}
          {updateState?.success ? (
            <p className="md:col-span-2 text-sm text-green-400">{updateState.success}</p>
          ) : null}

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={updatePending}
              className="rounded-md bg-fuchsia-600 px-3 py-1.5 text-sm text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
            >
              {updatePending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-medium text-fuchsia-300">{logDate}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
          >
            Edit
          </button>
          <form
            action={deleteAction}
            onSubmit={(event) => {
              const confirmed = window.confirm(
                "Delete this journal log? This action cannot be undone.",
              );
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="log_id" value={log.id} />
            <input type="hidden" name="grow_room_id" value={growRoomId} />
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-md border border-red-900/60 px-3 py-1.5 text-sm text-red-300 hover:border-red-500 disabled:opacity-60"
            >
              {deletePending ? "Deleting..." : "Delete"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2 lg:grid-cols-4">
        <p>Temp: {formatDisplay(log.temperature)} °C</p>
        <p>Humidity: {formatDisplay(log.humidity)} %</p>
        <p>VPD: {formatDisplay(log.vpd)}</p>
        <p>EC: {formatDisplay(log.ec)}</p>
        <p>pH: {formatDisplay(log.ph)}</p>
        <p>Irrigation vol.: {formatDisplay(log.irrigation_volume)}</p>
        <p>Dryback: {formatDisplay(log.dryback_percent)} %</p>
      </div>

      {log.notes ? <p className="mt-3 text-sm text-zinc-400">{log.notes}</p> : null}

      {updateState?.success ? (
        <p className="mt-3 text-sm text-green-400">{updateState.success}</p>
      ) : null}
      {deleteState?.error ? <p className="mt-3 text-sm text-red-400">{deleteState.error}</p> : null}
      {deleteState?.success ? (
        <p className="mt-3 text-sm text-green-400">{deleteState.success}</p>
      ) : null}
    </li>
  );
}
