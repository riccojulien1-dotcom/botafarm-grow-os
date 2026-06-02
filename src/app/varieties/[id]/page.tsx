import { notFound } from "next/navigation";

import { VarietyDetailView } from "@/components/cultivation/variety-detail-view";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/get-user";
import { fetchVarietyDetail } from "@/lib/cultivation/fetch-room-cultivars";

export const dynamic = "force-dynamic";

type VarietyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VarietyDetailPage({ params }: VarietyPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const context = await fetchVarietyDetail(user.id, id);

  if (!context) {
    notFound();
  }

  return (
    <AppShell user={user}>
      <VarietyDetailView context={context} />
    </AppShell>
  );
}
