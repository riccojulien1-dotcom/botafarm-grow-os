import { AppShell } from "@/components/layout/app-shell";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { requireUser } from "@/lib/auth/get-user";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <AppShell user={user}>
      <DashboardNav />
      {children}
    </AppShell>
  );
}
