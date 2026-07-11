import { describe, expect, it } from "vitest";
import {
  calculateAdjustedPbbRate,
  calculateComplaintRating,
  calculateCompletionPercentage,
  calculateEligibilityResult,
  calculateFinancialRating,
  calculatePerformanceRating,
  calculatePbbRate,
  calculateProcessRating,
  calculateSummary,
} from "@/lib/eligibility";
import { requirementPatchSchema } from "@/lib/validation";
import type { EligibilityAssessment } from "@/types/pbb";

describe("completion percentage", () => {
  it("calculates rounded percentage", () => {
    expect(calculateCompletionPercentage(9, 18)).toBe(50);
    expect(calculateCompletionPercentage(18, 18)).toBe(100);
    expect(calculateCompletionPercentage(0, 0)).toBe(0);
  });

  it("builds summary counts", () => {
    expect(calculateSummary(5, 18)).toEqual({
      totalRequirements: 18,
      submittedRequirements: 5,
      pendingRequirements: 13,
      completionPercentage: 28,
    });
  });
});

describe("performance rating", () => {
  it("maps percentage bands to ratings", () => {
    expect(calculatePerformanceRating(10, 4)).toBe(1);
    expect(calculatePerformanceRating(10, 6)).toBe(2);
    expect(calculatePerformanceRating(10, 7)).toBe(3);
    expect(calculatePerformanceRating(10, 8)).toBe(4);
    expect(calculatePerformanceRating(10, 10)).toBe(5);
  });
});

describe("process rating", () => {
  it("uses ratings 1, 3, and 5 only", () => {
    expect(calculateProcessRating(5)).toBe(1);
    expect(calculateProcessRating(12)).toBe(3);
    expect(calculateProcessRating(20)).toBe(5);
  });
});

describe("financial rating", () => {
  it("maps BUR percentage to ratings", () => {
    expect(calculateFinancialRating(30)).toBe(1);
    expect(calculateFinancialRating(45)).toBe(2);
    expect(calculateFinancialRating(60)).toBe(3);
    expect(calculateFinancialRating(75)).toBe(4);
    expect(calculateFinancialRating(90)).toBe(5);
  });
});

describe("complaint rating", () => {
  it("assigns rating 5 when no complaints are received", () => {
    expect(calculateComplaintRating(null, null, true)).toBe(5);
  });

  it("uses ticket-count thresholds for rating 4", () => {
    expect(calculateComplaintRating(300, 76, false)).toBe(4);
    expect(calculateComplaintRating(200, 81, false)).toBe(4);
    expect(calculateComplaintRating(200, 79, false)).toBe(3);
  });
});

describe("total score and PBB rate", () => {
  const baseAssessment: EligibilityAssessment = {
    totalPerformanceIndicators: 10,
    performanceIndicatorsMet: 8,
    processImprovementPercent: 16,
    disbursementBurPercent: 86,
    hotlineTicketCount: 10,
    hotlineResolutionRate: 100,
    hotlineNoComplaints: false,
    ccbTicketCount: 10,
    ccbResolutionRate: 100,
    ccbNoComplaints: false,
    allReportsSubmittedOnTime: true,
    lateReportorialSubmissions: [],
    updatedBy: null,
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  it("returns zero score when no self-rating inputs are provided", () => {
    const emptyAssessment: EligibilityAssessment = {
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

    const result = calculateEligibilityResult(emptyAssessment);
    expect(result.totalScore).toBe(0);
    expect(result.status).toBe("Not Yet Assessed");
    expect(result.hasInputs).toBe(false);
  });

  it("calculates indicative eligibility at 70 points or higher", () => {
    const result = calculateEligibilityResult(baseAssessment);
    expect(result.totalScore).toBeGreaterThanOrEqual(70);
    expect(result.status).toBe("Indicatively Eligible");
  });

  it("calculates indicative PBB rate from floored score", () => {
    expect(calculatePbbRate(70)).toBe(45.5);
    expect(calculatePbbRate(75)).toBe(48.75);
    expect(calculatePbbRate(69)).toBeNull();
  });

  it("applies possible 5% late-submission reduction", () => {
    expect(calculateAdjustedPbbRate(52, false)).toBeCloseTo(49.4);
    expect(calculateAdjustedPbbRate(52, true)).toBe(52);
  });

  it("detects isolation risk for ratings below 4", () => {
    const result = calculateEligibilityResult({
      ...baseAssessment,
      processImprovementPercent: 5,
    });
    expect(result.hasIsolationRisk).toBe(true);
    expect(result.isolationRiskCriteria).toContain("Process Results");
  });
});

describe("validation", () => {
  it("requires updater name and editable field", () => {
    const valid = requirementPatchSchema.safeParse({
      submitted: true,
      updatedBy: "PBB Secretariat",
      expectedVersion: 1,
    });
    expect(valid.success).toBe(true);

    const invalid = requirementPatchSchema.safeParse({
      updatedBy: "PBB Secretariat",
      expectedVersion: 1,
    });
    expect(invalid.success).toBe(false);
  });
});
