import { sql } from "@/lib/db";
import { calculateEligibilityResult, calculateSummary } from "@/lib/eligibility";
import { toIsoString } from "@/lib/date-time";
import { TOTAL_REQUIREMENTS } from "@/data/pbbRequirements";
import type {
  AccountabilityAssessment,
  AuditEntry,
  DashboardData,
  EligibilityAssessment,
  LateReportorialSubmission,
  RequirementWithMonitoring,
} from "@/types/pbb";

type LateReportorialSubmissionRow = {
  requirementId: string;
  actualSubmissionDate: string;
  reason: string;
};

type RequirementRow = {
  id: string;
  category: string;
  title: string;
  short_title: string | null;
  description: string;
  documents: string[];
  folder_url: string;
  validating_agency: string;
  deadline: string;
  keywords: string[];
  display_order: number;
  submitted: boolean;
  remarks: string;
  submitted_at: string | null;
  monitoring_updated_at: string;
  updated_by: string | null;
  version: number;
};

type EligibilityRow = {
  total_performance_indicators: number | null;
  performance_indicators_met: number | null;
  process_improvement_percent: string | null;
  process_nominated_service: string | null;
  process_service_provider: string | null;
  disbursement_bur_percent: string | null;
  hotline_ticket_count: number | null;
  hotline_resolution_rate: string | null;
  hotline_no_complaints: boolean;
  ccb_ticket_count: number | null;
  ccb_resolution_rate: string | null;
  ccb_no_complaints: boolean;
  all_reports_submitted_on_time: boolean;
  late_reportorial_submissions: LateReportorialSubmissionRow[] | null;
  performance_remarks: string | null;
  process_remarks: string | null;
  financial_remarks: string | null;
  citizen_satisfaction_remarks: string | null;
  reportorial_remarks: string | null;
  updated_by: string | null;
  updated_at: string;
  version: number;
};

type AccountabilityRow = {
  accountability_id: string;
  title: string;
  assessment: "compliant" | "needs-attention" | "not-assessed";
  notes: string;
  is_applicable: boolean;
  updated_by: string | null;
  updated_at: string;
  version: number;
};

type AuditRow = {
  id: number;
  requirement_id: string | null;
  requirement_title: string | null;
  action: string;
  previous_submitted: boolean | null;
  new_submitted: boolean | null;
  previous_remarks: string | null;
  new_remarks: string | null;
  updated_by: string | null;
  created_at: string;
};

function mapRequirement(row: RequirementRow): RequirementWithMonitoring {
  return {
    id: row.id,
    category: row.category as RequirementWithMonitoring["category"],
    title: row.title,
    shortTitle: row.short_title ?? row.title,
    description: row.description,
    documents: Array.isArray(row.documents) ? row.documents : [],
    folderUrl: row.folder_url,
    validatingAgency: row.validating_agency,
    deadline: row.deadline,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    displayOrder: row.display_order,
    requirementId: row.id,
    submitted: row.submitted,
    remarks: row.remarks,
    submittedAt: toIsoString(row.submitted_at),
    updatedAt: toIsoString(row.monitoring_updated_at) ?? new Date().toISOString(),
    updatedBy: row.updated_by,
    version: row.version,
  };
}

function mapLateSubmissions(value: unknown): LateReportorialSubmission[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is LateReportorialSubmissionRow =>
        typeof item === "object" &&
        item !== null &&
        "requirementId" in item &&
        "actualSubmissionDate" in item &&
        "reason" in item,
    )
    .map((item) => ({
      requirementId: item.requirementId,
      actualSubmissionDate: item.actualSubmissionDate,
      reason: item.reason,
    }));
}

function mapEligibility(row: EligibilityRow): EligibilityAssessment {
  return {
    totalPerformanceIndicators: row.total_performance_indicators,
    performanceIndicatorsMet: row.performance_indicators_met,
    processImprovementPercent:
      row.process_improvement_percent !== null
        ? Number(row.process_improvement_percent)
        : null,
    processNominatedService: row.process_nominated_service ?? "",
    processServiceProvider: row.process_service_provider ?? "",
    disbursementBurPercent:
      row.disbursement_bur_percent !== null
        ? Number(row.disbursement_bur_percent)
        : null,
    hotlineTicketCount: row.hotline_ticket_count,
    hotlineResolutionRate:
      row.hotline_resolution_rate !== null
        ? Number(row.hotline_resolution_rate)
        : null,
    hotlineNoComplaints: row.hotline_no_complaints,
    ccbTicketCount: row.ccb_ticket_count,
    ccbResolutionRate:
      row.ccb_resolution_rate !== null ? Number(row.ccb_resolution_rate) : null,
    ccbNoComplaints: row.ccb_no_complaints,
    allReportsSubmittedOnTime: row.all_reports_submitted_on_time,
    lateReportorialSubmissions: mapLateSubmissions(row.late_reportorial_submissions),
    performanceRemarks: row.performance_remarks ?? "",
    processRemarks: row.process_remarks ?? "",
    financialRemarks: row.financial_remarks ?? "",
    citizenSatisfactionRemarks: row.citizen_satisfaction_remarks ?? "",
    reportorialRemarks: row.reportorial_remarks ?? "",
    updatedBy: row.updated_by,
    updatedAt: toIsoString(row.updated_at) ?? new Date().toISOString(),
    version: row.version,
  };
}

