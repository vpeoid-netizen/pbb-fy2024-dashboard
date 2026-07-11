import { sql } from "@/lib/db";
import {
  fetchDashboardData,
  fetchRequirementsWithMonitoring,
  fetchSubmittedCount,
} from "@/lib/dashboard-queries";
import { calculateSummary } from "@/lib/eligibility";
import { TOTAL_REQUIREMENTS } from "@/data/pbbRequirements";
import type { LateReportorialSubmission, RequirementWithMonitoring } from "@/types/pbb";

type UpdateRequirementInput = {
  requirementId: string;
  submitted?: boolean;
  remarks?: string;
  updatedBy: string;
  browserSessionId?: string;
  expectedVersion: number;
};

export async function updateRequirementMonitoring(
  input: UpdateRequirementInput,
): Promise<
  | { success: true; requirement: RequirementWithMonitoring; summary: ReturnType<typeof calculateSummary> }
  | { success: false; conflict: true }
  | { success: false; conflict: false; error: string }
> {
  const existingRows = (await sql`
    SELECT submitted, remarks, version
    FROM requirement_monitoring
    WHERE requirement_id = ${input.requirementId}
  `) as { submitted: boolean; remarks: string; version: number }[];

  if (!existingRows[0]) {
    return { success: false, conflict: false, error: "Requirement not found." };
  }

  const existing = existingRows[0];
  const nextSubmitted = input.submitted ?? existing.submitted;
  const nextRemarks = input.remarks ?? existing.remarks;

  const updatedRows = (await sql`
    UPDATE requirement_monitoring
    SET
      submitted = ${nextSubmitted},
      remarks = ${nextRemarks},
      updated_by = ${input.updatedBy},
      submitted_at = CASE
        WHEN ${nextSubmitted} = TRUE AND submitted = FALSE THEN NOW()
        WHEN ${nextSubmitted} = FALSE THEN NULL
        ELSE submitted_at
      END,
      updated_at = NOW(),
      version = version + 1
    WHERE requirement_id = ${input.requirementId}
      AND version = ${input.expectedVersion}
    RETURNING *
  `) as {
    requirement_id: string;
    submitted: boolean;
    remarks: string;
    submitted_at: string | null;
    updated_at: string;
    updated_by: string | null;
    version: number;
  }[];

  if (!updatedRows[0]) {
    return { success: false, conflict: true };
  }

  const updated = updatedRows[0];

  let action: string;
  if (input.submitted !== undefined && input.submitted !== existing.submitted) {
    action = input.submitted
      ? "submission_marked_complete"
      : "submission_marked_pending";
  } else {
    action = "remarks_updated";
  }

  await sql`
    INSERT INTO monitoring_audit_log (
      requirement_id,
      action,
      previous_submitted,
      new_submitted,
      previous_remarks,
      new_remarks,
      updated_by,
      browser_session_id
    ) VALUES (
      ${input.requirementId},
      ${action},
      ${existing.submitted},
      ${updated.submitted},
      ${existing.remarks},
      ${updated.remarks},
      ${input.updatedBy},
      ${input.browserSessionId ?? null}
    )
  `;

  const requirements = await fetchRequirementsWithMonitoring();
  const requirement = requirements.find((r) => r.id === input.requirementId);

  if (!requirement) {
    return { success: false, conflict: false, error: "Requirement not found." };
  }

  const submittedCount = await fetchSubmittedCount();
  const summary = calculateSummary(submittedCount, requirements.length || TOTAL_REQUIREMENTS);

  return { success: true, requirement, summary };
}

