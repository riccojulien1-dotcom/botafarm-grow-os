"use client";

import { useState } from "react";

import type { VarietyPreset } from "@/lib/varieties/types";
import { presetToFormDefaults } from "@/lib/varieties/build-variety-payload";
import type { VarietyFieldValues } from "@/lib/varieties/parse-variety-form";

type VarietyPresetPickerProps = {
  presets: VarietyPreset[];
  onApply: (values: Partial<VarietyFieldValues>) => void;
};

export function VarietyPresetPicker({ presets, onApply }: VarietyPresetPickerProps) {
  const [selectedSlug, setSelectedSlug] = useState("");

  function handleChange(slug: string) {
    setSelectedSlug(slug);
    if (!slug) {
      return;
    }

    const preset = presets.find((entry) => entry.slug === slug);
    if (preset) {
      onApply(presetToFormDefaults(preset));
    }
  }

  if (!presets.length) {
    return null;
  }

  return (
    <div className="md:col-span-2 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
      <label htmlFor="variety-preset-slug" className="text-sm text-zinc-200">
        Botafarm preset (optional template)
      </label>
      <p className="mt-1 text-xs text-zinc-500">
        Fills starting values you can edit. Timing fields stay empty until you set them for this
        grow.
      </p>
      <select
        id="variety-preset-slug"
        name="preset_slug"
        value={selectedSlug}
        onChange={(event) => handleChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
      >
        <option value="">Custom variety (manual)</option>
        {presets.map((preset) => (
          <option key={preset.slug} value={preset.slug}>
            {preset.name}
          </option>
        ))}
      </select>
    </div>
  );
}
