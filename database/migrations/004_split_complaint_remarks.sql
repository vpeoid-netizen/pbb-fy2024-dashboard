ALTER TABLE eligibility_assessment
ADD COLUMN IF NOT EXISTS hotline_remarks TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS ccb_remarks TEXT NOT NULL DEFAULT '';

ALTER TABLE eligibility_assessment
DROP COLUMN IF EXISTS citizen_satisfaction_remarks,
DROP COLUMN IF EXISTS reportorial_remarks;
