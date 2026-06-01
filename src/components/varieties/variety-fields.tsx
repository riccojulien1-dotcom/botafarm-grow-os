import {
  SENSITIVITY_LEVELS,
  SENSITIVITY_LABELS,
  VARIETY_TYPES,
} from "@/lib/varieties/constants";
import type { VarietyFieldValues } from "@/lib/varieties/parse-variety-form";

type VarietyFieldsProps = {
  idPrefix: string;
  values?: Partial<VarietyFieldValues> & {
    plant_count?: number | null;
  };
};

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

export function VarietyFields({ idPrefix, values }: VarietyFieldsProps) {
  return (
    <>
      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-name`} className="text-sm text-zinc-200">
          Variety name
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          defaultValue={values?.name ?? ""}
          key={`${idPrefix}-name-${values?.name ?? ""}`}
          className={inputClassName}
          placeholder="True Angel"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-variety_type`} className="text-sm text-zinc-200">
          Variety type
        </label>
        <select
          id={`${idPrefix}-variety_type`}
          name="variety_type"
          defaultValue={values?.variety_type ?? "Hybrid"}
          key={`${idPrefix}-variety_type-${values?.variety_type ?? "Hybrid"}`}
          className={inputClassName}
        >
          {VARIETY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-plant_count`} className="text-sm text-zinc-200">
          Plant count
        </label>
        <input
          id={`${idPrefix}-plant_count`}
          name="plant_count"
          type="number"
          min={0}
          required
          defaultValue={
            values?.plant_count != null ? values.plant_count : ""
          }
          key={`${idPrefix}-plant_count-${values?.plant_count ?? "empty"}`}
          className={inputClassName}
          placeholder="15"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-genetics`} className="text-sm text-zinc-200">
          Cross / genetics
        </label>
        <input
          id={`${idPrefix}-genetics`}
          name="genetics"
          defaultValue={values?.genetics ?? ""}
          key={`${idPrefix}-genetics-${values?.genetics ?? ""}`}
          className={inputClassName}
          placeholder="Cereal Milk × Zushi"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-harvest_window_start_days`}
          className="text-sm text-zinc-200"
        >
          Harvest window start (day)
        </label>
        <input
          id={`${idPrefix}-harvest_window_start_days`}
          name="harvest_window_start_days"
          type="number"
          min={1}
          defaultValue={values?.harvest_window_start_days ?? ""}
          key={`${idPrefix}-harvest-start-${values?.harvest_window_start_days ?? ""}`}
          className={inputClassName}
          placeholder="56"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-harvest_window_end_days`} className="text-sm text-zinc-200">
          Harvest window end (day)
        </label>
        <input
          id={`${idPrefix}-harvest_window_end_days`}
          name="harvest_window_end_days"
          type="number"
          min={1}
          defaultValue={values?.harvest_window_end_days ?? ""}
          key={`${idPrefix}-harvest-end-${values?.harvest_window_end_days ?? ""}`}
          className={inputClassName}
          placeholder="63"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-flowering_duration_days`}
          className="text-sm text-zinc-200"
        >
          Flowering target (days, optional)
        </label>
        <input
          id={`${idPrefix}-flowering_duration_days`}
          name="flowering_duration_days"
          type="number"
          min={1}
          defaultValue={values?.flowering_duration_days ?? ""}
          key={`${idPrefix}-flower-days-${values?.flowering_duration_days ?? ""}`}
          className={inputClassName}
          placeholder="Single target day"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-stretch`} className="text-sm text-zinc-200">
          Stretch
        </label>
        <select
          id={`${idPrefix}-stretch`}
          name="stretch"
          defaultValue={values?.stretch ?? "medium"}
          key={`${idPrefix}-stretch-${values?.stretch ?? "medium"}`}
          className={inputClassName}
        >
          {SENSITIVITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {SENSITIVITY_LABELS[level]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-ec_sensitivity`} className="text-sm text-zinc-200">
          EC sensitivity
        </label>
        <select
          id={`${idPrefix}-ec_sensitivity`}
          name="ec_sensitivity"
          defaultValue={values?.ec_sensitivity ?? "medium"}
          key={`${idPrefix}-ec-${values?.ec_sensitivity ?? "medium"}`}
          className={inputClassName}
        >
          {SENSITIVITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {SENSITIVITY_LABELS[level]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-irrigation_sensitivity`}
          className="text-sm text-zinc-200"
        >
          Irrigation sensitivity
        </label>
        <select
          id={`${idPrefix}-irrigation_sensitivity`}
          name="irrigation_sensitivity"
          defaultValue={values?.irrigation_sensitivity ?? "medium"}
          key={`${idPrefix}-irrigation-${values?.irrigation_sensitivity ?? "medium"}`}
          className={inputClassName}
        >
          {SENSITIVITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {SENSITIVITY_LABELS[level]}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-phenotype_notes`} className="text-sm text-zinc-200">
          Phenotype notes
        </label>
        <textarea
          id={`${idPrefix}-phenotype_notes`}
          name="phenotype_notes"
          rows={2}
          defaultValue={values?.phenotype_notes ?? ""}
          key={`${idPrefix}-phenotype-${values?.phenotype_notes ?? ""}`}
          className={inputClassName}
          placeholder="How this pheno behaves in your room..."
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor={`${idPrefix}-notes`} className="text-sm text-zinc-200">
          Notes
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          rows={2}
          defaultValue={values?.notes ?? ""}
          key={`${idPrefix}-notes-${values?.notes ?? ""}`}
          className={inputClassName}
          placeholder="Batch ID, location, etc."
        />
      </div>
    </>
  );
}
