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
  githubUrl: string;
  ethicalAdsId: string;
}

interface FeatureConfig {
  enableProjectSubmission: boolean;
  enablePressF: boolean;
}

interface RecaptchaConfig {
  siteKey: string;
  secretKey: string;
}

interface NewsletterConfig {
  apiKey: string;
}

interface SecurityConfig {
  rateLimits: {
    respect: {
      maxPerDay: number;
    };
    projectSubmission: {
      requestsPerHour: number;
      windowMs: number;
    };
  };
  revalidationSecret: string;
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
  recaptcha: RecaptchaConfig;
  newsletter: NewsletterConfig;
  security: SecurityConfig;
}

/**
 * Helper to get an optional environment variable with a default value
 */
export function getEnv(name: string, defaultValue: string): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  return defaultValue;
}

/**
 * Helper to get a boolean environment variable
 */
export function getBoolEnv(name: string, defaultValue = true): boolean {
  let value;
  if (typeof process !== 'undefined' && process.env) {
    value = process.env[name];
  }
  if (value === undefined) return defaultValue;
  return value.toLowerCase() !== 'false';
}

// Determine the current environment
const nodeEnv =
  typeof process !== 'undefined' && process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

/**
 * Application configuration
 */
export const config: AppConfig = {
  env: nodeEnv as 'development' | 'production' | 'test',
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',

  api: {
    baseUrl: getEnv('PUBLIC_API_URL', getEnv('NEXT_PUBLIC_API_URL', '/api')),
    timeout: 30000,
  },

  supabase: {
    url:
      (import.meta as any).env?.PUBLIC_SUPABASE_URL ||
      (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
      getEnv('PUBLIC_SUPABASE_URL', getEnv('NEXT_PUBLIC_SUPABASE_URL', '')),
    anonKey:
      (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY ||
      (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      getEnv('PUBLIC_SUPABASE_ANON_KEY', getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')),
  },

  site: {
    url: (import.meta as any).env?.SITE_URL || getEnv('SITE_URL', 'https://www.isthistechdead.com'),
    name: 'Is This Tech Dead?',
    description: 'Find out if your favorite technologies are dying with data-driven insights.',
    ogImage: '/is_this_tech_dead_cover.png',
    githubUrl: 'https://github.com/jobehi/is-this-tech-dead-front',
    ethicalAdsId:
      (import.meta as any).env?.ETHICAL_ADS_ID || getEnv('ETHICAL_ADS_ID', 'isthistechdeadcom'),
  },

  features: {
    enableProjectSubmission:
      getBoolEnv('PUBLIC_ENABLE_PROJECT_SUBMISSION') ??
      getBoolEnv('NEXT_PUBLIC_ENABLE_PROJECT_SUBMISSION', true),
    enablePressF:
      getBoolEnv('PUBLIC_ENABLE_PRESS_F') ?? getBoolEnv('NEXT_PUBLIC_ENABLE_PRESS_F', true),
  },

  recaptcha: {
    siteKey:
      (import.meta as any).env?.PUBLIC_RECAPTCHA_SITE_KEY ||
      getEnv('PUBLIC_RECAPTCHA_SITE_KEY', getEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', '')),
    secretKey: (import.meta as any).env?.RECAPTCHA_SECRET_KEY || getEnv('RECAPTCHA_SECRET_KEY', ''),
  },

  newsletter: {
    apiKey:
      (import.meta as any).env?.PUBLIC_BUTTONDOWN_API_KEY ||
      getEnv('PUBLIC_BUTTONDOWN_API_KEY', getEnv('NEXT_PUBLIC_BUTTONDOWN_API_KEY', '')),
  },

  security: {
    rateLimits: {
      respect: {
        maxPerDay: 10, // Max respects a user can pay per day per tech
      },
      projectSubmission: {
        requestsPerHour: 5,
        windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
      },
    },
    revalidationSecret:
      (import.meta as any).env?.REVALIDATION_SECRET || getEnv('REVALIDATION_SECRET', ''),
  },
};

/**
 * Log warnings for missing configurations (development only)
 * This won't break the build, but just warns developers
 */
export function logConfigWarnings() {
  if (process.env.NODE_ENV !== 'production') {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn(
        '⚠️ Warning: NEXT_PUBLIC_SUPABASE_URL is not set. Some features will not work properly.'
      );
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn(
        '⚠️ Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Some features will not work properly.'
      );
    }

    if (config.features.enableProjectSubmission) {
      if (!config.recaptcha.siteKey) {
        console.warn(
          'NEXT_PUBLIC_RECAPTCHA_SITE_KEY is recommended when project submission is enabled'
        );
      }
      if (!config.recaptcha.secretKey) {
        console.warn('RECAPTCHA_SECRET_KEY is recommended when project submission is enabled');
      }
    }
  }
}

/**
 * Database table names
 */
export enum DB_TABLES {
  TECH_REGISTRY = 'tech_registry',
  TECH_SNAPSHOTS = 'tech_snapshots_v2',
  TECH_PROJECTS = 'tech_projects',
  RESPECT_TRACKING = 'respect_tracking',
}

// Only log warnings in development and only on the server
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  logConfigWarnings();
}

export default config;
