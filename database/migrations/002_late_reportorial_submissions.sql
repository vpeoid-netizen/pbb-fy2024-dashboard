ALTER TABLE eligibility_assessment
ADD COLUMN IF NOT EXISTS late_reportorial_submissions JSONB NOT NULL DEFAULT '[]'::jsonb;
