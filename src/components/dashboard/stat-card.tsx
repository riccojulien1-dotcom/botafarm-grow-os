type StatCardProps = {
  label: string;
  value: string;
  helpText?: string;
};

export function StatCard({ label, value, helpText }: StatCardProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {helpText ? <p className="mt-2 text-sm text-zinc-400">{helpText}</p> : null}
    </article>
  );
}
