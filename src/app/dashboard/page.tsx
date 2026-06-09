import { CommandCenterOverview } from "@/components/dashboard/command-center-overview";
import { requireUser } from "@/lib/auth/get-user";
import { getCommandCenterData } from "@/lib/dashboard/get-command-center-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getCommandCenterData(user.id);

  return <CommandCenterOverview data={data} />;
}
