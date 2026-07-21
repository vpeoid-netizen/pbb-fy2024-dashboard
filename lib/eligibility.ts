import type {
  EligibilityAssessment,
  EligibilityResult,
  MonitoringSummary,
} from "@/types/pbb";

export function calculateCompletionPercentage(
  submitted: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((submitted / total) * 100);
}

export function calculateSummary(submittedCount: number, totalCount: number): MonitoringSummary {
  const pendingRequirements = totalCount - submittedCount;
  return {
    totalRequirements: totalCount,
    submittedRequirements: submittedCount,
    pendingRequirements,
    completionPercentage: calculateCompletionPercentage(submittedCount, totalCount),
  };
}

export function hasEligibilityInputs(assessment: EligibilityAssessment): boolean {
  return (
    assessment.totalPerformanceIndicators !== null ||
    assessment.performanceIndicatorsMet !== null ||
    assessment.processImprovementPercent !== null ||
    assessment.disbursementBurPercent !== null ||
    assessment.hotlineNoComplaints ||
    assessment.ccbNoComplaints ||
    assessment.hotlineTicketCount !== null ||
    assessment.hotlineResolutionRate !== null ||
    assessment.ccbTicketCount !== null ||
    assessment.ccbResolutionRate !== null
  );
}

function hasPerformanceInputs(assessment: EligibilityAssessment): boolean {
  return (
    assessment.totalPerformanceIndicators !== null &&
    assessment.performanceIndicatorsMet !== null
  );
}

function hasProcessInputs(assessment: EligibilityAssessment): boolean {
  return assessment.processImprovementPercent !== null;
}

function hasFinancialInputs(assessment: EligibilityAssessment): boolean {
  return assessment.disbursementBurPercent !== null;
}

function hasHotlineInputs(assessment: EligibilityAssessment): boolean {
  return (
    assessment.hotlineNoComplaints ||
    assessment.hotlineTicketCount !== null ||
    assessment.hotlineResolutionRate !== null
  );
}

function hasCcbInputs(assessment: EligibilityAssessment): boolean {
  return (
    assessment.ccbNoComplaints ||
    assessment.ccbTicketCount !== null ||
    assessment.ccbResolutionRate !== null
  );
}

export function calculatePerformanceRating(
  total: number | null,
  met: number | null,
): number {
  if (total === null || met === null || total <= 0) {
    return 1;
  }
  const percentageMet = (met / total) * 100;
  if (percentageMet < 50) return 1;
  if (percentageMet < 70) return 2;
  if (percentageMet < 80) return 3;
  if (percentageMet < 100) return 4;
  return 5;
}

export function calculateProcessRating(percent: number | null): number {
  if (percent === null || percent < 10) return 1;
  if (percent < 15) return 3;
  return 5;
}

export function calculateFinancialRating(percent: number | null): number {
  if (percent === null || percent < 40) return 1;
  if (percent < 55) return 2;
  if (percent < 70) return 3;
  if (percent < 85) return 4;
  return 5;
}

export function calculateComplaintRating(
  ticketCount: number | null,
  resolutionRate: number | null,
  noComplaints: boolean,
): number {
  if (noComplaints) {
    return 5;
  }

  if (resolutionRate === null) {
    return 1;
  }

  if (resolutionRate === 0) {
    return 1;
  }

  if (resolutionRate < 50) {
    return 2;
  }

  const tickets = ticketCount ?? 0;
  const rating4Threshold = tickets > 250 ? 75 : 80;

  if (resolutionRate < rating4Threshold) {
    return 3;
  }

  if (resolutionRate < 100) {
    return 4;
  }

  return 5;
}

export function calculatePbbRate(totalScore: number): number | null {
  if (totalScore < 70) {
    return null;
  }
  const roundedScore = Math.floor(totalScore);
  return roundedScore * 0.65;
}

export function calculateAdjustedPbbRate(
  baseRate: number | null,
  allReportsSubmittedOnTime: boolean,
): number | null {
  if (baseRate === null) {
    return null;
  }
  if (allReportsSubmittedOnTime) {
    return baseRate;
  }
  return baseRate * 0.95;
}

