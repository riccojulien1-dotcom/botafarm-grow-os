"use client";

import {
  DEFAULT_GROW_ROOM_STATUS,
  GROW_ROOM_STATUSES,
  type GrowRoomStatus,
} from "@/lib/grow-rooms/constants";
import { growRoomStatusLabel } from "@/lib/i18n/grow-room-status-label";
import { useTranslations } from "next-intl";

export type GrowRoomFieldValues = {
  name: string;
  status: GrowRoomStatus | string;
  room_type: string | null;
  plant_count: number | null;
  dimensions: string | null;
  lighting: string | null;
  substrate: string | null;
  genetics: string | null;
  irrigation: string | null;
  notes: string | null;
  cycle_start_date: string | null;
  target_cycle_days: number | null;
};

type GrowRoomFieldsProps = {
  idPrefix: string;
  values?: Partial<GrowRoomFieldValues>;
};

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

export function GrowRoomFields({ idPrefix, values }: GrowRoomFieldsProps) {
  const t = useTranslations("growRooms.form");
  const tStatus = useTranslations("growRooms.status");
  const status = values?.status ?? DEFAULT_GROW_ROOM_STATUS;

  return (
    <>
      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-name`} className="text-sm text-zinc-200">
          {t("fields.name")}
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          defaultValue={values?.name ?? ""}
          className={inputClassName}
          placeholder={t("fields.namePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-status`} className="text-sm text-zinc-200">
          {t("fields.status")}
        </label>
        <select
          id={`${idPrefix}-status`}
          name="status"
          required
          defaultValue={status}
          className={inputClassName}
        >
          {GROW_ROOM_STATUSES.map((option) => (
            <option key={option} value={option}>
              {growRoomStatusLabel(tStatus, option)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-room_type`} className="text-sm text-zinc-200">
          {t("fields.type")}
        </label>
        <input
          id={`${idPrefix}-room_type`}
          name="room_type"
          defaultValue={values?.room_type ?? ""}
          className={inputClassName}
          placeholder={t("fields.typePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-cycle_start_date`} className="text-sm text-zinc-200">
          {t("fields.cycleStart")}
        </label>
        <input
          id={`${idPrefix}-cycle_start_date`}
          name="cycle_start_date"
          type="date"
          defaultValue={values?.cycle_start_date ?? ""}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-target_cycle_days`} className="text-sm text-zinc-200">
          {t("fields.targetCycleDays")}
        </label>
        <input
          id={`${idPrefix}-target_cycle_days`}
          name="target_cycle_days"
          type="number"
          min={1}
          defaultValue={values?.target_cycle_days ?? ""}
          className={inputClassName}
          placeholder="63"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-plant_count`} className="text-sm text-zinc-200">
          {t("fields.plantCount")}
        </label>
        <input
          id={`${idPrefix}-plant_count`}
          name="plant_count"
          type="number"
          min={0}
          defaultValue={values?.plant_count ?? ""}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-dimensions`} className="text-sm text-zinc-200">
          {t("fields.dimensions")}
        </label>
        <input
          id={`${idPrefix}-dimensions`}
          name="dimensions"
          defaultValue={values?.dimensions ?? ""}
          className={inputClassName}
          placeholder="120x120x200"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-lighting`} className="text-sm text-zinc-200">
          {t("fields.lighting")}
        </label>
        <input
          id={`${idPrefix}-lighting`}
          name="lighting"
          defaultValue={values?.lighting ?? ""}
          className={inputClassName}
          placeholder={t("fields.lightingPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-substrate`} className="text-sm text-zinc-200">
          {t("fields.substrate")}
        </label>
        <input
          id={`${idPrefix}-substrate`}
          name="substrate"
          defaultValue={values?.substrate ?? ""}
          className={inputClassName}
          placeholder={t("fields.substratePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-genetics`} className="text-sm text-zinc-200">
          {t("fields.genetics")}
        </label>
        <input
          id={`${idPrefix}-genetics`}
          name="genetics"
          defaultValue={values?.genetics ?? ""}
          className={inputClassName}
          placeholder={t("fields.geneticsPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-irrigation`} className="text-sm text-zinc-200">
          {t("fields.irrigation")}
        </label>
        <input
          id={`${idPrefix}-irrigation`}
          name="irrigation"
          defaultValue={values?.irrigation ?? ""}
          className={inputClassName}
          placeholder={t("fields.irrigationPlaceholder")}
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-notes`} className="text-sm text-zinc-200">
          {t("fields.notes")}
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          rows={3}
          defaultValue={values?.notes ?? ""}
          className={inputClassName}
          placeholder={t("fields.notesPlaceholder")}
        />
      </div>
    </>
  );
}
