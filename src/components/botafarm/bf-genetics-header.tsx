type BfGeneticsHeaderProps = {
  cultivarName: string | null;
  genetics: string | null;
  fallbackLabel?: string;
  size?: "default" | "large";
};

export function BfGeneticsHeader({
  cultivarName,
  genetics,
  fallbackLabel = "NO CULTIVAR ASSIGNED",
  size = "default",
}: BfGeneticsHeaderProps) {
  const titleClass =
    size === "large"
      ? "text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl"
      : "text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl";

  if (!cultivarName) {
    return (
      <div className="space-y-1">
        <p className="bf-lab-label">Genetics</p>
        <p className={`${titleClass} text-zinc-500`}>{fallbackLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="bf-lab-label">Primary cultivar</p>
      <h3 className={titleClass}>{cultivarName}</h3>
      {genetics ? (
        <p className="text-base font-medium text-fuchsia-300/95 sm:text-lg">{genetics}</p>
      ) : (
        <p className="text-sm text-zinc-500">Lineage not documented</p>
      )}
    </div>
  );
}
