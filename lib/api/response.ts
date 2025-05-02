import { NextResponse } from 'next/server';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * Create a successful API response
 * @param data The response data
 * @param meta Optional metadata
 * @param headers Optional response headers
 * @returns NextResponse with standardized structure
 */
export function apiSuccess<T>(
  data: T,
  meta?: Record<string, unknown>,
  headers?: Record<string, string>
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };

  // Only include headers in options if they are provided
  return headers ? NextResponse.json(response, { headers }) : NextResponse.json(response);
}

/**
 * Create an error API response
 * @param message Error message
 * @param code Error code
 * @param status HTTP status code
 * @param details Additional error details
 * @returns NextResponse with standardized structure
 */
export function apiError(
  message: string,
  code: string = 'ERROR',
  status: number = 500,
  details?: unknown
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      ...(details ? { details } : {}),
    },
  };

  return NextResponse.json(response, { status });
}

/**
 * Create a validation error API response
 * @param fieldErrors Validation errors by field
 * @param message Overall error message
 * @returns NextResponse with validation errors
 */
export function apiValidationError(
  fieldErrors: Record<string, string>,
  message: string = 'Validation failed'
): NextResponse {
  return apiError(message, 'VALIDATION_ERROR', 400, { fieldErrors });
}
