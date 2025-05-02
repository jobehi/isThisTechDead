import { createClient } from '@supabase/supabase-js';
import { config } from './config';

/**
 * Supabase Client
 *
 * A configured Supabase client for database operations.
 */

// Create a single Supabase client for interacting with your database
export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    persistSession: false,
  },
});

// Re-export client for easier imports
export default supabase;
