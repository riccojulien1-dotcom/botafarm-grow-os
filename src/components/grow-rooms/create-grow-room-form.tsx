"use client";

import { useActionState } from "react";

import { createGrowRoomAction } from "@/app/dashboard/grow-rooms/actions";

const initialState: { error?: string; success?: string } = {};

export function CreateGrowRoomForm() {
  const [state, formAction, pending] = useActionState(createGrowRoomAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="name" className="text-sm text-zinc-200">
          Room name
        </label>
        <input id="name" name="name" required className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Flower Room" />
      </div>

      <div>
        <label htmlFor="room_type" className="text-sm text-zinc-200">
          Type
        </label>
        <input id="room_type" name="room_type" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Tent / Room / Greenhouse" />
      </div>

      <div>
        <label htmlFor="plant_count" className="text-sm text-zinc-200">
          Plant count
        </label>
        <input id="plant_count" name="plant_count" type="number" min={0} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="dimensions" className="text-sm text-zinc-200">
          Dimensions
        </label>
        <input id="dimensions" name="dimensions" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="120x120x200" />
      </div>

      <div>
        <label htmlFor="lighting" className="text-sm text-zinc-200">
          Lighting
        </label>
        <input id="lighting" name="lighting" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="LED 480W" />
      </div>

      <div>
        <label htmlFor="substrate" className="text-sm text-zinc-200">
          Substrate
        </label>
        <input id="substrate" name="substrate" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Coco" />
      </div>

      <div>
        <label htmlFor="genetics" className="text-sm text-zinc-200">
          Genetics
        </label>
        <input id="genetics" name="genetics" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Botafarm Cut A" />
      </div>

      <div>
        <label htmlFor="irrigation" className="text-sm text-zinc-200">
          Irrigation
        </label>
        <input id="irrigation" name="irrigation" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Drip" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="notes" className="text-sm text-zinc-200">
          Notes
        </label>
        <textarea id="notes" name="notes" rows={3} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Any context for this setup" />
      </div>

      {state?.error ? <p className="md:col-span-2 text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="md:col-span-2 text-sm text-green-400">{state.success}</p> : null}

      <div className="md:col-span-2">
        <button type="submit" disabled={pending} className="rounded-md bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900">
          {pending ? "Saving..." : "Create grow room"}
        </button>
      </div>
    </form>
  );
}
