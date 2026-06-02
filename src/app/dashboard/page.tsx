import { CommandCenterOverview } from "@/components/dashboard/command-center-overview";
import { requireUser } from "@/lib/auth/get-user";
import { getCommandCenterData } from "@/lib/dashboard/get-command-center-data";
import { getEnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [data, environment] = await Promise.all([
    getCommandCenterData(user.id),
    getEnvironmentIntelligence(user.id),
  ]);

  return <CommandCenterOverview data={data} environment={environment} />;
}
