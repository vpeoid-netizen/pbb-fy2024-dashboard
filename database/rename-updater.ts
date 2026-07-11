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

const FROM_NAME = "IPDO";
const TO_NAME = "IPDO_Kier";

async function renameUpdater() {
  console.log(`Renaming updater "${FROM_NAME}" to "${TO_NAME}"...`);

  const monitoring = await sql`
    UPDATE requirement_monitoring
    SET updated_by = ${TO_NAME}
    WHERE updated_by = ${FROM_NAME}
  `;
  console.log(`Updated requirement_monitoring (${monitoring.length ?? 0} rows).`);

  const eligibility = await sql`
    UPDATE eligibility_assessment
    SET updated_by = ${TO_NAME}
    WHERE updated_by = ${FROM_NAME}
  `;
  console.log(`Updated eligibility_assessment (${eligibility.length ?? 0} rows).`);

  const accountabilities = await sql`
    UPDATE accountability_assessments
    SET updated_by = ${TO_NAME}
    WHERE updated_by = ${FROM_NAME}
  `;
  console.log(`Updated accountability_assessments (${accountabilities.length ?? 0} rows).`);

  const auditLog = await sql`
    UPDATE monitoring_audit_log
    SET updated_by = ${TO_NAME}
    WHERE updated_by = ${FROM_NAME}
  `;
  console.log(`Updated monitoring_audit_log (${auditLog.length ?? 0} rows).`);

  const [{ remaining }] = await sql`
    SELECT COUNT(*)::int AS remaining
    FROM (
      SELECT updated_by FROM requirement_monitoring WHERE updated_by = ${FROM_NAME}
      UNION ALL
      SELECT updated_by FROM eligibility_assessment WHERE updated_by = ${FROM_NAME}
      UNION ALL
      SELECT updated_by FROM accountability_assessments WHERE updated_by = ${FROM_NAME}
      UNION ALL
      SELECT updated_by FROM monitoring_audit_log WHERE updated_by = ${FROM_NAME}
    ) AS matches
  `;

  console.log("");
  console.log(`Remaining "${FROM_NAME}" references: ${remaining}`);
  console.log("Updater rename completed successfully.");
}

renameUpdater().catch((error) => {
  console.error("Updater rename failed:", error);
  process.exit(1);
});
