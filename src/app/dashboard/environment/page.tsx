import { EnvironmentSupervisionView } from "@/components/environment/environment-supervision-view";
import { requireUser } from "@/lib/auth/get-user";
import { getEnvironmentSupervisionData } from "@/lib/environment/get-environment-supervision-data";

export const dynamic = "force-dynamic";

export default async function EnvironmentDetailsPage() {
  const user = await requireUser();
  const data = await getEnvironmentSupervisionData(user.id);

  return <EnvironmentSupervisionView data={data} />;
}
