import { NextRequest } from 'next/server';
import { RespectService } from '@/domains/respect';
import { GetRespectCountValidator, PayRespectValidator } from '@/domains/respect';
import { apiSuccess, apiError, apiValidationError } from '@/lib/api/response';
import { AppError } from '@/lib/errors';

// Force Node.js runtime to ensure consistency
export const runtime = 'nodejs';

// Initialize the service
const respectService = new RespectService();

// GET handler to retrieve the total respect count
export async function GET(request: NextRequest) {
  try {
    console.log('GET request received');

    // Extract the query parameter from the URL
    const { searchParams } = new URL(request.url);
    const techId = searchParams.get('techId');

    if (!techId) {
      console.error('Missing techId in query parameters');
      return apiError('Missing techId in query parameters', 'MISSING_TECH_ID', 400);
    }

    console.log('Extracted techId:', techId);

    // Validate the request
    const result = GetRespectCountValidator.validate({ techId });
    if (!result.success) {
      console.error('Validation failed:', result.error);
      return apiValidationError(
        Object.fromEntries(
          result.error!.issues.map(issue => [issue.path.join('.'), issue.message])
        ),
        'Invalid request parameters'
      );
    }

    // Get the respect count using our domain service
    const response = await respectService.getRespectCount(result.data!.techId);

    if (!response.success) {
      console.error('Failed to get respect count:', response.error);
      return apiError(response.error || 'Failed to get respect count', 'RESPECT_COUNT_ERROR', 500);
    }

    console.log('Respect count retrieved successfully:', response.count);
    return apiSuccess({ count: response.count });
  } catch (error) {
    console.error('Unexpected error in GET handler:', error);
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.status, error.data);
    }

    return apiError('An unexpected error occurred', 'SERVER_ERROR', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    // Validate the request
    const result = PayRespectValidator.validate(body);
    if (!result.success) {
      console.error('Validation failed:', result.error);
      return apiValidationError(
        Object.fromEntries(
          result.error!.issues.map(issue => [issue.path.join('.'), issue.message])
        ),
        'Invalid request data'
      );
    }

    const { techId, techName } = result.data!;

    // Use our domain service to pay respects
    const response = await respectService.payRespects(techId, techName);

    if (!response.success) {
      console.error('Failed to pay respects:', response.error);
      // Handle disabled feature
      if (response.disabled) {
        return apiError(response.message || 'Feature is disabled', 'FEATURE_DISABLED', 403);
      }

      return apiError(response.error || 'Failed to pay respects', 'RESPECT_ERROR', 500);
    }

    console.log('Respect paid successfully. New count:', response.count);
    return apiSuccess({ count: response.count });
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    if (error instanceof AppError) {
      return apiError(error.message, error.code, error.status, error.data);
    }

    return apiError('An unexpected error occurred', 'SERVER_ERROR', 500);
  }
}
