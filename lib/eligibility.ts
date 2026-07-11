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
  return {
    criteria: [
      { name: "Performance Results", rating: 0, points: 0, maxPoints: 25 },
      { name: "Process Results", rating: 0, points: 0, maxPoints: 25 },
      { name: "Financial Results", rating: 0, points: 0, maxPoints: 25 },
      { name: "Hotline #8888", rating: 0, points: 0, maxPoints: 12.5 },
      { name: "Contact Center ng Bayan", rating: 0, points: 0, maxPoints: 12.5 },
    ],
    totalScore: 0,
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

  const performanceRating = calculatePerformanceRating(
    assessment.totalPerformanceIndicators,
    assessment.performanceIndicatorsMet,
  );
  const processRating = calculateProcessRating(assessment.processImprovementPercent);
  const financialRating = calculateFinancialRating(assessment.disbursementBurPercent);
  const hotlineRating = calculateComplaintRating(
    assessment.hotlineTicketCount,
    assessment.hotlineResolutionRate,
    assessment.hotlineNoComplaints,
  );
  const ccbRating = calculateComplaintRating(
    assessment.ccbTicketCount,
    assessment.ccbResolutionRate,
    assessment.ccbNoComplaints,
  );

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
    .filter((item) => item.rating < 4)
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
