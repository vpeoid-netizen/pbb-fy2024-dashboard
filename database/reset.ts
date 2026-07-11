import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not configured.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function resetMonitoringData() {
  console.log("Resetting monitoring data for a fresh launch...");

  const auditResult = await sql`
    DELETE FROM monitoring_audit_log
  `;
  console.log(`Cleared audit log (${auditResult.length ?? "all"} rows).`);

  const monitoringResult = await sql`
    UPDATE requirement_monitoring
    SET
      submitted = FALSE,
      remarks = '',
      submitted_at = NULL,
      updated_by = NULL,
      updated_at = NOW(),
      version = 1
  `;
  console.log(`Reset requirement monitoring (${monitoringResult.length ?? "all"} rows).`);

  await sql`
    INSERT INTO eligibility_assessment (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    UPDATE eligibility_assessment
    SET
      total_performance_indicators = NULL,
      performance_indicators_met = NULL,
      process_improvement_percent = NULL,
      process_nominated_service = '',
      process_service_provider = '',
      disbursement_bur_percent = NULL,
      hotline_ticket_count = NULL,
      hotline_resolution_rate = NULL,
      hotline_no_complaints = FALSE,
      ccb_ticket_count = NULL,
      ccb_resolution_rate = NULL,
      ccb_no_complaints = FALSE,
      all_reports_submitted_on_time = TRUE,
      late_reportorial_submissions = '[]'::jsonb,
      performance_remarks = '',
      process_remarks = '',
      financial_remarks = '',
      citizen_satisfaction_remarks = '',
      reportorial_remarks = '',
      updated_by = NULL,
      updated_at = NOW(),
      version = 1
    WHERE id = 1
  `;
  console.log("Reset eligibility assessment.");

  const accountabilityResult = await sql`
    UPDATE accountability_assessments
    SET
      assessment = 'not-assessed',
      notes = '',
      updated_by = NULL,
      updated_at = NOW(),
      version = 1
  `;
  console.log(`Reset accountability assessments (${accountabilityResult.length ?? "all"} rows).`);

  const [{ submitted_count }] = await sql`
    SELECT COUNT(*)::int AS submitted_count
    FROM requirement_monitoring
    WHERE submitted = TRUE
  `;
  const [{ audit_count }] = await sql`
    SELECT COUNT(*)::int AS audit_count
    FROM monitoring_audit_log
  `;

  console.log("");
  console.log("Fresh launch verification:");
  console.log(`  Submitted requirements: ${submitted_count}`);
  console.log(`  Audit log entries: ${audit_count}`);
  console.log("");
  console.log("Monitoring data reset completed successfully.");
}

resetMonitoringData().catch((error) => {
  console.error("Reset failed:", error);
  process.exit(1);
});
