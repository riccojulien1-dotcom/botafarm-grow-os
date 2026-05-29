import type { GrowRoomStatus } from "@/lib/grow-rooms/constants";

type GrowRoomStatusBadgeProps = {
  status: GrowRoomStatus | string | null;
};

export function GrowRoomStatusBadge({ status }: GrowRoomStatusBadgeProps) {
  const label = status ?? "Vegetative";

  return (
    <span className="inline-flex rounded-full border border-fuchsia-900/60 bg-fuchsia-950/40 px-2.5 py-0.5 text-xs font-medium text-fuchsia-300">
      {label}
    </span>
  );
}
