type BfPageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function BfPageHeader({ eyebrow = "Botafarm Grow OS", title, subtitle }: BfPageHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="bf-section-eyebrow text-cyan-500/75">{eyebrow}</p>
      <h1 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">{title}</h1>
      {subtitle ? <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">{subtitle}</p> : null}
    </header>
  );
}