function createEmptyEligibilityResult(): EligibilityResult {
  const baselineRating = 1;
  const criteria = [
    {
      name: "Performance Results",
      rating: baselineRating,
      points: baselineRating * 5,
      maxPoints: 25,
    },
    {
      name: "Process Results",
      rating: baselineRating,
      points: baselineRating * 5,
      maxPoints: 25,
    },
    {
      name: "Financial Results",
      rating: baselineRating,
      points: baselineRating * 5,
      maxPoints: 25,
    },
    {
      name: "Hotline #8888",
      rating: baselineRating,
      points: baselineRating * 2.5,
      maxPoints: 12.5,
    },
    {
      name: "Contact Center ng Bayan",
      rating: baselineRating,
      points: baselineRating * 2.5,
      maxPoints: 12.5,
    },
  ];

  return {
    criteria,
    totalScore: criteria.reduce((sum, item) => sum + item.points, 0),
    maxScore: 100,
    status: "Not Yet Assessed",
    hasInputs: false,
    hasIsolationRisk: false,
    isolationRiskCriteria: [],
    basePbbRatePercentOfMbs: null,
    adjustedPbbRatePercentOfMbs: null,
  };
}

export function calculateEligibilityResult(
  assessment: EligibilityAssessment,
): EligibilityResult {
  if (!hasEligibilityInputs(assessment)) {
    return createEmptyEligibilityResult();
  }

  const performanceAssessed = hasPerformanceInputs(assessment);
  const processAssessed = hasProcessInputs(assessment);
  const financialAssessed = hasFinancialInputs(assessment);
  const hotlineAssessed = hasHotlineInputs(assessment);
  const ccbAssessed = hasCcbInputs(assessment);

  const performanceRating = performanceAssessed
    ? calculatePerformanceRating(
        assessment.totalPerformanceIndicators,
        assessment.performanceIndicatorsMet,
      )
    : 0;
  const processRating = processAssessed
    ? calculateProcessRating(assessment.processImprovementPercent)
    : 0;
  const financialRating = financialAssessed
    ? calculateFinancialRating(assessment.disbursementBurPercent)
    : 0;
  const hotlineRating = hotlineAssessed
    ? calculateComplaintRating(
        assessment.hotlineTicketCount,
        assessment.hotlineResolutionRate,
        assessment.hotlineNoComplaints,
      )
    : 0;
  const ccbRating = ccbAssessed
    ? calculateComplaintRating(
        assessment.ccbTicketCount,
        assessment.ccbResolutionRate,
        assessment.ccbNoComplaints,
      )
    : 0;

  const criteria = [
    {
      name: "Performance Results",
      rating: performanceRating,
      points: performanceRating * 5,
      maxPoints: 25,
    },
    {
      name: "Process Results",
      rating: processRating,
      points: processRating * 5,
      maxPoints: 25,
    },
    {
      name: "Financial Results",
      rating: financialRating,
      points: financialRating * 5,
      maxPoints: 25,
    },
    {
      name: "Hotline #8888",
      rating: hotlineRating,
      points: hotlineRating * 2.5,
      maxPoints: 12.5,
    },
    {
      name: "Contact Center ng Bayan",
      rating: ccbRating,
      points: ccbRating * 2.5,
      maxPoints: 12.5,
    },
  ];

  const totalScore = criteria.reduce((sum, item) => sum + item.points, 0);
  const isolationRiskCriteria = criteria
    .filter((item) => item.rating > 0 && item.rating < 4)
    .map((item) => item.name);
  const hasIsolationRisk = isolationRiskCriteria.length > 0;
  const status =
    totalScore >= 70 ? "Indicatively Eligible" : "Below Eligibility Threshold";

  const basePbbRatePercentOfMbs = calculatePbbRate(totalScore);
  const adjustedPbbRatePercentOfMbs = calculateAdjustedPbbRate(
    basePbbRatePercentOfMbs,
    assessment.allReportsSubmittedOnTime,
  );

  return {
    criteria,
    totalScore,
    maxScore: 100,
    status,
    hasInputs: true,
    hasIsolationRisk,
    isolationRiskCriteria,
    basePbbRatePercentOfMbs,
    adjustedPbbRatePercentOfMbs,
  };
}
