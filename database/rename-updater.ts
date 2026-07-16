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

const FROM_NAMES = ["IPDO", "IPDO_Kier"] as const;
const TO_NAME = "PBB Focal Person";

async function renameUpdater() {
  console.log(`Renaming updaters ${FROM_NAMES.map((name) => `"${name}"`).join(", ")} to "${TO_NAME}"...`);

  let monitoringCount = 0;
  let eligibilityCount = 0;
  let accountabilityCount = 0;
  let auditCount = 0;

  for (const fromName of FROM_NAMES) {
    const monitoring = await sql`
      UPDATE requirement_monitoring
      SET updated_by = ${TO_NAME}
      WHERE updated_by = ${fromName}
    `;
    monitoringCount += monitoring.length ?? 0;

    const eligibility = await sql`
      UPDATE eligibility_assessment
      SET updated_by = ${TO_NAME}
      WHERE updated_by = ${fromName}
    `;
    eligibilityCount += eligibility.length ?? 0;

    const accountabilities = await sql`
      UPDATE accountability_assessments
      SET updated_by = ${TO_NAME}
      WHERE updated_by = ${fromName}
    `;
    accountabilityCount += accountabilities.length ?? 0;

    const auditLog = await sql`
      UPDATE monitoring_audit_log
      SET updated_by = ${TO_NAME}
      WHERE updated_by = ${fromName}
    `;
    auditCount += auditLog.length ?? 0;
  }

  console.log(`Updated requirement_monitoring (${monitoringCount} rows).`);
  console.log(`Updated eligibility_assessment (${eligibilityCount} rows).`);
  console.log(`Updated accountability_assessments (${accountabilityCount} rows).`);
  console.log(`Updated monitoring_audit_log (${auditCount} rows).`);

  const [{ remaining }] = await sql`
    SELECT COUNT(*)::int AS remaining
    FROM (
      SELECT updated_by FROM requirement_monitoring WHERE updated_by = ANY(${[...FROM_NAMES]})
      UNION ALL
      SELECT updated_by FROM eligibility_assessment WHERE updated_by = ANY(${[...FROM_NAMES]})
      UNION ALL
      SELECT updated_by FROM accountability_assessments WHERE updated_by = ANY(${[...FROM_NAMES]})
      UNION ALL
      SELECT updated_by FROM monitoring_audit_log WHERE updated_by = ANY(${[...FROM_NAMES]})
    ) AS matches
  `;

  console.log("");
  console.log(`Remaining old updater references: ${remaining}`);
  console.log("Updater rename completed successfully.");
}

renameUpdater().catch((error) => {
  console.error("Updater rename failed:", error);
  process.exit(1);
});
