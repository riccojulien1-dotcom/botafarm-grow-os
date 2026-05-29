import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { DashboardRecentActivity } from "@/components/dashboard/dashboard-recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireUser } from "@/lib/auth/get-user";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";

function formatMetric(value: number | null, suffix = "") {
  if (value === null) {
    return "—";
  }
  return `${value}${suffix}`;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Global dashboard</h1>
        <p className="text-sm text-zinc-400">
          Your grow operation at a glance — rooms, plants, and latest journal signals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total grow rooms"
          value={String(data.totalGrowRooms)}
          helpText="Rooms you currently manage"
        />
        <StatCard
          label="Total plant count"
          value={String(data.totalPlantCount)}
          helpText="Summed across all rooms"
        />
        <StatCard
          label="Total journal logs"
          value={String(data.totalJournalLogs)}
          helpText="All daily entries recorded"
        />
        <StatCard
          label="Latest log date"
          value={data.latestLogDate ?? "—"}
          helpText="Most recent journal entry"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Latest temperature"
          value={formatMetric(data.latestTemperature, " °C")}
          helpText="From your latest log"
        />
        <StatCard
          label="Latest humidity"
          value={formatMetric(data.latestHumidity, " %")}
          helpText="From your latest log"
        />
        <StatCard
          label="Latest EC"
          value={formatMetric(data.latestEc)}
          helpText="From your latest log"
        />
        <StatCard
          label="Latest pH"
          value={formatMetric(data.latestPh)}
          helpText="From your latest log"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardRecentActivity
          latestRoom={data.latestRoom}
          recentLogs={data.recentLogs}
        />
        <DashboardQuickActions latestActiveRoomId={data.latestActiveRoomId} />
      </div>
    </section>
  );
}
