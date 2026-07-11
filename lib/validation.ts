import { z } from "zod";
import { REPORTORIAL_REQUIREMENT_IDS } from "@/data/reportorialRequirements";

export const updaterNameSchema = z
  .string()
  .trim()
  .min(1, "Updater name is required.")
  .max(150, "Updater name must be 150 characters or fewer.");

export const remarksSchema = z
  .string()
  .max(1000, "Remarks must be 1,000 characters or fewer.");

export const requirementPatchSchema = z
  .object({
    submitted: z.boolean().optional(),
    remarks: remarksSchema.optional(),
    updatedBy: updaterNameSchema,
    browserSessionId: z.string().max(100).optional(),
    expectedVersion: z.number().int().positive(),
  })
  .strict()
  .refine((data) => data.submitted !== undefined || data.remarks !== undefined, {
    message: "At least one editable field must be provided.",
  });

export const lateReportorialSubmissionSchema = z.object({
  requirementId: z
    .string()
    .refine((value) => REPORTORIAL_REQUIREMENT_IDS.includes(value), {
      message: "Invalid reportorial requirement ID.",
    }),
  actualSubmissionDate: z.string().min(1, "Actual submission date is required."),
  reason: z.string().trim().min(1, "Reason or remarks are required.").max(1000),
});

export const eligibilityTextFieldSchema = z.string().max(1000);

export const eligibilityShortTextFieldSchema = z.string().max(300);

export const eligibilityPatchSchema = z
  .object({
    totalPerformanceIndicators: z.number().int().min(1).nullable(),
    performanceIndicatorsMet: z.number().int().min(0).nullable(),
    processImprovementPercent: z.number().min(0).nullable(),
    processNominatedService: eligibilityShortTextFieldSchema,
    processServiceProvider: eligibilityShortTextFieldSchema,
    disbursementBurPercent: z.number().min(0).max(100).nullable(),
    hotlineTicketCount: z.number().int().min(0).nullable(),
    hotlineResolutionRate: z.number().min(0).max(100).nullable(),
    hotlineNoComplaints: z.boolean(),
    ccbTicketCount: z.number().int().min(0).nullable(),
    ccbResolutionRate: z.number().min(0).max(100).nullable(),
    ccbNoComplaints: z.boolean(),
    allReportsSubmittedOnTime: z.boolean(),
    lateReportorialSubmissions: z.array(lateReportorialSubmissionSchema),
    performanceRemarks: eligibilityTextFieldSchema,
    processRemarks: eligibilityTextFieldSchema,
    financialRemarks: eligibilityTextFieldSchema,
    hotlineRemarks: eligibilityTextFieldSchema,
    ccbRemarks: eligibilityTextFieldSchema,
    updatedBy: updaterNameSchema,
    expectedVersion: z.number().int().positive(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.totalPerformanceIndicators !== null &&
      data.performanceIndicatorsMet !== null &&
      data.performanceIndicatorsMet > data.totalPerformanceIndicators
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indicators met cannot exceed total indicators.",
        path: ["performanceIndicatorsMet"],
      });
    }

    if (!data.allReportsSubmittedOnTime) {
      for (const [index, entry] of data.lateReportorialSubmissions.entries()) {
        if (!entry.actualSubmissionDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Actual submission date is required for each selected late requirement.",
            path: ["lateReportorialSubmissions", index, "actualSubmissionDate"],
          });
        }
        if (!entry.reason.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Reason or remarks are required for each selected late requirement.",
            path: ["lateReportorialSubmissions", index, "reason"],
          });
        }
      }
    }

    if (data.allReportsSubmittedOnTime && data.lateReportorialSubmissions.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Late reportorial submissions must be empty when all requirements were submitted on time.",
        path: ["lateReportorialSubmissions"],
      });
    }
  });

export const accountabilityPatchSchema = z
  .object({
    assessment: z.enum(["compliant", "needs-attention", "not-assessed"]),
    notes: z.string().max(1000),
    isApplicable: z.boolean(),
    updatedBy: updaterNameSchema,
    expectedVersion: z.number().int().positive(),
  })
  .strict();

export const requirementIdSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Invalid requirement ID.")
  .max(100);

export const accountabilityIdSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Invalid accountability ID.")
  .max(100);

export function parseJsonBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown,
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(" ");
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
