import type { GrowRoomStatus } from "@/lib/grow-rooms/constants";

type GrowRoomStatusBadgeProps = {
  status: GrowRoomStatus | string | null;
};

export function GrowRoomStatusBadge({ status }: GrowRoomStatusBadgeProps) {
  const label = status ?? "Vegetative";

  return (
    <span className="inline-flex rounded-lg border border-cyan-500/25 bg-cyan-950/25 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-300/90">
      {label}
    </span>
  );
}
