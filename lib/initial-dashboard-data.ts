import { pbbRequirements, TOTAL_REQUIREMENTS } from "@/data/pbbRequirements";
import { calculateEligibilityResult } from "@/lib/eligibility";
import type { DashboardData, EligibilityAssessment } from "@/types/pbb";

const emptyEligibilityAssessment: EligibilityAssessment = {
  totalPerformanceIndicators: null,
  performanceIndicatorsMet: null,
  processImprovementPercent: null,
  disbursementBurPercent: null,
  hotlineTicketCount: null,
  hotlineResolutionRate: null,
  hotlineNoComplaints: false,
  ccbTicketCount: null,
  ccbResolutionRate: null,
  ccbNoComplaints: false,
  allReportsSubmittedOnTime: true,
  lateReportorialSubmissions: [],
  updatedBy: null,
  updatedAt: new Date().toISOString(),
  version: 1,
};

export function getInitialDashboardData(): DashboardData {
  const now = new Date().toISOString();

  return {
    requirements: pbbRequirements.map((req) => ({
      ...req,
      requirementId: req.id,
      submitted: false,
      remarks: "",
      submittedAt: null,
      updatedAt: now,
      updatedBy: null,
      version: 1,
    })),
    summary: {
      totalRequirements: TOTAL_REQUIREMENTS,
      submittedRequirements: 0,
      pendingRequirements: TOTAL_REQUIREMENTS,
      completionPercentage: 0,
    },
    eligibilityAssessment: emptyEligibilityAssessment,
    eligibilityResult: calculateEligibilityResult(emptyEligibilityAssessment),
    accountabilities: [],
    recentActivity: [],
    serverTimestamp: now,
  };
}
