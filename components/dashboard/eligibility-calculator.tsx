"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { formatManilaDateTime } from "@/lib/date-time";
import type { EligibilityAssessment, EligibilityResult } from "@/types/pbb";

type EligibilityCalculatorProps = {
  assessment: EligibilityAssessment;
  result: EligibilityResult;
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
};

export function EligibilityCalculator({
  assessment,
  result,
  disabled,
  onRequestUpdater,
  onUpdated,
}: EligibilityCalculatorProps) {
  const [form, setForm] = useState(assessment);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(assessment);
  }, [assessment]);

  const updateField = <K extends keyof EligibilityAssessment>(
    key: K,
    value: EligibilityAssessment[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = useCallback(() => {
    onRequestUpdater(async (updaterName) => {
      setIsSaving(true);
      try {
        const response = await fetch("/api/eligibility", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            updatedBy: updaterName,
            expectedVersion: assessment.version,
          }),
        });

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

        toast.success("Eligibility assessment saved.");
        onUpdated();
      } catch {
        toast.error("Unable to save eligibility assessment.");
      } finally {
        setIsSaving(false);
      }
    });
  }, [assessment.version, form, onRequestUpdater, onUpdated]);

  const statusClass =
    result.status === "Indicatively Eligible"
      ? result.hasIsolationRisk
        ? "text-warning"
        : "text-success"
      : "text-danger";

  return (
    <section className="glass-card no-print rounded-3xl p-5 md:p-6">
      <h2 className="text-xl font-semibold text-navy dark:text-white">
        Indicative Self-Rating of FY 2024 PBB Eligibility
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        This self-rating is for internal planning and monitoring only. Final eligibility,
        exclusions, validation results, and applicable PBB rates remain subject to the
        official Final Eligibility Assessment.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="total-indicators">Total applicable FY 2024 performance indicators</Label>
              <Input
                id="total-indicators"
                type="number"
                min={1}
                value={form.totalPerformanceIndicators ?? ""}
                onChange={(event) =>
                  updateField(
                    "totalPerformanceIndicators",
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="indicators-met">Number of indicators fully met</Label>
              <Input
                id="indicators-met"
                type="number"
                min={0}
                value={form.performanceIndicatorsMet ?? ""}
                onChange={(event) =>
                  updateField(
                    "performanceIndicatorsMet",
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                disabled={disabled}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="process-improvement">
              Percentage improvement in nominated critical service
            </Label>
            <Input
              id="process-improvement"
              type="number"
              min={0}
              step="0.01"
              value={form.processImprovementPercent ?? ""}
              onChange={(event) =>
                updateField(
                  "processImprovementPercent",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              disabled={disabled}
            />
          </div>

          <div>
            <Label htmlFor="bur-percent">FY 2024 Disbursement BUR percentage</Label>
            <Input
              id="bur-percent"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={form.disbursementBurPercent ?? ""}
              onChange={(event) =>
                updateField(
                  "disbursementBurPercent",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              disabled={disabled}
            />
          </div>

          <fieldset className="space-y-3 rounded-2xl border border-white/60 p-4 dark:border-slate-700">
            <legend className="px-1 text-sm font-semibold">Hotline #8888</legend>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="hotline-no-complaints">No complaints received</Label>
              <Switch
                id="hotline-no-complaints"
                checked={form.hotlineNoComplaints}
                onCheckedChange={(checked) => updateField("hotlineNoComplaints", checked)}
                disabled={disabled}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="hotline-tickets">Number of applicable tickets</Label>
                <Input
                  id="hotline-tickets"
                  type="number"
                  min={0}
                  value={form.hotlineTicketCount ?? ""}
                  onChange={(event) =>
                    updateField(
                      "hotlineTicketCount",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  disabled={disabled || form.hotlineNoComplaints}
                />
              </div>
              <div>
                <Label htmlFor="hotline-rate">Resolution and compliance rate (%)</Label>
                <Input
                  id="hotline-rate"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={form.hotlineResolutionRate ?? ""}
                  onChange={(event) =>
                    updateField(
                      "hotlineResolutionRate",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  disabled={disabled || form.hotlineNoComplaints}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border border-white/60 p-4 dark:border-slate-700">
            <legend className="px-1 text-sm font-semibold">Contact Center ng Bayan</legend>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="ccb-no-complaints">No complaints received</Label>
              <Switch
                id="ccb-no-complaints"
                checked={form.ccbNoComplaints}
                onCheckedChange={(checked) => updateField("ccbNoComplaints", checked)}
                disabled={disabled}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="ccb-tickets">Number of applicable tickets</Label>
                <Input
                  id="ccb-tickets"
                  type="number"
                  min={0}
                  value={form.ccbTicketCount ?? ""}
                  onChange={(event) =>
                    updateField(
                      "ccbTicketCount",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  disabled={disabled || form.ccbNoComplaints}
                />
              </div>
              <div>
                <Label htmlFor="ccb-rate">Resolution and compliance rate (%)</Label>
                <Input
                  id="ccb-rate"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={form.ccbResolutionRate ?? ""}
                  onChange={(event) =>
                    updateField(
                      "ccbResolutionRate",
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  disabled={disabled || form.ccbNoComplaints}
                />
              </div>
            </div>
          </fieldset>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/60 p-4 dark:border-slate-700">
            <Label htmlFor="reports-on-time">
              All reportorial requirements were submitted on time
            </Label>
            <Switch
              id="reports-on-time"
              checked={form.allReportsSubmittedOnTime}
              onCheckedChange={(checked) =>
                updateField("allReportsSubmittedOnTime", checked)
              }
              disabled={disabled}
            />
          </div>

          <Button onClick={save} disabled={disabled || isSaving}>
            {isSaving ? "Saving…" : "Save Eligibility Assessment"}
          </Button>
          <p className="text-xs text-slate-500">
            Last updated by {assessment.updatedBy ?? "—"} on{" "}
            {formatManilaDateTime(assessment.updatedAt)}
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/60 bg-white/50 p-5 dark:border-slate-700 dark:bg-slate-900/40">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Total score</p>
            <p className="text-3xl font-bold text-navy dark:text-white">
              {result.totalScore.toFixed(1)} / {result.maxScore}
            </p>
            <p className={`mt-1 text-sm font-semibold ${statusClass}`}>{result.status}</p>
          </div>
          <Progress value={result.totalScore} aria-label="Eligibility score progress" />

          <ul className="space-y-2 text-sm">
            {result.criteria.map((criterion) => (
              <li
                key={criterion.name}
                className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 dark:bg-slate-900/60"
              >
                <span>{criterion.name}</span>
                <span>
                  Rating {criterion.rating} · {criterion.points.toFixed(1)} /{" "}
                  {criterion.maxPoints} pts
                </span>
              </li>
            ))}
          </ul>

          {result.hasIsolationRisk && (
            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
              <p>
                The estimated agency score may meet the 70-point threshold; however, one or
                more criteria have a rating below 4. Units, heads, or individuals most
                responsible for those criteria may be identified for isolation or exclusion,
                subject to official assessment.
              </p>
              <ul className="mt-2 list-disc pl-5">
                {result.isolationRiskCriteria.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {result.basePbbRatePercentOfMbs !== null && (
            <div className="space-y-1 text-sm">
              <p>
                Estimated base PBB rate (indicative):{" "}
                <strong>{result.basePbbRatePercentOfMbs.toFixed(2)}%</strong> of MBS
              </p>
              {!form.allReportsSubmittedOnTime && result.adjustedPbbRatePercentOfMbs !== null && (
                <p>
                  Estimated adjusted rate after possible late-submission reduction
                  (indicative):{" "}
                  <strong>{result.adjustedPbbRatePercentOfMbs.toFixed(2)}%</strong> of MBS
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
