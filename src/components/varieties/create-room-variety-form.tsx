"use client";

import { useActionState, useState } from "react";

import { createRoomVarietyAction } from "@/app/rooms/[id]/variety-actions";
import { VarietyFields } from "@/components/varieties/variety-fields";
import { VarietyPresetPicker } from "@/components/varieties/variety-preset-picker";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useRefreshOnActionSuccess } from "@/lib/hooks/use-refresh-on-action-success";
import type { VarietyFieldValues } from "@/lib/varieties/parse-variety-form";
import type { VarietyPreset } from "@/lib/varieties/types";

const initialState: { error?: string; success?: string } = {};

type CreateRoomVarietyFormProps = {
  growRoomId: string;
  presets: VarietyPreset[];
};

export function CreateRoomVarietyForm({ growRoomId, presets }: CreateRoomVarietyFormProps) {
  const [state, formAction, pending] = useActionState(createRoomVarietyAction, initialState);
  const [fieldDefaults, setFieldDefaults] = useState<Partial<VarietyFieldValues>>({});
  const [formSession, setFormSession] = useState(0);

  useRefreshOnActionSuccess(state, {
    onSuccess: () => {
      setFieldDefaults({});
      setFormSession((value) => value + 1);
    },
  });

  return (
    <form
      key={`create-variety-${growRoomId}-${formSession}`}
      action={formAction}
      onKeyDown={preventImplicitFormSubmitOnEnter}
      className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-2"
    >
      <input type="hidden" name="grow_room_id" value={growRoomId} />

      <VarietyPresetPicker
        presets={presets}
        onApply={(values) => setFieldDefaults(values)}
      />

      <VarietyFields
        idPrefix={`create-variety-${growRoomId}`}
        values={fieldDefaults}
      />

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
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
        >
          {pending ? "Adding..." : "Add variety"}
        </button>
      </div>
    </form>
  );
}
