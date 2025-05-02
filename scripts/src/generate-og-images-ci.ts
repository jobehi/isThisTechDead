#!/usr/bin/env node

/**
 * CI version of the OG image generator
 * Only generates the fallback image to speed up CI builds
 */
import { generateFallbackOGImage } from '../../lib/shared/server';
import { loadEnvVars } from './env-loader';

// Load environment variables
const env = loadEnvVars();

// Custom logger for the script
const logger = {
  info: (message: string) => console.log(`ℹ️ ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  warn: (message: string) => console.log(`⚠️ ${message}`),
  error: (message: string, error?: unknown) => console.error(`❌ ${message}`, error || ''),
};

// Configuration options
const options = {
  logger,
  siteUrl: env.SITE_URL || 'http://localhost:3000',
};

/**
 * Generate only the fallback OG image for CI
 */
export async function generateCIOGImage(): Promise<void> {
  logger.info('CI Build: Generating only fallback OG image...');

  try {
    // Generate only the fallback OG image
    await generateFallbackOGImage(options);
    logger.success('✅ CI: Fallback OG image generated successfully!');
  } catch (error) {
    logger.error('Error generating fallback OG image:', error);
    process.exit(1);
  }
}

// If script is run directly (not imported), run the main function
if (require.main === module) {
  generateCIOGImage()
    .then(() => {
      logger.success('🎉 CI: OG image generation completed');
    })
    .catch(error => {
      logger.error('Script failed:', error);
      process.exit(1);
    });
}
