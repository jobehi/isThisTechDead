/**
 * Configuration
 *
 * Centralized configuration management for the application.
 * This provides type-safe access to environment variables and other configuration.
 */

interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

interface SiteConfig {
  url: string;
  name: string;
  description: string;
  ogImage: string;
}

interface FeatureConfig {
  enableProjectSubmission: boolean;
  enablePressF: boolean;
}

interface AppConfig {
  env: 'development' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  api: ApiConfig;
  supabase: SupabaseConfig;
  site: SiteConfig;
  features: FeatureConfig;
}

// Determine the current environment
const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Application configuration
 */
export const config: AppConfig = {
  env: nodeEnv as 'development' | 'production' | 'test',
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  site: {
    url: process.env.SITE_URL || 'https://www.isthistechdead.com',
    name: 'Is This Tech Dead?',
    description: 'Find out if your favorite technologies are dying with data-driven insights.',
    ogImage: '/is_this_tech_dead_cover.png',
  },

  features: {
    enableProjectSubmission: process.env.NEXT_PUBLIC_ENABLE_PROJECT_SUBMISSION !== 'false',
    enablePressF: process.env.NEXT_PUBLIC_ENABLE_PRESS_F !== 'false',
  },
};

/**
 * Helper to get a required environment variable
 * This will throw an error if the variable is not defined
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not defined`);
  }
  return value;
}

export default config;
