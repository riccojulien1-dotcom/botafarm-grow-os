type BfHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "page" | "section";
};

export function BfHeading({ eyebrow, title, subtitle, size = "page" }: BfHeadingProps) {
  const titleClass =
    size === "page"
      ? "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
      : "text-xl font-bold tracking-tight sm:text-2xl";

  return (
    <header className="space-y-2">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/90">
          {eyebrow}
        </p>
      ) : null}
      <h1 className={`${titleClass} text-white`}>{title}</h1>
      {subtitle ? (
        <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">{subtitle}</p>
      ) : null}
    </header>
  );
}
