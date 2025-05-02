import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { TechService } from '@/domains/tech';
import { safeToFixed } from '@/lib/shared';
import { generateTechOGImage } from '@/lib/shared/server';
import config from '@/lib/config';

// Logger for OG image generation
const logger = {
  info: (message: string) => console.log(`🔍 ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string, error?: unknown) => console.error(`❌ ${message}`, error),
};

export async function POST(request: NextRequest) {
  try {
    // Extract the path to revalidate from the request
    const data = await request.json();
    const path = data.path || '/';
    const secret = data.secret;

    console.log(`🔄 Received revalidation request for path: ${path}`);

    // Direct env var check for revalidation secret
    const revalidationSecret = config.security.revalidationSecret;
    if (!secret || secret !== revalidationSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    // Check if this is a tech page
    const techSlugMatch = path.match(/^\/([a-zA-Z0-9-]+)$/);

    if (techSlugMatch) {
      const techSlug = techSlugMatch[1];
      console.log(`🔍 Detected tech page: ${techSlug}`);

      try {
        // Get the tech details to extract the current score
        console.log(`🔍 Fetching tech details for: ${techSlug}`);
        const { tech, snapshots } = await TechService.getTechDetails(techSlug);

        if (tech && snapshots && snapshots.length > 0) {
          const latestSnapshot = snapshots[0];
          // Add null check before accessing properties
          const score = latestSnapshot?.deaditude_score
            ? latestSnapshot.deaditude_score * 10
            : null;
          const scoreFormatted = score !== null ? safeToFixed(score) : 'Unknown';

          console.log(`🔍 Generating OG image for ${tech.name} with score ${scoreFormatted}`);
          // Generate a new OG image for this tech using the server action
          await generateTechOGImage(tech.name, score, {
            logger,
            siteUrl: config.site.url,
          });
          console.log(`✅ OG image generation complete`);
        } else {
          console.log(`⚠️ No tech data or snapshots found for ${techSlug}`);
        }
      } catch (error) {
        // Continue with revalidation even if image generation fails
        console.error(`❌ Error generating OG image for ${techSlugMatch[1]}:`, error);
      }
    }

    // Revalidate the specific path
    console.log(`🔄 Calling revalidatePath for: ${path}`);
    revalidatePath(path);
    console.log(`✅ Path revalidation complete`);

    return NextResponse.json({
      revalidated: true,
      message: `Path ${path} revalidated successfully`,
      now: Date.now(),
    });
  } catch (error) {
    console.error('❌ Unhandled error in revalidation:', error);
    return NextResponse.json(
      { message: 'Error revalidating path', error: String(error) },
      { status: 500 }
    );
  }
}
