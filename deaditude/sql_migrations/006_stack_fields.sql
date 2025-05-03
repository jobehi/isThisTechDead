-- Migration to add StackShare-specific fields needed by stackshare.py analyzer
ALTER TABLE tech_registry
  -- StackShare specific fields (used in the stackshare.py analyzer)
  ADD COLUMN IF NOT EXISTS showcase_url TEXT,
  ADD COLUMN IF NOT EXISTS their_stack_slug TEXT;

-- Add migration info to log
INSERT INTO public.schema_migrations (version, inserted_at)
VALUES ('006_stack_fields', NOW())
ON CONFLICT DO NOTHING;

COMMENT ON COLUMN tech_registry.showcase_url IS 'URL for technology showcase pages on StackShare';
COMMENT ON COLUMN tech_registry.their_stack_slug IS 'TheirStack slug for technology adoption tracking'; 