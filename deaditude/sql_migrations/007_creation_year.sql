-- Migration to add creation_year field to tech_registry for age-based scoring
ALTER TABLE tech_registry
  -- Add creation_year field (integer representing the year the technology was first released)
  ADD COLUMN IF NOT EXISTS creation_year INTEGER;

-- Add migration info to log
INSERT INTO public.schema_migrations (version, inserted_at)
VALUES ('007_creation_year', NOW())
ON CONFLICT DO NOTHING;

COMMENT ON COLUMN tech_registry.creation_year IS 'Year the technology was first created/released (used for age-based scoring adjustments)'; 