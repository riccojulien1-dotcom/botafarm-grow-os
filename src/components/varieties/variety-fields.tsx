import type { VarietyFieldValues } from "@/lib/varieties/parse-variety-form";

type VarietyFieldsProps = {
  idPrefix: string;
  values?: Partial<VarietyFieldValues>;
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
          className={inputClassName}
          placeholder="True Angel"
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
          className={inputClassName}
          placeholder="Cereal Milk × Zushi"
        />
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
          defaultValue={values?.plant_count ?? ""}
          className={inputClassName}
          placeholder="15"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-flowering_duration_days`}
          className="text-sm text-zinc-200"
        >
          Flowering duration (days)
        </label>
        <input
          id={`${idPrefix}-flowering_duration_days`}
          name="flowering_duration_days"
          type="number"
          min={1}
          defaultValue={values?.flowering_duration_days ?? ""}
          className={inputClassName}
          placeholder="63"
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
          className={inputClassName}
          placeholder="Pheno notes, batch ID, etc."
        />
      </div>
    </>
  );
}
