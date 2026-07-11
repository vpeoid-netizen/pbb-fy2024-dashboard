import { APP_VERSION } from "@/types/pbb";

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-card no-print rounded-3xl p-5 text-sm text-slate-600 dark:text-slate-300 md:p-6">
      <p className="font-semibold text-navy dark:text-white">Partido State University</p>
      <p>FY 2024 PBB Dashboard</p>
      <p className="mt-2">For internal monitoring and documentary consolidation</p>
      <p className="mt-3">
        Version {APP_VERSION} · {year}
      </p>
      <p className="mt-2 max-w-3xl">
        Monitoring data is synchronized from the centralized Neon PostgreSQL database. All
        users viewing this dashboard see the same submission statuses, remarks, and progress
        calculations.
      </p>
    </footer>
  );
}
