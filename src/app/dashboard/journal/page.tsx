import { JournalDashboardView } from "@/components/journal/journal-dashboard-view";
import { requireUser } from "@/lib/auth/get-user";
import { getJournalPageData } from "@/lib/journal/get-journal-page-data";

export const dynamic = "force-dynamic";

type JournalPageProps = {
  searchParams: Promise<{
    room?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const data = await getJournalPageData(user.id, {
    roomId: params.room,
    from: params.from,
    to: params.to,
  });

  return (
    <JournalDashboardView
      data={data}
      filters={{
        roomId: params.room,
        from: params.from,
        to: params.to,
      }}
    />
  );
}
