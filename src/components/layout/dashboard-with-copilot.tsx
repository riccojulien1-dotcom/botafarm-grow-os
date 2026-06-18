import type { CopilotBriefing } from "@/lib/copilot/types";
import { BotafarmCopilotPanel } from "@/components/copilot/botafarm-copilot-panel";

type DashboardWithCopilotProps = {
  briefing: CopilotBriefing;
  children: React.ReactNode;
};

export function DashboardWithCopilot({ briefing, children }: DashboardWithCopilotProps) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">{children}</div>
      <aside className="xl:sticky xl:top-24">
        <BotafarmCopilotPanel briefing={briefing} />
      </aside>
    </div>
  );
}
