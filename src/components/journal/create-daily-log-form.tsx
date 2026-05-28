"use client";

import { useActionState } from "react";

import { createDailyLogAction } from "@/app/dashboard/journal/actions";

type GrowRoomOption = {
  id: string;
  name: string;
};

const initialState: { error?: string; success?: string } = {};

export function CreateDailyLogForm({ growRooms }: { growRooms: GrowRoomOption[] }) {
  const [state, formAction, pending] = useActionState(createDailyLogAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="grow_room_id" className="text-sm text-zinc-200">
          Grow room
        </label>
        <select id="grow_room_id" name="grow_room_id" required className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2">
          <option value="">Select a grow room</option>
          {growRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="temperature" className="text-sm text-zinc-200">Temperature (°C)</label>
        <input id="temperature" name="temperature" type="number" step="0.1" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="humidity" className="text-sm text-zinc-200">Humidity (%)</label>
        <input id="humidity" name="humidity" type="number" step="0.1" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="ec" className="text-sm text-zinc-200">EC</label>
        <input id="ec" name="ec" type="number" step="0.1" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="ph" className="text-sm text-zinc-200">pH</label>
        <input id="ph" name="ph" type="number" step="0.1" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="irrigation_ml" className="text-sm text-zinc-200">Irrigation (ml)</label>
        <input id="irrigation_ml" name="irrigation_ml" type="number" step="1" min={0} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="notes" className="text-sm text-zinc-200">Notes</label>
        <textarea id="notes" name="notes" rows={3} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Plant status, tasks done, observations..." />
      </div>

      {state?.error ? <p className="md:col-span-2 text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="md:col-span-2 text-sm text-green-400">{state.success}</p> : null}

      <div className="md:col-span-2">
        <button type="submit" disabled={pending} className="rounded-md bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900">
          {pending ? "Saving..." : "Save daily log"}
        </button>
      </div>
    </form>
  );
}
