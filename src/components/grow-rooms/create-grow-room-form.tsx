"use client";

import { useActionState } from "react";

import { createGrowRoomAction } from "@/app/dashboard/grow-rooms/actions";
import { GrowRoomFields } from "@/components/grow-rooms/grow-room-fields";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";

const initialState: { error?: string; success?: string } = {};

export function CreateGrowRoomForm() {
  const [state, formAction, pending] = useActionState(createGrowRoomAction, initialState);

  useRefreshOnActionSuccess(state?.success);

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2"
    >
      <GrowRoomFields idPrefix="create" />

      {state?.error ? <p className="md:col-span-2 text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? (
        <p className="md:col-span-2 text-sm text-green-400">{state.success}</p>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
        >
          {pending ? "Saving..." : "Create grow room"}
        </button>
      </div>
    </form>
  );
}
