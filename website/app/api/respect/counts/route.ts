import { RespectService } from '@/domains/respect';
import { apiSuccess, apiError } from '@/lib/api/response';
import { AppError } from '@/lib/errors';

// Force Node.js runtime to ensure consistency
export const runtime = 'nodejs';

// Initialize the service
const respectService = new RespectService();

// GET handler to retrieve all tech respect counts
export async function GET() {
  try {
    // Get all respect counts using our domain service
    const response = await respectService.getAllRespectCounts();

    if (!response.success) {
      return apiError(
        response.error || 'Failed to get respect counts',
        'RESPECT_COUNTS_ERROR',
        500
      );
    }

    // Cache for 1 hour
    const headers = {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
    };

    return apiSuccess(
      { counts: response.counts },
      { requestTimestamp: new Date().toISOString() },
      headers
    );
  } catch (error) {
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.status, error.data);
    }

    return apiError('Failed to process request', 'SERVER_ERROR', 500);
  }
}