type UpdateEligibilityInput = {
  totalPerformanceIndicators: number | null;
  performanceIndicatorsMet: number | null;
  processImprovementPercent: number | null;
  processNominatedService: string;
  processServiceProvider: string;
  disbursementBurPercent: number | null;
  hotlineTicketCount: number | null;
  hotlineResolutionRate: number | null;
  hotlineNoComplaints: boolean;
  ccbTicketCount: number | null;
  ccbResolutionRate: number | null;
  ccbNoComplaints: boolean;
  allReportsSubmittedOnTime: boolean;
  lateReportorialSubmissions: LateReportorialSubmission[];
  performanceRemarks: string;
  processRemarks: string;
  financialRemarks: string;
  hotlineRemarks: string;
  ccbRemarks: string;
  updatedBy: string;
  expectedVersion: number;
};

export async function updateEligibilityAssessment(
  input: UpdateEligibilityInput,
): Promise<{ success: true } | { success: false; conflict: true } | { success: false; conflict: false }> {
  const updatedRows = (await sql`
    UPDATE eligibility_assessment
    SET
      total_performance_indicators = ${input.totalPerformanceIndicators},
      performance_indicators_met = ${input.performanceIndicatorsMet},
      process_improvement_percent = ${input.processImprovementPercent},
      process_nominated_service = ${input.processNominatedService},
      process_service_provider = ${input.processServiceProvider},
      disbursement_bur_percent = ${input.disbursementBurPercent},
      hotline_ticket_count = ${input.hotlineTicketCount},
      hotline_resolution_rate = ${input.hotlineResolutionRate},
      hotline_no_complaints = ${input.hotlineNoComplaints},
      ccb_ticket_count = ${input.ccbTicketCount},
      ccb_resolution_rate = ${input.ccbResolutionRate},
      ccb_no_complaints = ${input.ccbNoComplaints},
      all_reports_submitted_on_time = ${input.allReportsSubmittedOnTime},
      late_reportorial_submissions = ${JSON.stringify(input.lateReportorialSubmissions)}::jsonb,
      performance_remarks = ${input.performanceRemarks},
      process_remarks = ${input.processRemarks},
      financial_remarks = ${input.financialRemarks},
      hotline_remarks = ${input.hotlineRemarks},
      ccb_remarks = ${input.ccbRemarks},
      updated_by = ${input.updatedBy},
      updated_at = NOW(),
      version = version + 1
    WHERE id = 1 AND version = ${input.expectedVersion}
    RETURNING id
  `) as { id: number }[];

  if (!updatedRows[0]) {
    return { success: false, conflict: true };
  }

  await sql`
    INSERT INTO monitoring_audit_log (
      action,
      updated_by,
      metadata
    ) VALUES (
      'eligibility_updated',
      ${input.updatedBy},
      ${JSON.stringify({ version: input.expectedVersion + 1 })}::jsonb
    )
  `;

  return { success: true };
}

type UpdateAccountabilityInput = {
  accountabilityId: string;
  assessment: "compliant" | "needs-attention" | "not-assessed";
  notes: string;
  isApplicable: boolean;
  updatedBy: string;
  expectedVersion: number;
};

export async function updateAccountabilityAssessment(
  input: UpdateAccountabilityInput,
): Promise<{ success: true } | { success: false; conflict: true } | { success: false; conflict: false }> {
  const updatedRows = (await sql`
    UPDATE accountability_assessments
    SET
      assessment = ${input.assessment},
      notes = ${input.notes},
      is_applicable = ${input.isApplicable},
      updated_by = ${input.updatedBy},
      updated_at = NOW(),
      version = version + 1
    WHERE accountability_id = ${input.accountabilityId}
      AND version = ${input.expectedVersion}
    RETURNING accountability_id
  `) as { accountability_id: string }[];

  if (!updatedRows[0]) {
    return { success: false, conflict: true };
  }

  await sql`
    INSERT INTO monitoring_audit_log (
      action,
      updated_by,
      metadata
    ) VALUES (
      'accountability_updated',
      ${input.updatedBy},
      ${JSON.stringify({
        accountabilityId: input.accountabilityId,
        assessment: input.assessment,
      })}::jsonb
    )
  `;

  return { success: true };
}

export { fetchDashboardData };
