import { APP_VERSION } from "@/types/pbb";

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-card no-print rounded-3xl p-5 text-center text-sm text-slate-600 dark:text-slate-300 md:p-6">
      <p className="font-semibold text-navy dark:text-white">Partido State University</p>
      <p>FY 2024 PBB Dashboard</p>
      <p className="mt-2">For internal monitoring and documentary consolidation</p>
      <p className="mt-3">
        Version {APP_VERSION} · {year}
      </p>
      <p className="mx-auto mt-2 max-w-3xl">
        Monitoring data is synchronized. All users viewing this dashboard see the same submission
        statuses, remarks, and progress calculations.
      </p>
      <p className="mx-auto mt-4 max-w-3xl rounded-2xl border border-white/60 bg-white/50 p-4 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-900/40">
        Changes are shared with all dashboard users. Do not enter confidential, personal, or
        sensitive information in the remarks.
      </p>
      <div className="mt-5 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
        <p>Office of the Vice President for Executive Operations and Institutional Development</p>
        <p>Institutional Planning and Development Office</p>
      </div>
    </footer>
  );
}
