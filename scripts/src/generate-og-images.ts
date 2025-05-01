#!/usr/bin/env node

/**
 * This script generates static OG images by calling the existing /api/og route
 * and saving the results as static files. It's designed to be run as part of
 * the build process to ensure all OG images are pre-generated.
 */
import { calculateDeaditudeScore, ImageService } from '../../lib/shared';
import { loadEnvVars } from './env-loader';
import { getAllTechs } from './api';

// Load environment variables
const env = loadEnvVars();

// Custom logger for the script
const logger = {
  info: (message: string) => console.log(`ℹ️ ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  warn: (message: string) => console.log(`⚠️ ${message}`),
  error: (message: string, error?: unknown) => console.error(`❌ ${message}`, error || ''),
};

// Initialize the image service with our logger
const imageService = new ImageService({
  logger,
  siteUrl: env.SITE_URL || 'http://localhost:3000',
});

/**
 * Generate OG images for all technologies
 */
export async function generateAllOGImages(): Promise<void> {
  logger.info('Generating static OG images for all technologies...');

  try {
    // Generate fallback OG image first
    await imageService.generateFallbackOGImage();

    // Get all techs
    const techs = await getAllTechs();
    logger.info(`Found ${techs.length} technologies to process`);

    // Generate OG images for each tech
    let successCount = 0;
    let errorCount = 0;

    for (const tech of techs) {
      logger.info(`Processing: ${tech.name}`);

      const latest_score = tech.latest_score ? calculateDeaditudeScore(tech.latest_score) : null;

      // Get tech details including the score
      if (!latest_score) {
        logger.warn(`Could not find tech details for ${tech.name}`);
        errorCount++;
        continue;
      }

      try {
        // Generate image using our shared service
        await imageService.generateTechOGImage(tech.name, latest_score);
        successCount++;
      } catch (error) {
        logger.error(`Error generating OG image for ${tech.name}:`, error);
        errorCount++;
        // Continue with the next tech even if one fails
      }
    }

    logger.info(`OG image generation completed: ${successCount} successes, ${errorCount} errors`);
  } catch (error) {
    logger.error('Error generating OG images:', error);
    process.exit(1);
  }
}

// If script is run directly (not imported), run the main function
if (require.main === module) {
  generateAllOGImages()
    .then(() => {
      logger.success('🎉 All OG images generated successfully!');
    })
    .catch(error => {
      logger.error('Script failed:', error);
      process.exit(1);
    });
}
