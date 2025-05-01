/**
 * Environment variables loader for scripts
 * Loads variables from .env and .env.local files
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SITE_URL?: string;
}

export function loadEnvVars(): EnvConfig {
  // Determine root directory
  const rootDir = process.cwd();

  try {
    // Load .env file first (base config)
    dotenv.config({
      path: path.resolve(rootDir, '.env'),
    });

    // Then try to load .env.local which overrides .env
    const envLocalPath = path.resolve(rootDir, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      dotenv.config({
        path: envLocalPath,
      });
    }

    // Validate required environment variables
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.warn(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
      console.warn('The script may not work correctly without these variables.');
    }

    // Set default SITE_URL if not provided
    if (!process.env.SITE_URL) {
      process.env.SITE_URL = 'http://localhost:3000';
      console.info('Using default SITE_URL: http://localhost:3000');
    }

    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SITE_URL: process.env.SITE_URL,
    };
  } catch (error) {
    console.error('Error loading environment variables:', error);
    return {};
  }
}
