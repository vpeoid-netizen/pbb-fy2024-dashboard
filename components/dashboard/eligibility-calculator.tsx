"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { reportorialRequirements } from "@/data/reportorialRequirements";
import { formatManilaDateTime } from "@/lib/date-time";
import type {
  EligibilityAssessment,
  EligibilityResult,
  LateReportorialSubmission,
} from "@/types/pbb";

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

  const updateLateSubmission = (
    requirementId: string,
    patch: Partial<LateReportorialSubmission>,
  ) => {
    setForm((current) => ({
      ...current,
      lateReportorialSubmissions: current.lateReportorialSubmissions.map((entry) =>
        entry.requirementId === requirementId ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  const toggleLateRequirement = (requirementId: string, isLate: boolean) => {
    setForm((current) => {
      if (isLate) {
        if (current.lateReportorialSubmissions.some((entry) => entry.requirementId === requirementId)) {
          return current;
        }
        return {
          ...current,
          lateReportorialSubmissions: [
            ...current.lateReportorialSubmissions,
            { requirementId, actualSubmissionDate: "", reason: "" },
          ],
        };
      }

      return {
        ...current,
        lateReportorialSubmissions: current.lateReportorialSubmissions.filter(
          (entry) => entry.requirementId !== requirementId,
        ),
      };
    });
  };

  const save = useCallback(() => {
    onRequestUpdater(async (updaterName) => {
      setIsSaving(true);
      try {
        const payload = {
          totalPerformanceIndicators: form.totalPerformanceIndicators,
          performanceIndicatorsMet: form.performanceIndicatorsMet,
          processImprovementPercent: form.processImprovementPercent,
          disbursementBurPercent: form.disbursementBurPercent,
          hotlineTicketCount: form.hotlineTicketCount,
          hotlineResolutionRate: form.hotlineResolutionRate,
          hotlineNoComplaints: form.hotlineNoComplaints,
          ccbTicketCount: form.ccbTicketCount,
          ccbResolutionRate: form.ccbResolutionRate,
          ccbNoComplaints: form.ccbNoComplaints,
          allReportsSubmittedOnTime: form.allReportsSubmittedOnTime,
          lateReportorialSubmissions: form.allReportsSubmittedOnTime
            ? []
            : form.lateReportorialSubmissions,
          updatedBy: updaterName,
          expectedVersion: assessment.version,
        };

        const response = await fetch("/api/eligibility", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as { error?: string };

        if (response.status === 409) {
          toast.error(
            data.error ??
              "This assessment was updated by another user. The latest information has been loaded. Review it before saving again.",
          );
          onUpdated();
          return;
        }

        if (!response.ok) {
          toast.error(data.error ?? "Unable to save eligibility assessment.");
          return;
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
    result.status === "Not Yet Assessed"
      ? "text-slate-600 dark:text-slate-300"
      : result.status === "Indicatively Eligible"
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
          <fieldset className="space-y-3 rounded-2xl border-2 border-royal-blue/25 bg-royal-blue/5 p-4">
            <legend className="px-1 text-sm font-semibold text-navy dark:text-white">
              Performance Results
            </legend>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Rate accomplishment of applicable FY 2024 performance indicators.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="total-indicators">
                  Total applicable FY 2024 performance indicators
                </Label>
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
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border-2 border-royal-blue/25 bg-royal-blue/5 p-4">
            <legend className="px-1 text-sm font-semibold text-navy dark:text-white">
              Process Results
            </legend>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Rate improvement in the nominated critical service under the Citizen&apos;s Charter.
            </p>
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
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border-2 border-royal-blue/25 bg-royal-blue/5 p-4">
            <legend className="px-1 text-sm font-semibold text-navy dark:text-white">
              Financial Results
            </legend>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Rate FY 2024 Disbursement Budget Utilization (BUR) performance.
            </p>
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
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border-2 border-royal-blue/25 bg-royal-blue/5 p-4">
            <legend className="px-1 text-sm font-semibold text-navy dark:text-white">
              Citizen/Client Satisfaction Results
            </legend>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Rate complaint resolution and compliance for Hotline #8888 and Contact Center ng
              Bayan.
            </p>

            <div className="space-y-3 rounded-xl border border-white/60 bg-white/50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hotline #8888
              </p>
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
            </div>

            <div className="space-y-3 rounded-xl border border-white/60 bg-white/50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact Center ng Bayan
              </p>
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
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl border border-white/60 p-4 dark:border-slate-700">
            <legend className="px-1 text-sm font-semibold text-navy dark:text-white">
              Reportorial Submission Timeliness
            </legend>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <Label htmlFor="reports-on-time" className="leading-snug">
                All reportorial requirements were submitted on time
              </Label>
              <Switch
                id="reports-on-time"
                checked={form.allReportsSubmittedOnTime}
                onCheckedChange={(checked) => {
                  setForm((current) => ({
                    ...current,
                    allReportsSubmittedOnTime: checked,
                    lateReportorialSubmissions: checked
                      ? []
                      : current.lateReportorialSubmissions,
                  }));
                }}
                disabled={disabled}
              />
            </div>

            {!form.allReportsSubmittedOnTime && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Select each FY 2024 PBB Agency Accountability Timeline requirement that
                  was not submitted on time, then provide the actual submission date and
                  reason or remarks.
                </p>
                {reportorialRequirements.map((requirement) => {
                  const lateEntry = form.lateReportorialSubmissions.find(
                    (entry) => entry.requirementId === requirement.id,
                  );
                  const isLate = Boolean(lateEntry);

                  return (
                    <div
                      key={requirement.id}
                      className="rounded-xl border border-white/60 bg-white/50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-medium text-navy dark:text-white">
                            {requirement.title}
                          </p>
                          <p className="mt-1 break-words text-xs text-slate-500">
                            {requirement.deadline}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Label htmlFor={`late-${requirement.id}`} className="text-xs">
                            Late
                          </Label>
                          <Switch
                            id={`late-${requirement.id}`}
                            checked={isLate}
                            onCheckedChange={(checked) =>
                              toggleLateRequirement(requirement.id, checked)
                            }
                            disabled={disabled}
                          />
                        </div>
                      </div>

                      {isLate && lateEntry && (
                        <div className="mt-4 space-y-3 border-t border-white/60 pt-4 dark:border-slate-700">
                          <div>
                            <Label htmlFor={`late-date-${requirement.id}`}>
                              Date of actual submission
                            </Label>
                            <Input
                              id={`late-date-${requirement.id}`}
                              type="date"
                              value={lateEntry.actualSubmissionDate}
                              onChange={(event) =>
                                updateLateSubmission(requirement.id, {
                                  actualSubmissionDate: event.target.value,
                                })
                              }
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`late-reason-${requirement.id}`}>
                              Reason why / remarks
                            </Label>
                            <Textarea
                              id={`late-reason-${requirement.id}`}
                              value={lateEntry.reason}
                              onChange={(event) =>
                                updateLateSubmission(requirement.id, {
                                  reason: event.target.value.slice(0, 1000),
                                })
                              }
                              placeholder="Explain why the requirement was submitted late."
                              rows={3}
                              disabled={disabled}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </fieldset>

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
              {result.totalScore.toFixed(2)} / {result.maxScore.toFixed(2)}
            </p>
            <p className={`mt-1 text-sm font-semibold ${statusClass}`}>{result.status}</p>
            {!result.hasInputs && (
              <p className="mt-1 text-xs text-slate-500">
                Enter self-rating inputs to calculate an indicative score.
              </p>
            )}
          </div>
          <Progress value={result.totalScore} aria-label="Eligibility score progress" />

          <ul className="space-y-2 text-sm">
            {result.criteria.map((criterion) => (
              <li
                key={criterion.name}
                className="flex flex-col gap-1 rounded-xl bg-white/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-900/60"
              >
                <span className="min-w-0 break-words">{criterion.name}</span>
                <span className="shrink-0 whitespace-nowrap">
                  {criterion.rating > 0
                    ? `Rating ${criterion.rating} · ${criterion.points.toFixed(2)} / ${criterion.maxPoints.toFixed(2)} pts`
                    : `Not yet assessed · 0.00 / ${criterion.maxPoints.toFixed(2)} pts`}
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
