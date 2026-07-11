"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatManilaDateTime } from "@/lib/date-time";
import { requirementToAccountabilityMap } from "@/data/accountabilities";
import type {
  AccountabilityAssessment,
  AccountabilityAssessmentValue,
  RequirementWithMonitoring,
} from "@/types/pbb";

type AccountabilityChecklistProps = {
  accountabilities: AccountabilityAssessment[];
  requirements: RequirementWithMonitoring[];
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
};

export function AccountabilityChecklist({
  accountabilities,
  requirements,
  disabled,
  onRequestUpdater,
  onUpdated,
}: AccountabilityChecklistProps) {
  const [items, setItems] = useState(accountabilities);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(accountabilities);
  }, [accountabilities]);

  const hasNeedsAttention = items.some(
    (item) => item.isApplicable && item.assessment === "needs-attention",
  );

  const saveItem = useCallback(
    (item: AccountabilityAssessment) => {
      onRequestUpdater(async (updaterName) => {
        setSavingId(item.accountabilityId);
        try {
          const response = await fetch(
            `/api/accountabilities/${item.accountabilityId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                assessment: item.assessment,
                notes: item.notes,
                isApplicable: item.isApplicable,
                updatedBy: updaterName,
                expectedVersion: item.version,
              }),
            },
          );

          if (response.status === 409) {
            toast.error(
              "This assessment was updated by another user. The latest information has been loaded. Review it before saving again.",
            );
            onUpdated();
            return;
          }

          if (!response.ok) {
            throw new Error("Save failed");
          }

          toast.success("Accountability assessment saved.");
          onUpdated();
        } catch {
          toast.error("Unable to save accountability assessment.");
        } finally {
          setSavingId(null);
        }
      });
    },
    [onRequestUpdater, onUpdated],
  );

  const applySubmissionReference = (item: AccountabilityAssessment) => {
    const linkedRequirementId = Object.entries(requirementToAccountabilityMap).find(
      ([, accountabilityId]) => accountabilityId === item.accountabilityId,
    )?.[0];
    const linkedRequirement = requirements.find((req) => req.id === linkedRequirementId);

    if (!linkedRequirement) {
      toast.message("No linked submission requirement for this accountability item.");
      return;
    }

    const nextNotes = linkedRequirement.submitted
      ? "Documents marked submitted; compliance not yet assessed."
      : "Linked submission requirement is still pending; compliance not yet assessed.";

    setItems((current) =>
      current.map((entry) =>
        entry.accountabilityId === item.accountabilityId
          ? { ...entry, notes: nextNotes }
          : entry,
      ),
    );
  };

  return (
    <section className="glass-card no-print rounded-3xl p-5 md:p-6">
      <h2 className="text-xl font-semibold text-navy dark:text-white">
        Agency Accountabilities Compliance Review
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Assess compliance separately from documentary submission status. Use submission status
        only as an initial reference.
      </p>

      {hasNeedsAttention && (
        <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
          Non-compliance with an applicable agency accountability may affect the eligibility
          of the responsible units or individuals.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.accountabilityId}
            className="rounded-3xl border border-white/60 bg-white/50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-semibold text-navy dark:text-white">{item.title}</h3>
                {item.accountabilityId === "national-competition-policy" && (
                  <div className="mt-2 flex items-center gap-3">
                    <Label htmlFor={`applicable-${item.accountabilityId}`}>Applicable</Label>
                    <Switch
                      id={`applicable-${item.accountabilityId}`}
                      checked={item.isApplicable}
                      onCheckedChange={(checked) =>
                        setItems((current) =>
                          current.map((entry) =>
                            entry.accountabilityId === item.accountabilityId
                              ? { ...entry, isApplicable: checked }
                              : entry,
                          ),
                        )
                      }
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>
              <Select
                value={item.assessment}
                onValueChange={(value: AccountabilityAssessmentValue) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.accountabilityId === item.accountabilityId
                        ? { ...entry, assessment: value }
                        : entry,
                    ),
                  )
                }
                disabled={disabled || !item.isApplicable}
              >
                <SelectTrigger className="md:w-56" aria-label={`Assessment for ${item.title}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  <SelectItem value="not-assessed">Not Yet Assessed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3 space-y-2">
              <Label htmlFor={`notes-${item.accountabilityId}`}>Notes</Label>
              <Textarea
                id={`notes-${item.accountabilityId}`}
                value={item.notes}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.accountabilityId === item.accountabilityId
                        ? { ...entry, notes: event.target.value.slice(0, 1000) }
                        : entry,
                    ),
                  )
                }
                disabled={disabled || !item.isApplicable}
                rows={3}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => applySubmissionReference(item)}
                disabled={disabled || !item.isApplicable}
              >
                Use Submission Status as Initial Reference
              </Button>
              <Button
                size="sm"
                onClick={() => saveItem(item)}
                disabled={disabled || !item.isApplicable || savingId === item.accountabilityId}
              >
                {savingId === item.accountabilityId ? "Saving…" : "Save Assessment"}
              </Button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Updated by {item.updatedBy ?? "—"} on {formatManilaDateTime(item.updatedAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
