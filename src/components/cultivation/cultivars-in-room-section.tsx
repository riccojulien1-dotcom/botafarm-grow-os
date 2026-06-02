import { CultivarInRoomCard } from "@/components/cultivation/cultivar-in-room-card";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import type { RoomCultivarView } from "@/lib/cultivation/types";

type CultivarsInRoomSectionProps = {
  roomName: string;
  cultivars: RoomCultivarView[];
};

export function CultivarsInRoomSection({ roomName, cultivars }: CultivarsInRoomSectionProps) {
  return (
    <GlassPanel glow="magenta" padding="lg" className="space-y-4">
      <div>
        <p className="bf-section-eyebrow text-fuchsia-400/80">Per-cultivar tracking</p>
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">
          Cultivars in room
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Environment stays shared for {roomName}. Each cultivar has its own plants, flower day,
          and harvest window.
        </p>
      </div>

      {cultivars.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cultivars.map((cultivar) => (
            <li key={cultivar.variety.id}>
              <CultivarInRoomCard cultivar={cultivar} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bf-inset-panel px-4 py-5 text-sm text-zinc-400">
          No cultivars in this room yet. Add varieties below to track per-strain progress.
        </p>
      )}
    </GlassPanel>
  );
}
