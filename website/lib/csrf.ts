/**
 * Simple CSRF protection for API routes
 *
 * This implementation uses the Origin and Referer headers to verify that the request
 * is coming from the same site. While not as secure as token-based CSRF protection,
 * it provides a basic level of protection for API routes.
 */

import { NextRequest } from 'next/server';
import { config } from './config';

// List of allowed origins (including your own domain)
const allowedOrigins = [
  'https://isthistechdead.com',
  'https://www.isthistechdead.com',
  config.site.url,
  // Add any other domains that should be allowed to make requests
];

// In development, also allow localhost
if (config.isDevelopment) {
  allowedOrigins.push('http://localhost:3000');
}

/**
 * Verifies that a request includes proper CSRF protections
 * by checking Origin and Referer headers against allowed origins
 *
 * @param request The incoming request
 * @returns boolean indicating if the request passes CSRF protection
 */
export function verifyCSRFProtection(request: NextRequest): boolean {
  // Get the Origin header
  const origin = request.headers.get('origin');

  // Get the Referer header as fallback
  const referer = request.headers.get('referer');

  // Check for POST, PUT, DELETE, or PATCH requests
  const method = request.method.toUpperCase();
  const isMutationMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

  // Only enforce CSRF protection for mutation methods
  if (!isMutationMethod) {
    return true;
  }

  // Check Origin header first (more reliable)
  if (origin) {
    return allowedOrigins.some(allowedOrigin => origin === allowedOrigin);
  }

  // Fallback to Referer header
  if (referer) {
    return allowedOrigins.some(allowedOrigin => referer.startsWith(allowedOrigin));
  }

  // If neither header is present, reject the request
  return false;
}

/**
 * Creates a response for CSRF validation failure
 *
 * @returns Response with 403 Forbidden status
 */
export function createCSRFErrorResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'Forbidden',
      message: 'CSRF validation failed',
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
