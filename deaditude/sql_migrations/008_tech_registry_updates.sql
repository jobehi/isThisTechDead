-- Migration to add category and description fields to tech_registry for better tech classification
ALTER TABLE tech_registry
  -- Add category field for technology classification
  ADD COLUMN IF NOT EXISTS category TEXT,
  -- Add description field for providing information about the technology
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Add migration info to log
INSERT INTO public.schema_migrations (version, inserted_at)
VALUES ('008_tech_registry_updates', NOW())
ON CONFLICT DO NOTHING;

-- Add comments to explain the fields
COMMENT ON COLUMN tech_registry.category IS 'Category of the technology: language, framework, tool, or platform';
COMMENT ON COLUMN tech_registry.description IS 'A brief description of what the technology is and what it is used for'; 