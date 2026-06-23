"use client";

import { createDailyLogAction } from "@/app/dashboard/journal/actions";
import { DailyLogFields } from "@/components/journal/daily-log-fields";
import { DailyLogPhotoField } from "@/components/journal/daily-log-photo-field";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useDailyLogFormWithPhotos } from "@/lib/hooks/use-daily-log-form-with-photos";
import { dailyLogActionInitialState } from "@/lib/journal/daily-log-action-state";
import { useTranslations } from "next-intl";

type GrowRoomOption = {
  id: string;
  name: string;
};

function todayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateDailyLogForm({ growRooms }: { growRooms: GrowRoomOption[] }) {
  const t = useTranslations("journal.form");
  const { state, photoError, pending, handleSubmit } = useDailyLogFormWithPhotos(
    createDailyLogAction,
    dailyLogActionInitialState,
  );

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      onKeyDown={preventImplicitFormSubmitOnEnter}
      className="grid gap-4 rounded-xl bf-inset-panel p-4 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <label htmlFor="grow_room_id" className="text-sm text-zinc-200">
          {t("growRoom")}
        </label>
        <select
          id="grow_room_id"
          name="grow_room_id"
          required
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
        >
          <option value="">{t("selectGrowRoom")}</option>
          {growRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <DailyLogFields
        idPrefix="dashboard-create-log"
        defaultLogDate={todayDateInputValue()}
      />
      <DailyLogPhotoField idPrefix="dashboard-create-log" />

      {state?.error || photoError ? (
        <p className="md:col-span-2 text-sm text-red-400" role="alert">
          {state?.error ?? photoError}
        </p>
      ) : null}
      {state?.success ? (
        <p className="md:col-span-2 text-sm text-green-400">{state.success}</p>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
        >
          {pending ? t("saving") : t("saveEntry")}
        </button>
      </div>
    </form>
  );
}
