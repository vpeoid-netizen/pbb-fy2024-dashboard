-- Initial schema for FY 2024 PBB Monitoring Dashboard

CREATE TABLE IF NOT EXISTS pbb_requirements (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    short_title TEXT,
    description TEXT NOT NULL DEFAULT '',
    documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    folder_url TEXT NOT NULL,
    validating_agency TEXT NOT NULL DEFAULT '',
    deadline TEXT NOT NULL DEFAULT '',
    keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requirement_monitoring (
    requirement_id VARCHAR(100) PRIMARY KEY
        REFERENCES pbb_requirements(id)
        ON DELETE CASCADE,
    submitted BOOLEAN NOT NULL DEFAULT FALSE,
    remarks TEXT NOT NULL DEFAULT '',
    submitted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(150),
    version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS monitoring_audit_log (
    id BIGSERIAL PRIMARY KEY,
    requirement_id VARCHAR(100)
        REFERENCES pbb_requirements(id)
        ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    previous_submitted BOOLEAN,
    new_submitted BOOLEAN,
    previous_remarks TEXT,
    new_remarks TEXT,
    updated_by VARCHAR(150),
    browser_session_id VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS eligibility_assessment (
    id INTEGER PRIMARY KEY DEFAULT 1
        CHECK (id = 1),
    total_performance_indicators INTEGER,
    performance_indicators_met INTEGER,
    process_improvement_percent NUMERIC(6,2),
    disbursement_bur_percent NUMERIC(6,2),
    hotline_ticket_count INTEGER,
    hotline_resolution_rate NUMERIC(6,2),
    hotline_no_complaints BOOLEAN NOT NULL DEFAULT FALSE,
    ccb_ticket_count INTEGER,
    ccb_resolution_rate NUMERIC(6,2),
    ccb_no_complaints BOOLEAN NOT NULL DEFAULT FALSE,
    all_reports_submitted_on_time BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by VARCHAR(150),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS accountability_assessments (
    accountability_id VARCHAR(100) PRIMARY KEY,
    title TEXT NOT NULL,
    assessment VARCHAR(30) NOT NULL DEFAULT 'not-assessed'
        CHECK (
            assessment IN (
                'compliant',
                'needs-attention',
                'not-assessed'
            )
        ),
    notes TEXT NOT NULL DEFAULT '',
    is_applicable BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by VARCHAR(150),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_pbb_requirements_category ON pbb_requirements(category);
CREATE INDEX IF NOT EXISTS idx_requirement_monitoring_updated_at ON requirement_monitoring(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_log_created_at ON monitoring_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_log_requirement_id ON monitoring_audit_log(requirement_id);
