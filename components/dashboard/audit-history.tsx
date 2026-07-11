"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatManilaDateTime } from "@/lib/date-time";
import { getAuditActionLabel } from "@/lib/utils";
import type { AuditEntry } from "@/types/pbb";

export function AuditHistory({ requirementId }: { requirementId: string }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    fetch(`/api/requirements/${requirementId}/history`)
      .then((response) => response.json())
      .then((data: { history: AuditEntry[] }) => setHistory(data.history))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [open, requirementId]);

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        View Update History
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {open && (
        <div className="mt-3 space-y-2 rounded-2xl border border-white/60 bg-white/40 p-3 dark:border-slate-700 dark:bg-slate-900/30">
          {loading ? (
            <p className="text-sm text-slate-600">Loading history…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-600">No update history yet.</p>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="text-sm">
                <p>
                  <strong>{entry.updatedBy ?? "Unknown user"}</strong>{" "}
                  {getAuditActionLabel(entry.action)} —{" "}
                  {formatManilaDateTime(entry.createdAt)}
                </p>
                {entry.previousSubmitted !== null && entry.newSubmitted !== null && (
                  <p className="text-slate-600 dark:text-slate-300">
                    Status: {entry.previousSubmitted ? "Submitted" : "Pending"} →{" "}
                    {entry.newSubmitted ? "Submitted" : "Pending"}
                  </p>
                )}
                {entry.previousRemarks !== entry.newRemarks && (
                  <p className="text-slate-600 dark:text-slate-300">Remarks updated</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
