export type RequirementCategory =
  | "performance"
  | "process"
  | "financial"
  | "citizen-client"
  | "agency-accountability";

export type PbbRequirementSeed = {
  id: string;
  category: RequirementCategory;
  title: string;
  shortTitle: string;
  description: string;
  documents: string[];
  validatingAgency: string;
  deadline: string;
  folderUrl: string;
  keywords: string[];
  displayOrder: number;
};

export type RequirementMonitoring = {
  requirementId: string;
  submitted: boolean;
  remarks: string;
  submittedAt: string | null;
  updatedAt: string;
  updatedBy: string | null;
  version: number;
};

export type RequirementWithMonitoring = PbbRequirementSeed & RequirementMonitoring;

export type MonitoringSummary = {
  totalRequirements: number;
  submittedRequirements: number;
  pendingRequirements: number;
  completionPercentage: number;
};

export type AuditAction =
  | "submission_marked_complete"
  | "submission_marked_pending"
  | "remarks_updated"
  | "eligibility_updated"
  | "accountability_updated";

export type AuditEntry = {
  id: number;
  requirementId: string | null;
  requirementTitle: string | null;
  action: AuditAction;
  previousSubmitted: boolean | null;
  newSubmitted: boolean | null;
  previousRemarks: string | null;
  newRemarks: string | null;
  updatedBy: string | null;
  createdAt: string;
};

export type LateReportorialSubmission = {
  requirementId: string;
  actualSubmissionDate: string;
  reason: string;
};

export type EligibilityAssessment = {
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
  citizenSatisfactionRemarks: string;
  reportorialRemarks: string;
  updatedBy: string | null;
  updatedAt: string;
  version: number;
};

export type CriterionRating = {
  name: string;
  rating: number;
  points: number;
  maxPoints: number;
};

export type EligibilityResult = {
  criteria: CriterionRating[];
  totalScore: number;
  maxScore: number;
  status: "Indicatively Eligible" | "Below Eligibility Threshold" | "Not Yet Assessed";
  hasInputs: boolean;
  hasIsolationRisk: boolean;
  isolationRiskCriteria: string[];
  basePbbRatePercentOfMbs: number | null;
  adjustedPbbRatePercentOfMbs: number | null;
};

export type AccountabilityAssessmentValue =
  | "compliant"
  | "needs-attention"
  | "not-assessed";

export type AccountabilityAssessment = {
  accountabilityId: string;
  title: string;
  assessment: AccountabilityAssessmentValue;
  notes: string;
  isApplicable: boolean;
  updatedBy: string | null;
  updatedAt: string;
  version: number;
};

export type DashboardData = {
  requirements: RequirementWithMonitoring[];
  summary: MonitoringSummary;
  eligibilityAssessment: EligibilityAssessment;
  eligibilityResult: EligibilityResult;
  accountabilities: AccountabilityAssessment[];
  recentActivity: AuditEntry[];
  serverTimestamp: string;
};

export type ConnectionStatus =
  | "Live"
  | "Updating"
  | "Offline"
  | "Reconnecting"
  | "Synchronization Error";

export type SortOption =
  | "default"
  | "pending-first"
  | "submitted-first"
  | "name"
  | "deadline"
  | "recently-updated";

export type StatusFilter = "all" | "pending" | "submitted";

export type CategoryFilter =
  | "all"
  | "performance"
  | "process"
  | "financial"
  | "citizen-client"
  | "agency-accountability";

export const APP_VERSION = "1.0.0";

export const REPORTING_FORMS = {
  title: "Forms for Reporting",
  url: "https://drive.google.com/drive/folders/1HsZAYJiHKo1XXwnifJKoClHGKeMXVNgc?usp=sharing",
} as const;
