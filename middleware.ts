import { NextResponse, NextRequest } from 'next/server';
import { rateLimitRequest } from './lib/rateLimit';
import { verifyCSRFProtection, createCSRFErrorResponse } from './lib/csrf';

// Define paths that should be protected by the middleware
const apiRoutes = ['/api/revalidate'];

export async function middleware(request: NextRequest) {
  // Debug header for /api/projects POST
  if (request.nextUrl.pathname === '/api/projects' && request.method === 'POST') {
    const res = NextResponse.next();
    res.headers.set('x-debug-mode', process.env.NODE_ENV || 'unknown');
    return res;
  }

  // CSRF protection for all API routes except exempt ones
  const exemptFromCSRF = [
    '/api/projects',
    '/api/respect',
    '/api/respect/counts',
    '/api/revalidate',
  ];
  const path = request.nextUrl.pathname;
  if (
    !exemptFromCSRF.some(route => path === route || path.startsWith(route)) &&
    !verifyCSRFProtection(request)
  ) {
    return createCSRFErrorResponse();
  }

  // Rate limiting on /api/revalidate
  if (apiRoutes.some(route => path.startsWith(route))) {
    const rateLimitResponse = await rateLimitRequest(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  return NextResponse.next();
}

// Only run middleware on API routes
export const config = {
  matcher: ['/api/:path*'],
};
