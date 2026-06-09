"use client";

import { useState } from "react";

import { EnvironmentRoomHealthOverview } from "@/components/environment/environment-room-health-overview";
import { EnvironmentRoomSupervisionPanel } from "@/components/environment/environment-room-supervision-panel";
import type { EnvironmentSupervisionData } from "@/lib/environment/get-environment-supervision-data";

type EnvironmentSupervisionShellProps = {
  data: EnvironmentSupervisionData;
};

export function EnvironmentSupervisionShell({ data }: EnvironmentSupervisionShellProps) {
  const [highlightRoomId, setHighlightRoomId] = useState<string | null>(null);

  function focusRoom(roomId: string) {
    setHighlightRoomId(roomId);
    const element = document.getElementById(`room-env-${roomId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setHighlightRoomId(null), 2400);
  }

  return (
    <div className="space-y-6">
      <EnvironmentRoomHealthOverview rooms={data.rooms} onSelectRoom={focusRoom} />

      <ul className="flex flex-col gap-6">
        {data.rooms.map((room) => (
          <EnvironmentRoomSupervisionPanel
            key={room.id}
            room={room}
            highlighted={highlightRoomId === room.id}
          />
        ))}
      </ul>
    </div>
  );
}
