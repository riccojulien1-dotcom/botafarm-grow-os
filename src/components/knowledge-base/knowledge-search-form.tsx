type KnowledgeSearchFormProps = {
  defaultQuery?: string;
  hiddenParams?: Record<string, string | undefined>;
};

export function KnowledgeSearchForm({
  defaultQuery = "",
  hiddenParams = {},
}: KnowledgeSearchFormProps) {
  return (
    <form action="/dashboard/knowledge" method="get" className="flex flex-wrap gap-2">
      {Object.entries(hiddenParams).map(([key, value]) =>
        value ? <input key={key} type="hidden" name={key} value={value} /> : null,
      )}
      <label className="sr-only" htmlFor="knowledge-search">
        Search Botafarm knowledge
      </label>
      <input
        id="knowledge-search"
        name="q"
        type="search"
        defaultValue={defaultQuery}
        placeholder="Search titles, topics, tags, protocols…"
        className="min-w-[16rem] flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-fuchsia-500/40 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg border border-fuchsia-500/40 bg-fuchsia-950/40 px-4 py-2 text-xs font-medium uppercase tracking-wider text-fuchsia-200 transition hover:border-fuchsia-400/60"
      >
        Search
      </button>
    </form>
  );
}
