"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CopilotBriefing } from "@/lib/copilot/types";
import { BotafarmCopilotPanel } from "@/components/copilot/botafarm-copilot-panel";

type DashboardWithCopilotProps = {
  briefing: CopilotBriefing;
  children: React.ReactNode;
};

export function DashboardWithCopilot({ briefing, children }: DashboardWithCopilotProps) {
  const pathname = usePathname();
  const showCopilot = pathname !== "/dashboard/environment";

  if (!showCopilot) {
    return <div className="min-w-0">{children}</div>;
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">{children}</div>
      <aside className="xl:sticky xl:top-24">
        <BotafarmCopilotPanel briefing={briefing} />
      </aside>
    </div>
  );
}
