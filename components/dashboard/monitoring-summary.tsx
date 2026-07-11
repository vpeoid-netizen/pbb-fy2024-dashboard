"use client";

import { Progress } from "@/components/ui/progress";
import { ConnectionStatusBadge } from "@/components/dashboard/connection-status";
import { formatManilaDateTime } from "@/lib/date-time";
import type { ConnectionStatus, MonitoringSummary } from "@/types/pbb";

type MonitoringSummaryProps = {
  summary: MonitoringSummary;
  serverTimestamp: string;
  connectionStatus: ConnectionStatus;
};

export function MonitoringSummaryCard({
  summary,
  serverTimestamp,
  connectionStatus,
}: MonitoringSummaryProps) {
  const { completionPercentage, submittedRequirements, pendingRequirements, totalRequirements } =
    summary;

  return (
    <section
      className="glass-card no-print rounded-3xl p-5 md:p-6"
      aria-label="Monitoring summary"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-royal-blue/20 bg-white/70 dark:bg-slate-900/70"
            role="img"
            aria-label={`${completionPercentage}% complete`}
          >
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(20,87,217,0.15)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#1457d9"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${completionPercentage * 2.64} 264`}
              />
            </svg>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy dark:text-white">
                {completionPercentage}%
              </div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Complete
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy dark:text-white">
              Central Monitoring Summary
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {submittedRequirements} submitted · {pendingRequirements} pending ·{" "}
              {totalRequirements} total
            </p>
            {completionPercentage === 100 && (
              <p className="mt-2 text-sm font-medium text-success">
                All FY 2024 PBB documentary requirements have been marked as submitted.
              </p>
            )}
          </div>
        </div>

        <div className="min-w-[220px] space-y-3">
          <Progress value={completionPercentage} aria-label="Completion progress" />
          <div className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span>Last synchronized: {formatManilaDateTime(serverTimestamp)}</span>
            <ConnectionStatusBadge status={connectionStatus} />
          </div>
        </div>
      </div>
    </section>
  );
}
