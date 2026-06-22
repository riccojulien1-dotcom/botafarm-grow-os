"use client";

import { createRoomDailyLogAction } from "@/app/rooms/[id]/actions";
import { DailyLogFields } from "@/components/journal/daily-log-fields";
import { DailyLogPhotoField } from "@/components/journal/daily-log-photo-field";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useDailyLogFormWithPhotos } from "@/lib/hooks/use-daily-log-form-with-photos";
import { dailyLogActionInitialState } from "@/lib/journal/daily-log-action-state";

type CreateRoomDailyLogFormProps = {
  growRoomId: string;
};

function todayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateRoomDailyLogForm({ growRoomId }: CreateRoomDailyLogFormProps) {
  const { state, photoError, pending, handleSubmit } = useDailyLogFormWithPhotos(
    createRoomDailyLogAction,
    dailyLogActionInitialState,
  );

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      onKeyDown={preventImplicitFormSubmitOnEnter}
      className="grid gap-4 rounded-xl bf-inset-panel p-4 md:grid-cols-2"
    >
      <input type="hidden" name="grow_room_id" value={growRoomId} />
      <DailyLogFields
        idPrefix={`create-log-${growRoomId}`}
        defaultLogDate={todayDateInputValue()}
      />
      <DailyLogPhotoField idPrefix={`create-log-${growRoomId}`} />

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
          {pending ? "Saving..." : "Save journal log"}
        </button>
      </div>
    </form>
  );
}
