"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatManilaDateTime } from "@/lib/date-time";
import { getAuditActionLabel } from "@/lib/utils";
import type { AuditEntry } from "@/types/pbb";

function ActivityList({ activity }: { activity: AuditEntry[] }) {
  if (activity.length === 0) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-300">No updates recorded yet.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {activity.map((entry) => (
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
              <strong>&ldquo;{entry.requirementTitle ?? "a requirement"}&rdquo;</strong> —{" "}
              {formatManilaDateTime(entry.createdAt)}.
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function RecentActivity({ activity }: { activity: AuditEntry[] }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [fullActivity, setFullActivity] = useState<AuditEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const recentActivity = activity.slice(0, 3);

  useEffect(() => {
    if (!historyOpen) {
      return;
    }

    setLoadingHistory(true);
    fetch("/api/activity?limit=100")
      .then((response) => response.json())
      .then((data: { activity: AuditEntry[] }) => setFullActivity(data.activity))
      .catch(() => setFullActivity([]))
      .finally(() => setLoadingHistory(false));
  }, [historyOpen]);

  return (
    <>
      <section className="glass-card no-print rounded-3xl p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-navy dark:text-white">Recent Activity</h2>
          <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
            <History className="h-4 w-4" />
            History
          </Button>
        </div>
        <div className="mt-4" aria-live="polite">
          <ActivityList activity={recentActivity} />
        </div>
      </section>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Activity History</DialogTitle>
            <DialogDescription>
              All recorded dashboard updates from the centralized audit log.
            </DialogDescription>
          </DialogHeader>
          {loadingHistory ? (
            <p className="text-sm text-slate-600">Loading activity history…</p>
          ) : (
            <ActivityList activity={fullActivity} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
