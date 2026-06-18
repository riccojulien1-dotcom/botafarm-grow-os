import type { DailyLogFieldValues } from "@/lib/journal/daily-log-fields";

type DailyLogFieldsProps = {
  idPrefix: string;
  values?: Partial<DailyLogFieldValues>;
  showLogDate?: boolean;
  defaultLogDate?: string;
};

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

function inputValue(value: number | null | undefined) {
  return value == null ? "" : String(value);
}

function SectionHeading({ children }: { children: string }) {
  return (
    <p className="md:col-span-2 text-xs font-medium uppercase tracking-wide text-fuchsia-300/90">
      {children}
    </p>
  );
}

export function DailyLogFields({
  idPrefix,
  values,
  showLogDate = true,
  defaultLogDate,
}: DailyLogFieldsProps) {
  return (
    <>
      {showLogDate ? (
        <div className="md:col-span-2">
          <label htmlFor={`${idPrefix}-log_date`} className="text-sm text-zinc-200">
            Log date
          </label>
          <input
            id={`${idPrefix}-log_date`}
            name="log_date"
            type="date"
            required
            defaultValue={values?.log_date ?? defaultLogDate ?? ""}
            className={inputClassName}
          />
        </div>
      ) : null}

      <SectionHeading>Environment</SectionHeading>
      <div>
        <label htmlFor={`${idPrefix}-temperature`} className="text-sm text-zinc-200">
          Temperature (°C)
        </label>
        <input
          id={`${idPrefix}-temperature`}
          name="temperature"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.temperature)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-humidity`} className="text-sm text-zinc-200">
          Humidity (%)
        </label>
        <input
          id={`${idPrefix}-humidity`}
          name="humidity"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.humidity)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-vpd`} className="text-sm text-zinc-200">
          VPD (kPa)
        </label>
        <input
          id={`${idPrefix}-vpd`}
          name="vpd"
          type="number"
          step="0.01"
          defaultValue={inputValue(values?.vpd)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-ppfd`} className="text-sm text-zinc-200">
          PPFD (µmol/m²/s)
        </label>
        <input
          id={`${idPrefix}-ppfd`}
          name="ppfd"
          type="number"
          step="1"
          min={0}
          defaultValue={inputValue(values?.ppfd)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-dli`} className="text-sm text-zinc-200">
          DLI (mol/m²/day)
        </label>
        <input
          id={`${idPrefix}-dli`}
          name="dli"
          type="number"
          step="0.1"
          min={0}
          defaultValue={inputValue(values?.dli)}
          className={inputClassName}
        />
      </div>

      <SectionHeading>Nutrition</SectionHeading>
      <div>
        <label htmlFor={`${idPrefix}-ec_in`} className="text-sm text-zinc-200">
          EC in
        </label>
        <input
          id={`${idPrefix}-ec_in`}
          name="ec_in"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.ec_in)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-ph_in`} className="text-sm text-zinc-200">
          pH in
        </label>
        <input
          id={`${idPrefix}-ph_in`}
          name="ph_in"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.ph_in)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-ec_runoff`} className="text-sm text-zinc-200">
          EC out
        </label>
        <input
          id={`${idPrefix}-ec_runoff`}
          name="ec_runoff"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.ec_runoff)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-ph_runoff`} className="text-sm text-zinc-200">
          pH out
        </label>
        <input
          id={`${idPrefix}-ph_runoff`}
          name="ph_runoff"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.ph_runoff)}
          className={inputClassName}
        />
      </div>

      <SectionHeading>Irrigation</SectionHeading>
      <div>
        <label htmlFor={`${idPrefix}-irrigation_count`} className="text-sm text-zinc-200">
          Irrigation count
        </label>
        <input
          id={`${idPrefix}-irrigation_count`}
          name="irrigation_count"
          type="number"
          step="1"
          min={0}
          defaultValue={inputValue(values?.irrigation_count)}
          className={inputClassName}
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-irrigation_volume_per_event`}
          className="text-sm text-zinc-200"
        >
          Irrigation volume (L)
        </label>
        <input
          id={`${idPrefix}-irrigation_volume_per_event`}
          name="irrigation_volume_per_event"
          type="number"
          step="0.1"
          min={0}
          defaultValue={inputValue(values?.irrigation_volume_per_event)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-runoff_percent`} className="text-sm text-zinc-200">
          Runoff (%)
        </label>
        <input
          id={`${idPrefix}-runoff_percent`}
          name="runoff_percent"
          type="number"
          step="0.1"
          min={0}
          defaultValue={inputValue(values?.runoff_percent)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-dryback_percent`} className="text-sm text-zinc-200">
          Dryback (%)
        </label>
        <input
          id={`${idPrefix}-dryback_percent`}
          name="dryback_percent"
          type="number"
          step="0.1"
          min={0}
          defaultValue={inputValue(values?.dryback_percent)}
          className={inputClassName}
        />
      </div>

      <SectionHeading>Plant development</SectionHeading>
      <div>
        <label htmlFor={`${idPrefix}-plant_height_cm`} className="text-sm text-zinc-200">
          Plant height (cm)
        </label>
        <input
          id={`${idPrefix}-plant_height_cm`}
          name="plant_height_cm"
          type="number"
          step="0.1"
          min={0}
          defaultValue={inputValue(values?.plant_height_cm)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-stretch_percent`} className="text-sm text-zinc-200">
          Stretch (%)
        </label>
        <input
          id={`${idPrefix}-stretch_percent`}
          name="stretch_percent"
          type="number"
          step="0.1"
          defaultValue={inputValue(values?.stretch_percent)}
          className={inputClassName}
        />
      </div>

      <SectionHeading>Observations</SectionHeading>
      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-notes`} className="text-sm text-zinc-200">
          Notes
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          rows={3}
          defaultValue={values?.notes ?? ""}
          className={inputClassName}
          placeholder="Plant status, tasks done, observations..."
        />
      </div>
    </>
  );
}