function mapAccountability(row: AccountabilityRow): AccountabilityAssessment {
  return {
    accountabilityId: row.accountability_id,
    title: row.title,
    assessment: row.assessment,
    notes: row.notes,
    isApplicable: row.is_applicable,
    updatedBy: row.updated_by,
    updatedAt: toIsoString(row.updated_at) ?? new Date().toISOString(),
    version: row.version,
  };
}

function mapAudit(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    requirementId: row.requirement_id,
    requirementTitle: row.requirement_title,
    action: row.action as AuditEntry["action"],
    previousSubmitted: row.previous_submitted,
    newSubmitted: row.new_submitted,
    previousRemarks: row.previous_remarks,
    newRemarks: row.new_remarks,
    updatedBy: row.updated_by,
    createdAt: toIsoString(row.created_at) ?? new Date().toISOString(),
  };
}

export async function fetchRequirementsWithMonitoring(): Promise<
  RequirementWithMonitoring[]
> {
  const rows = (await sql`
    SELECT
      r.id,
      r.category,
      r.title,
      r.short_title,
      r.description,
      r.documents,
      r.folder_url,
      r.validating_agency,
      r.deadline,
      r.keywords,
      r.display_order,
      COALESCE(m.submitted, FALSE) AS submitted,
      COALESCE(m.remarks, '') AS remarks,
      m.submitted_at,
      COALESCE(m.updated_at, NOW()) AS monitoring_updated_at,
      m.updated_by,
      COALESCE(m.version, 1) AS version
    FROM pbb_requirements r
    LEFT JOIN requirement_monitoring m ON m.requirement_id = r.id
    WHERE r.is_active = TRUE
    ORDER BY r.display_order ASC
  `) as RequirementRow[];

  return rows.map(mapRequirement);
}

export async function fetchSubmittedCount(): Promise<number> {
  const result = (await sql`
    SELECT COUNT(*)::int AS count
    FROM requirement_monitoring
    WHERE submitted = TRUE
  `) as { count: number }[];

  return result[0]?.count ?? 0;
}

export async function fetchEligibilityAssessment(): Promise<EligibilityAssessment> {
  const rows = (await sql`
    SELECT *
    FROM eligibility_assessment
    WHERE id = 1
  `) as EligibilityRow[];

  if (!rows[0]) {
    return {
      totalPerformanceIndicators: null,
      performanceIndicatorsMet: null,
      processImprovementPercent: null,
      processNominatedService: "",
      processServiceProvider: "",
      disbursementBurPercent: null,
      hotlineTicketCount: null,
      hotlineResolutionRate: null,
      hotlineNoComplaints: false,
      ccbTicketCount: null,
      ccbResolutionRate: null,
      ccbNoComplaints: false,
      allReportsSubmittedOnTime: true,
      lateReportorialSubmissions: [],
      performanceRemarks: "",
      processRemarks: "",
      financialRemarks: "",
      citizenSatisfactionRemarks: "",
      reportorialRemarks: "",
      updatedBy: null,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
  }

  return mapEligibility(rows[0]);
}

export async function fetchAccountabilities(): Promise<AccountabilityAssessment[]> {
  const rows = (await sql`
    SELECT *
    FROM accountability_assessments
    ORDER BY accountability_id ASC
  `) as AccountabilityRow[];

  return rows.map(mapAccountability);
}

export async function fetchRecentActivity(limit = 10): Promise<AuditEntry[]> {
  const rows = (await sql`
    SELECT
      a.id,
      a.requirement_id,
      r.title AS requirement_title,
      a.action,
      a.previous_submitted,
      a.new_submitted,
      a.previous_remarks,
      a.new_remarks,
      a.updated_by,
      a.created_at
    FROM monitoring_audit_log a
    LEFT JOIN pbb_requirements r ON r.id = a.requirement_id
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `) as AuditRow[];

  return rows.map(mapAudit);
}

export async function fetchRequirementHistory(
  requirementId: string,
  limit = 20,
): Promise<AuditEntry[]> {
  const rows = (await sql`
    SELECT
      a.id,
      a.requirement_id,
      r.title AS requirement_title,
      a.action,
      a.previous_submitted,
      a.new_submitted,
      a.previous_remarks,
      a.new_remarks,
      a.updated_by,
      a.created_at
    FROM monitoring_audit_log a
    LEFT JOIN pbb_requirements r ON r.id = a.requirement_id
    WHERE a.requirement_id = ${requirementId}
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `) as AuditRow[];

  return rows.map(mapAudit);
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [requirements, submittedCount, eligibilityAssessment, accountabilities, recentActivity] =
    await Promise.all([
      fetchRequirementsWithMonitoring(),
      fetchSubmittedCount(),
      fetchEligibilityAssessment(),
      fetchAccountabilities(),
      fetchRecentActivity(5),
    ]);

  const totalCount = requirements.length || TOTAL_REQUIREMENTS;
  const summary = calculateSummary(submittedCount, totalCount);
  const eligibilityResult = calculateEligibilityResult(eligibilityAssessment);

  return {
    requirements,
    summary,
    eligibilityAssessment,
    eligibilityResult,
    accountabilities,
    recentActivity,
    serverTimestamp: new Date().toISOString(),
  };
}

export async function requirementExists(id: string): Promise<boolean> {
  const rows = (await sql`
    SELECT id FROM pbb_requirements WHERE id = ${id} AND is_active = TRUE LIMIT 1
  `) as { id: string }[];

  return rows.length > 0;
}

export async function accountabilityExists(id: string): Promise<boolean> {
  const rows = (await sql`
    SELECT accountability_id FROM accountability_assessments WHERE accountability_id = ${id} LIMIT 1
  `) as { accountability_id: string }[];

  return rows.length > 0;
}
