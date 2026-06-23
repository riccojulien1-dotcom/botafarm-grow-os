"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { createGrowRoomAction } from "@/app/dashboard/grow-rooms/actions";
import { GrowRoomFields } from "@/components/grow-rooms/grow-room-fields";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";

const initialState: { error?: string; success?: string } = {};

export function CreateGrowRoomForm() {
  const t = useTranslations("growRooms.form");
  const [state, formAction, pending] = useActionState(createGrowRoomAction, initialState);

  useRefreshOnActionSuccess(state);

  return (
    <form
      action={formAction}
      onKeyDown={preventImplicitFormSubmitOnEnter}
      className="grid gap-4 md:grid-cols-2"
    >
      <GrowRoomFields idPrefix="create" />

      {state?.error ? (
        <p className="md:col-span-2 text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="md:col-span-2 text-sm text-green-400">{state.success}</p>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2.5 font-semibold text-black shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50"
        >
          {pending ? t("saving") : t("create")}
        </button>
      </div>
    </form>
  );
}
