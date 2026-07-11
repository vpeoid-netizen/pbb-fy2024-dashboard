import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { pbbRequirements } from "@/data/pbbRequirements";
import { accountabilitySeeds } from "@/data/accountabilities";

config({ path: ".env.local" });
config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not configured.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function seed() {
  console.log("Seeding requirements...");

  for (const req of pbbRequirements) {
    await sql`
      INSERT INTO pbb_requirements (
        id, category, title, short_title, description, documents,
        folder_url, validating_agency, deadline, keywords, display_order
      ) VALUES (
        ${req.id},
        ${req.category},
        ${req.title},
        ${req.shortTitle},
        ${req.description},
        ${JSON.stringify(req.documents)}::jsonb,
        ${req.folderUrl},
        ${req.validatingAgency},
        ${req.deadline},
        ${JSON.stringify(req.keywords)}::jsonb,
        ${req.displayOrder}
      )
      ON CONFLICT (id) DO UPDATE SET
        category = EXCLUDED.category,
        title = EXCLUDED.title,
        short_title = EXCLUDED.short_title,
        description = EXCLUDED.description,
        documents = EXCLUDED.documents,
        folder_url = EXCLUDED.folder_url,
        validating_agency = EXCLUDED.validating_agency,
        deadline = EXCLUDED.deadline,
        keywords = EXCLUDED.keywords,
        display_order = EXCLUDED.display_order,
        updated_at = NOW()
    `;

    await sql`
      INSERT INTO requirement_monitoring (requirement_id)
      VALUES (${req.id})
      ON CONFLICT (requirement_id) DO NOTHING
    `;
  }

  console.log(`Seeded ${pbbRequirements.length} requirements.`);

  console.log("Seeding eligibility assessment singleton...");
  await sql`
    INSERT INTO eligibility_assessment (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `;

  console.log("Seeding accountability assessments...");
  for (const item of accountabilitySeeds) {
    await sql`
      INSERT INTO accountability_assessments (
        accountability_id, title, is_applicable
      ) VALUES (
        ${item.accountabilityId},
        ${item.title},
        ${item.isApplicableByDefault}
      )
      ON CONFLICT (accountability_id) DO UPDATE SET
        title = EXCLUDED.title
    `;
  }

  console.log(`Seeded ${accountabilitySeeds.length} accountability items.`);
  console.log("Seed completed successfully.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
