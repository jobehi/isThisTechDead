import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';
import { handleSupabaseError } from './errors';

/**
 * Supabase Client
 *
 * Server-only Supabase client to ensure database operations only happen on the server.
 * Uses lazy initialization to avoid issues during build.
 */

// Check for server-side execution
function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'Supabase client should only be used server-side. Use API routes for client access.'
    );
  }
}

// Create a factory function that returns a Supabase client
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  // Ensure we're on the server
  ensureServerSide();

  // If we already have an instance, return it (singleton pattern)
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Check if we have the required configuration
  if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error('Supabase URL and anon key are required for server operations');
  }

  // Create the client with proper credentials
  supabaseInstance = createClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  return supabaseInstance;
}

// Create a lazy-loaded Supabase client
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    // Only initialize the client when methods are actually called
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    
    if (typeof value === 'function') {
      return function(...args: unknown[]) {
        return (value as (...args: unknown[]) => unknown).apply(client, args);
      };
    }
    
    return value;
  }
});

/**
 * Higher-order function to wrap a Supabase query with error handling
 * @param context The context to use in error messages
 * @returns A function that wraps a query function with error handling
 * 
 * @example
 * ```ts
 * const result = await withSupabaseErrorContext('Get tech by id')(async () => {
 *   const { data, error } = await supabase
 *     .from(DB_TABLES.TECH_REGISTRY)
 *     .select('*')
 *     .eq('id', id)
 *     .single();
 *   
 *   if (error) throw error;
 *   return data;
 * });
 * ```
 */
export function withSupabaseErrorContext<T>(context: string) {
  return async (queryFn: () => Promise<T>): Promise<T> => {
    try {
      return await queryFn();
    } catch (error) {
      // Handle "not found" errors from .single() queries
      if (error instanceof Error && error.message.includes('not found')) {
        return null as T;
      }
      // Handle all other errors
      return handleSupabaseError(error, context);
    }
  };
}

// Re-export client for easier imports
export default supabase;
