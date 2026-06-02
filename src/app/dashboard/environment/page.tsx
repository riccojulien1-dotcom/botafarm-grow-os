import { EnvironmentDetailsView } from "@/components/environment/environment-details-view";
import { requireUser } from "@/lib/auth/get-user";
import { getEnvironmentIntelligence } from "@/lib/environment/get-environment-intelligence";

export const dynamic = "force-dynamic";

export default async function EnvironmentDetailsPage() {
  const user = await requireUser();
  const data = await getEnvironmentIntelligence(user.id);

  return <EnvironmentDetailsView data={data} />;
}
