import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';
import config from '@/lib/config';

// Force Node.js runtime instead of Edge runtime to ensure consistent behavior
export const runtime = 'nodejs';

// Ensure route is not cached or statically generated
export const dynamic = 'force-dynamic';

// Rate limiting - Map to track submissions by IP
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    // Check if feature flag is enabled
    if (!config.features.enableProjectSubmission) {
      return NextResponse.json(
        { error: 'Project submissions are currently disabled' },
        { status: 403 }
      );
    }

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    if (rateLimitMap.has(ip)) {
      const rateLimitData = rateLimitMap.get(ip)!;

      // Reset if window has passed
      if (now - rateLimitData.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      } else if (rateLimitData.count >= MAX_SUBMISSIONS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Too many submissions. Try again later.' },
          { status: 429 }
        );
      } else {
        rateLimitMap.set(ip, {
          count: rateLimitData.count + 1,
          timestamp: rateLimitData.timestamp,
        });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // Parse form data
    const formData = await request.formData();

    const techId = formData.get('techId') as string;
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const description = formData.get('description') as string;
    const selfRoast = formData.get('selfRoast') as string;
    const recaptchaToken = formData.get('recaptchaToken') as string;

    // Basic validation
    if (!techId || !name || !description || !selfRoast) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify reCAPTCHA token if provided
    if (recaptchaToken) {
      try {
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (recaptchaSecretKey) {
          const verificationResponse = await fetch(
            'https://www.google.com/recaptcha/api/siteverify',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                secret: recaptchaSecretKey,
                response: recaptchaToken,
              }).toString(),
            }
          );

          const verificationResult = await verificationResponse.json();

          // Check if verification was successful
          if (!verificationResult.success || verificationResult.score < 0.5) {
            return NextResponse.json(
              { error: 'Bot activity detected. Please try again.' },
              { status: 403 }
            );
          }
        }
      } catch {
        // Continue without reCAPTCHA if verification fails
      }
    }

    // Process screenshot if provided
    let screenshotUrl: string | null = null;
    const screenshotEntry = formData.get('screenshot');

    if (screenshotEntry) {
      try {
        // Handle File/Blob from FormData
        let screenshot: Blob;
        let filename = 'upload.jpg';
        let contentType = 'image/jpeg';

        if (
          typeof screenshotEntry === 'object' &&
          screenshotEntry !== null &&
          'size' in screenshotEntry &&
          'type' in screenshotEntry
        ) {
          // It's a File/Blob object
          screenshot = screenshotEntry as unknown as Blob;
          const fileObj = screenshotEntry as unknown as {
            name?: string;
            size: number;
            type: string;
          };

          filename = fileObj.name || 'upload.jpg';
          contentType = fileObj.type || 'image/jpeg';
        } else {
          // Unknown screenshot type, can't proceed
          return NextResponse.json({ error: 'Invalid screenshot format' }, { status: 400 });
        }

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) {
          return NextResponse.json(
            { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
            { status: 400 }
          );
        }

        // Generate a random filename with proper extension
        const fileExt = filename.split('.').pop() || 'jpg';
        const randomFilename = `${randomUUID()}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('project-screenshots')
          .upload(randomFilename, screenshot, {
            cacheControl: '3600',
            upsert: true,
            contentType,
          });

        if (uploadError) {
          return NextResponse.json(
            { error: `Failed to upload screenshot: ${uploadError.message}` },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('project-screenshots')
          .getPublicUrl(randomFilename);

        screenshotUrl = publicUrlData.publicUrl;
      } catch (uploadException) {
        return NextResponse.json(
          {
            error: `Screenshot upload failed: ${uploadException instanceof Error ? uploadException.message : 'Unknown error'}`,
          },
          { status: 500 }
        );
      }
    }

    // Insert submission into database
    const { error } = await supabase
      .from('tech_projects')
      .insert({
        tech_id: techId,
        name,
        url: url || null,
        github_url: githubUrl || null,
        description,
        self_roast: selfRoast,
        screenshot_url: screenshotUrl,
        is_approved: false,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: 'Failed to submit project' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Project submitted successfully and will be reviewed by our team.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Just like your favorite framework.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch approved projects for a specific tech
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const techId = url.searchParams.get('techId');

    if (!techId) {
      return NextResponse.json({ error: 'Tech ID is required' }, { status: 400 });
    }

    // Fetch approved projects for this tech
    const { data, error } = await supabase
      .from('tech_projects')
      .select('*')
      .eq('tech_id', techId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({ projects: data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
