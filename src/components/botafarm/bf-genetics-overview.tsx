import { formatRoomStatusTitle, toTitleCase } from "@/lib/ui/format-mission-labels";

type BfGeneticsOverviewProps = {
  cultivarName: string | null;
  genetics: string | null;
  roomName: string;
  roomStatus: string;
  plantCount: number;
};

export function BfGeneticsOverview({
  cultivarName,
  genetics,
  roomName,
  roomStatus,
  plantCount,
}: BfGeneticsOverviewProps) {
  return (
    <div className="bf-genetics-sheet bf-glass-shine rounded-2xl border border-white/[0.08] p-5 sm:p-6">
      <p className="bf-lab-label mb-4 text-cyan-500/80">Genetics overview</p>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SheetField
          label="Primary cultivar"
          value={cultivarName ? toTitleCase(cultivarName) : "Not assigned"}
          prominent
        />
        <SheetField label="Lineage" value={genetics ?? "Not documented"} />
        <SheetField label="Room" value={formatRoomStatusTitle(roomStatus)} sub={toTitleCase(roomName)} />
        <SheetField label="Plants" value={String(plantCount)} accent="cyan" />
      </dl>
    </div>
  );
}

function SheetField({
  label,
  value,
  sub,
  prominent,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  prominent?: boolean;
  accent?: "cyan";
}) {
  return (
    <div className="border-l border-white/[0.08] pl-4 first:border-l-0 first:pl-0">
      <dt className="bf-lab-label">{label}</dt>
      <dd
        className={`mt-2 font-semibold tracking-tight ${
          prominent
            ? "text-xl text-white sm:text-2xl"
            : accent === "cyan"
              ? "text-lg text-cyan-300"
              : "text-base text-zinc-200"
        }`}
      >
        {value}
      </dd>
      {sub ? <dd className="mt-1 text-xs text-zinc-500">{sub}</dd> : null}
    </div>
  );
}
