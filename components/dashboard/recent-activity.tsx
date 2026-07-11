"use client";

import { formatManilaDateTime } from "@/lib/date-time";
import { getAuditActionLabel } from "@/lib/utils";
import type { AuditEntry } from "@/types/pbb";

export function RecentActivity({ activity }: { activity: AuditEntry[] }) {
  return (
    <section className="glass-card no-print rounded-3xl p-5 md:p-6">
      <h2 className="text-lg font-semibold text-navy dark:text-white">Recent Activity</h2>
      <ul className="mt-4 space-y-3" aria-live="polite">
        {activity.length === 0 ? (
          <li className="text-sm text-slate-600 dark:text-slate-300">
            No updates recorded yet.
          </li>
        ) : (
          activity.map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/40"
            >
              {entry.action === "eligibility_updated" ? (
                <span>
                  <strong>{entry.updatedBy ?? "A user"}</strong> updated the eligibility
                  assessment — {formatManilaDateTime(entry.createdAt)}.
                </span>
              ) : entry.action === "accountability_updated" ? (
                <span>
                  <strong>{entry.updatedBy ?? "A user"}</strong> updated an accountability
                  assessment — {formatManilaDateTime(entry.createdAt)}.
                </span>
              ) : (
                <span>
                  <strong>{entry.updatedBy ?? "A user"}</strong>{" "}
                  {getAuditActionLabel(entry.action)}{" "}
                  <strong>&ldquo;{entry.requirementTitle ?? "a requirement"}&rdquo;</strong>
                  {entry.action.includes("submission") ? "" : ""} —{" "}
                  {formatManilaDateTime(entry.createdAt)}.
                </span>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
