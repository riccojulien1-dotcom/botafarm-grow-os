import { AppShell } from "@/components/layout/app-shell";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardWithCopilot } from "@/components/layout/dashboard-with-copilot";
import { isBotafarmAdmin } from "@/lib/auth/admin";
import { requireUser } from "@/lib/auth/get-user";
import { getCopilotBriefing } from "@/lib/copilot/get-copilot-briefing";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const showAdminLink = isBotafarmAdmin(user);
  const copilotBriefing = await getCopilotBriefing(user.id);

  return (
    <AppShell user={user}>
      <DashboardNav showAdminLink={showAdminLink} />
      <DashboardWithCopilot briefing={copilotBriefing}>{children}</DashboardWithCopilot>
    </AppShell>
  );
}
