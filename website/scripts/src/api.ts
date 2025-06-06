/**
 * API client for scripts to access Supabase
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { loadEnvVars } from './env-loader';
import { TechWithScore } from '@/domains/tech/tech.types';

// Initialize environment
const env = loadEnvVars();

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

/**
 * Get the Supabase client
 */
function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }

  return supabase;
}

/**
 * Get all techs with their latest scores
 */
export async function getAllTechs(): Promise<TechWithScore[]> {
  const supabase = getSupabaseClient();

  // Get all techs from the registry
  const { data: techs, error } = await supabase.from('tech_registry').select('*').limit(1000);

  if (error) {
    throw new Error(`Failed to fetch tech registry: ${error.message}`);
  }

  if (!techs) {
    return [];
  }

  // Get the latest snapshot for each tech to get the score
  const techsWithScores = await Promise.all(
    techs.map(async (tech: TechWithScore) => {
      // Get latest snapshot
      const { data: snapshots } = await supabase
        .from('tech_snapshots_v2')
        .select('deaditude_score, snapshot_date')
        .eq('tech_id', tech.id)
        .order('snapshot_date', { ascending: false })
        .limit(1);

      return {
        ...tech,
        latest_score: snapshots?.[0]?.deaditude_score || null,
        latest_snapshot_date: snapshots?.[0]?.snapshot_date || null,
        respect_count: 0,
      } as TechWithScore;
    })
  );

  return techsWithScores;
}
