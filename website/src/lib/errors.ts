/**
 * Error Handling
 *
 * Centralized error types and handling for the application.
 */

// Base application error class
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public data?: unknown
  ) {
    super(message);
    this.name = 'AppError';

    // Ensures proper stack trace in modern browsers
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  // Factory methods for common error types
  static badRequest(message: string, data?: unknown) {
    return new AppError(message, 'BAD_REQUEST', 400, data);
  }

  static unauthorized(message: string = 'Unauthorized', data?: unknown) {
    return new AppError(message, 'UNAUTHORIZED', 401, data);
  }

  static forbidden(message: string = 'Forbidden', data?: unknown) {
    return new AppError(message, 'FORBIDDEN', 403, data);
  }

  static notFound(message: string = 'Not found', data?: unknown) {
    return new AppError(message, 'NOT_FOUND', 404, data);
  }

  static conflict(message: string, data?: unknown) {
    return new AppError(message, 'CONFLICT', 409, data);
  }

  static tooManyRequests(message: string = 'Too many requests', data?: unknown) {
    return new AppError(message, 'TOO_MANY_REQUESTS', 429, data);
  }

  static serverError(message: string = 'Internal server error', data?: unknown) {
    return new AppError(message, 'SERVER_ERROR', 500, data);
  }

  static serviceUnavailable(message: string = 'Service unavailable', data?: unknown) {
    return new AppError(message, 'SERVICE_UNAVAILABLE', 503, data);
  }
}

// Database-specific error
export class DatabaseError extends AppError {
  constructor(
    message: string,
    public originalError: unknown,
    code: string = 'DATABASE_ERROR'
  ) {
    super(message, code, 500, originalError);
    this.name = 'DatabaseError';
  }
}

// Validation error with field-specific details
export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation error',
    public fieldErrors: Record<string, string> = {}
  ) {
    super(message, 'VALIDATION_ERROR', 400, { fieldErrors });
    this.name = 'ValidationError';
  }
}

// Error handler for API routes
export async function apiErrorHandler(
  error: unknown
): Promise<{ statusCode: number; body: unknown }> {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      statusCode: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
          ...(error.data ? { data: error.data } : {}),
        },
      },
    };
  }

  // Handle unexpected errors
  return {
    statusCode: 500,
    body: {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
  };
}

// Define a type for Supabase errors
interface SupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Convert Supabase errors to our error types
export function handleSupabaseError(error: SupabaseError | unknown, operation: string): never {
  // Pattern match common Supabase error messages
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String(error.message) || 'Unknown database error'
      : 'Unknown database error';
  const errorCode =
    typeof error === 'object' && error && 'code' in error ? String(error.code) : undefined;

  if (message.includes('not found') || errorCode === 'PGRST116') {
    throw AppError.notFound(`${operation}: Resource not found`);
  }

  if (message.includes('duplicate') || errorCode === '23505') {
    throw AppError.conflict(`${operation}: Resource already exists`);
  }

  if (message.includes('permission') || errorCode === '42501') {
    throw AppError.forbidden(`${operation}: Insufficient permissions`);
  }

  // Default to a generic database error
  throw new DatabaseError(`${operation} failed: ${message}`, error);
}
