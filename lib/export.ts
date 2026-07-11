import type { DashboardData } from "@/types/pbb";
import { formatManilaDateTime } from "@/lib/date-time";
import { getCategoryLabel } from "@/lib/utils";

export function buildCsvExport(data: DashboardData): string {
  const headers = [
    "Title",
    "Category",
    "Status",
    "Remarks",
    "Submitted Date",
    "Last Updated",
    "Updated By",
    "Validating Agency",
    "Deadline",
    "Folder URL",
  ];

  const rows = data.requirements.map((req) => [
    req.title,
    getCategoryLabel(req.category),
    req.submitted ? "Submitted" : "Pending",
    req.remarks.replace(/"/g, '""'),
    formatManilaDateTime(req.submittedAt),
    formatManilaDateTime(req.updatedAt),
    req.updatedBy ?? "",
    req.validatingAgency,
    req.deadline,
    req.folderUrl,
  ]);

  const summaryRow = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    `Completion: ${data.summary.completionPercentage}% (${data.summary.submittedRequirements}/${data.summary.totalRequirements})`,
  ];

  const csvLines = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    "",
    summaryRow.map((cell) => `"${cell}"`).join(","),
  ];

  return csvLines.join("\n");
}

export function buildJsonExport(data: DashboardData): string {
  return JSON.stringify(
    {
      exportedAt: data.serverTimestamp,
      summary: data.summary,
      requirements: data.requirements.map((req) => ({
        id: req.id,
        title: req.title,
        category: req.category,
        submitted: req.submitted,
        remarks: req.remarks,
        submittedAt: req.submittedAt,
        updatedAt: req.updatedAt,
        updatedBy: req.updatedBy,
        validatingAgency: req.validatingAgency,
        deadline: req.deadline,
        folderUrl: req.folderUrl,
      })),
      eligibilityAssessment: data.eligibilityAssessment,
      eligibilityResult: data.eligibilityResult,
      accountabilities: data.accountabilities,
    },
    null,
    2,
  );
}
