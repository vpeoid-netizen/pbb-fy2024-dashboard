import { readFileSync, readdirSync } from "fs";
import { join } from "path";
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

async function migrate() {
  const migrationsDir = join(process.cwd(), "database", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  console.log(`Running ${files.length} migration(s)...`);

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const migrationSql = readFileSync(filePath, "utf-8");
    console.log(`Applying ${file}...`);

    const statements = migrationSql
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await sql.query(`${statement};`);
    }

    console.log(`Applied ${file}`);
  }

  console.log("All migrations completed successfully.");
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
