import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { TechService } from '@/domains/tech';
import { safeToFixed } from '@/lib/shared';
import { generateTechOGImage } from '@/lib/shared/server';
import config from '@/lib/config';
import logger from '@/lib/logger';

// Logger for OG image generation
const ogLogger = {
  info: (message: string) => logger.debug(`🔍 ${message}`),
  success: (message: string) => logger.info(`✅ ${message}`),
  error: (message: string, error?: unknown) => logger.error(`❌ ${message}`, error),
};

export async function POST(request: NextRequest) {
  try {
    // Extract the path to revalidate from the request
    const data = await request.json();
    const path = data.path || '/';
    const secret = data.secret;

    logger.debug(`🔄 Received revalidation request for path: ${path}`);

    // Direct env var check for revalidation secret
    const revalidationSecret = config.security.revalidationSecret;
    if (!secret || secret !== revalidationSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    // Check if this is a tech page
    const techSlugMatch = path.match(/^\/([a-zA-Z0-9-]+)$/);

    if (techSlugMatch) {
      const techSlug = techSlugMatch[1];
      logger.debug(`🔍 Detected tech page: ${techSlug}`);

      try {
        // Get the tech details to extract the current score
        logger.debug(`🔍 Fetching tech details for: ${techSlug}`);
        const { tech, snapshots } = await TechService.getTechDetails(techSlug);

        if (tech && snapshots && snapshots.length > 0) {
          const latestSnapshot = snapshots[0];
          // Add null check before accessing properties
          const score = latestSnapshot?.deaditude_score
            ? latestSnapshot.deaditude_score * 10
            : null;
          const scoreFormatted = score !== null ? safeToFixed(score) : 'Unknown';

          logger.debug(`🔍 Generating OG image for ${tech.name} with score ${scoreFormatted}`);
          // Generate a new OG image for this tech using the server action
          await generateTechOGImage(tech.name, score, {
            logger: ogLogger,
            siteUrl: config.site.url,
          });
          logger.info(`✅ OG image generation complete`);
        } else {
          logger.warn(`⚠️ No tech data or snapshots found for ${techSlug}`);
        }
      } catch (error) {
        // Continue with revalidation even if image generation fails
        logger.error(`❌ Error generating OG image for ${techSlugMatch[1]}:`, error);
      }
    }

    // Revalidate the specific path
    logger.debug(`🔄 Calling revalidatePath for: ${path}`);
    revalidatePath(path);
    logger.info(`✅ Path revalidation complete`);

    return NextResponse.json({
      revalidated: true,
      message: `Path ${path} revalidated successfully`,
      now: Date.now(),
    });
  } catch (error) {
    logger.error('❌ Unhandled error in revalidation:', error);
    return NextResponse.json(
      { message: 'Error revalidating path', error: String(error) },
      { status: 500 }
    );
  }
}
