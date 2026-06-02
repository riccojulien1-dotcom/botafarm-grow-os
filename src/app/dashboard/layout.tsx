import { AppShell } from "@/components/layout/app-shell";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { isBotafarmAdmin } from "@/lib/auth/admin";
import { requireUser } from "@/lib/auth/get-user";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const showAdminLink = isBotafarmAdmin(user);

  return (
    <AppShell user={user}>
      <DashboardNav showAdminLink={showAdminLink} />
      {children}
    </AppShell>
  );
}
