import Link from "next/link";

import { CULTIVAR_BATCH_STATUS_LABELS } from "@/lib/cultivation/constants";
import type { RoomCultivarView } from "@/lib/cultivation/types";
import { varietyCrossLine } from "@/lib/ui/genetics-display";

type CultivarInRoomCardProps = {
  cultivar: RoomCultivarView;
};

export function CultivarInRoomCard({ cultivar }: CultivarInRoomCardProps) {
  const { variety, batch, computed } = cultivar;
  const cross = varietyCrossLine(variety);
  const statusLabel = CULTIVAR_BATCH_STATUS_LABELS[batch.status];

  return (
    <Link
      href={`/varieties/${variety.id}`}
      className="group block rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/10 p-4 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-900/20"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-fuchsia-100">
          {variety.name}
        </h3>
        <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
          {statusLabel}
        </span>
      </div>

      {cross ? <p className="mt-1 text-sm text-fuchsia-300/80">{cross}</p> : null}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-zinc-500">Plants</dt>
          <dd className="mt-1 font-semibold text-zinc-100">{batch.plant_count}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-zinc-500">Flower day</dt>
          <dd className="mt-1 font-semibold text-zinc-100">{computed.currentDayLabel}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wider text-zinc-500">Harvest</dt>
          <dd className="mt-1 font-medium text-cyan-200/90">{computed.harvestEstimateLabel}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wider text-zinc-500">Countdown</dt>
          <dd className="mt-1 text-fuchsia-200/90">{computed.daysRemainingLabel}</dd>
        </div>
      </dl>
    </Link>
  );
}
