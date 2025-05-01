import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
// NOTE: This will reset when the server restarts and doesn't work across multiple instances
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 1000 * 60 * 10; // 10 minutes
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 20; // 20 requests per minute

// Cleanup function
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.timestamp > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Rate limit a request based on the IP address
 * @param request NextRequest object
 * @returns Response or null if not rate limited
 */
export async function rateLimitRequest(request: NextRequest) {
  // Get IP address from request headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  // Add path to make rate limit specific to the endpoint
  const identifier = `${ip}:${request.nextUrl.pathname}`;

  const now = Date.now();

  // Get or create rate limit record
  let record = rateLimitStore.get(identifier);
  if (!record || now - record.timestamp > WINDOW_MS) {
    record = { count: 0, timestamp: now };
  }

  // Increment counter
  record.count += 1;
  rateLimitStore.set(identifier, record);

  // Check if over limit
  if (record.count > MAX_REQUESTS) {
    // Calculate reset time
    const resetTime = record.timestamp + WINDOW_MS;
    const remaining = Math.floor((resetTime - now) / 1000);

    // Return rate limited response
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
          'Retry-After': remaining.toString(),
        },
      }
    );
  }

  return null; // Not rate limited, continue with the request
}
