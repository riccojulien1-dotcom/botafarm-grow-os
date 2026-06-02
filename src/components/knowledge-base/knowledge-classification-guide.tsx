import { HANDBOOK_FEED_BRAIN_CATEGORIES } from "@/lib/knowledge-base/domains/irrigation-manifest";

const CLASSIFICATION_EXAMPLES = [
  { concept: "Dryback", category: "Irrigation", also: "tags: crop-steering" },
  { concept: "VPD", category: "Environment" },
  { concept: "Temperature", category: "Environment" },
  { concept: "Humidity", category: "Environment" },
  { concept: "EC Runoff", category: "Irrigation" },
  { concept: "Generative Steering", category: "Crop Steering" },
  { concept: "Vegetative Steering", category: "Crop Steering" },
] as const;

export function KnowledgeClassificationGuide() {
  return (
    <div className="space-y-3 rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
          Independent classification
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          The Irrigation Handbook is a multi-domain source. Do not force all entries into
          Irrigation — classify each entry into the appropriate Brain category.
        </p>
      </div>

      <p className="text-xs text-zinc-500">
        Expected feed categories: {HANDBOOK_FEED_BRAIN_CATEGORIES.join(" · ")}
      </p>

      <ul className="grid gap-2 sm:grid-cols-2">
        {CLASSIFICATION_EXAMPLES.map((row) => (
          <li
            key={row.concept}
            className="rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2 text-sm"
          >
            <span className="font-medium text-zinc-100">{row.concept}</span>
            <span className="text-zinc-500"> → </span>
            <span className="text-fuchsia-200/90">{row.category}</span>
            {"also" in row && row.also ? (
              <span className="mt-0.5 block text-[11px] text-zinc-600">{row.also}</span>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="text-[11px] text-zinc-600">
        One source · many categories · many metrics · many phases — per entry, not per batch.
      </p>
    </div>
  );
}
