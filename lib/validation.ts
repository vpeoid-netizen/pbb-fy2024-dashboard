import { z } from "zod";

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

export const eligibilityPatchSchema = z
  .object({
    totalPerformanceIndicators: z.number().int().min(1).nullable(),
    performanceIndicatorsMet: z.number().int().min(0).nullable(),
    processImprovementPercent: z.number().min(0).nullable(),
    disbursementBurPercent: z.number().min(0).max(100).nullable(),
    hotlineTicketCount: z.number().int().min(0).nullable(),
    hotlineResolutionRate: z.number().min(0).max(100).nullable(),
    hotlineNoComplaints: z.boolean(),
    ccbTicketCount: z.number().int().min(0).nullable(),
    ccbResolutionRate: z.number().min(0).max(100).nullable(),
    ccbNoComplaints: z.boolean(),
    allReportsSubmittedOnTime: z.boolean(),
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
