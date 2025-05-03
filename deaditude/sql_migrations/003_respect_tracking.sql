CREATE TABLE IF NOT EXISTS respect_tracking (
    id SERIAL PRIMARY KEY,
    tech_id TEXT NOT NULL REFERENCES tech_registry(id),
    tech_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_respect_tech_id ON respect_tracking(tech_id);