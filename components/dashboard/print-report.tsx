import { formatManilaDateTime } from "@/lib/date-time";
import { getCategoryLabel } from "@/lib/utils";
import type { DashboardData } from "@/types/pbb";

export function PrintReport({ data }: { data: DashboardData }) {
  return (
    <div className="print-only space-y-6 p-8 text-black">
      <header>
        <h1>Partido State University</h1>
        <h2>FY 2024 PBB Document Submission and Monitoring Dashboard</h2>
        <p>Generated: {formatManilaDateTime(data.serverTimestamp)}</p>
      </header>

      <section>
        <h3>Monitoring Summary</h3>
        <p>
          Completion: {data.summary.completionPercentage}% ({data.summary.submittedRequirements}{" "}
          submitted, {data.summary.pendingRequirements} pending,{" "}
          {data.summary.totalRequirements} total)
        </p>
      </section>

      <section>
        <h3>Requirements</h3>
        {data.requirements.map((req) => (
          <article key={req.id} className="mb-4 border-b border-gray-300 pb-4">
            <h4>{req.title}</h4>
            <p>Category: {getCategoryLabel(req.category)}</p>
            <p>Status: {req.submitted ? "Submitted" : "Pending"}</p>
            <p>Validating Agency: {req.validatingAgency}</p>
            <p>Deadline: {req.deadline}</p>
            <p>Folder URL: {req.folderUrl}</p>
            <p>Remarks: {req.remarks || "—"}</p>
            <p>Submitted: {formatManilaDateTime(req.submittedAt)}</p>
            <p>Last Updated: {formatManilaDateTime(req.updatedAt)}</p>
            <p>Updated By: {req.updatedBy ?? "—"}</p>
          </article>
        ))}
      </section>

      <section>
        <h3>Eligibility Results</h3>
        <p>
          Total Score: {data.eligibilityResult.totalScore.toFixed(1)} /{" "}
          {data.eligibilityResult.maxScore}
        </p>
        <p>Status: {data.eligibilityResult.status}</p>
        {data.eligibilityResult.hasIsolationRisk && (
          <p>
            Isolation-risk criteria:{" "}
            {data.eligibilityResult.isolationRiskCriteria.join(", ")}
          </p>
        )}
        {data.eligibilityResult.basePbbRatePercentOfMbs !== null && (
          <p>
            Estimated base PBB rate:{" "}
            {data.eligibilityResult.basePbbRatePercentOfMbs.toFixed(2)}% of Monthly Basic Salary
          </p>
        )}
        {data.eligibilityResult.adjustedPbbRatePercentOfMbs !== null &&
          !data.eligibilityAssessment.allReportsSubmittedOnTime && (
            <p>
              Estimated adjusted PBB rate:{" "}
              {data.eligibilityResult.adjustedPbbRatePercentOfMbs.toFixed(2)}% of Monthly Basic Salary
            </p>
          )}
      </section>

      <section>
        <h3>Accountability Assessments</h3>
        {data.accountabilities
          .filter((item) => item.isApplicable)
          .map((item) => (
            <p key={item.accountabilityId}>
              {item.title}: {item.assessment.replace("-", " ")} — {item.notes || "No notes"}
            </p>
          ))}
      </section>

      <footer>
        <p>For internal monitoring and documentary consolidation.</p>
        <p>
          This report reflects centralized dashboard data and does not constitute official
          PBB eligibility confirmation.
        </p>
      </footer>
    </div>
  );
}
