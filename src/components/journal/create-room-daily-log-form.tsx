"use client";

import { useActionState } from "react";

import { createRoomDailyLogAction } from "@/app/rooms/[id]/actions";

type CreateRoomDailyLogFormProps = {
  growRoomId: string;
};

const initialState: { error?: string; success?: string } = {};

function todayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateRoomDailyLogForm({ growRoomId }: CreateRoomDailyLogFormProps) {
  const [state, formAction, pending] = useActionState(createRoomDailyLogAction, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2"
    >
      <input type="hidden" name="grow_room_id" value={growRoomId} />

      <div className="md:col-span-2">
        <label htmlFor="log_date" className="text-sm text-zinc-200">
          Log date
        </label>
        <input
          id="log_date"
          name="log_date"
          type="date"
          required
          defaultValue={todayDateInputValue()}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="temperature" className="text-sm text-zinc-200">
          Temperature (°C)
        </label>
        <input
          id="temperature"
          name="temperature"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="humidity" className="text-sm text-zinc-200">
          Humidity (%)
        </label>
        <input
          id="humidity"
          name="humidity"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="vpd" className="text-sm text-zinc-200">
          VPD
        </label>
        <input
          id="vpd"
          name="vpd"
          type="number"
          step="0.01"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="ec" className="text-sm text-zinc-200">
          EC
        </label>
        <input
          id="ec"
          name="ec"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="ph" className="text-sm text-zinc-200">
          pH
        </label>
        <input
          id="ph"
          name="ph"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="irrigation_volume" className="text-sm text-zinc-200">
          Irrigation volume
        </label>
        <input
          id="irrigation_volume"
          name="irrigation_volume"
          type="number"
          step="0.1"
          min={0}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="dryback_percent" className="text-sm text-zinc-200">
          Dryback (%)
        </label>
        <input
          id="dryback_percent"
          name="dryback_percent"
          type="number"
          step="0.1"
          min={0}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="notes" className="text-sm text-zinc-200">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
          placeholder="Observations, plant status, tasks done..."
        />
      </div>

      {state?.error ? <p className="md:col-span-2 text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="md:col-span-2 text-sm text-green-400">{state.success}</p> : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
        >
          {pending ? "Saving..." : "Save journal log"}
        </button>
      </div>
    </form>
  );
}
