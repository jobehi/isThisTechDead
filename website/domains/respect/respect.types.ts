/**
 * Respect entry data
 */
export interface RespectEntry {
  tech_id: string;
  tech_name: string;
}

/**
 * Map of tech IDs to respect counts
 */
export type RespectCountsMap = Record<string, number>;

/**
 * Service response for a respect count
 */
export interface RespectCountResponse {
  success: boolean;
  count: number | null;
  error?: string;
  message?: string;
  disabled?: boolean;
}

/**
 * Service response for all respect counts
 */
export interface RespectCountsResponse {
  success: boolean;
  counts: RespectCountsMap;
  error?: string;
}

/**
 * Validation error issue
 */
export interface ValidationIssue {
  path: string[];
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: ValidationError;
}

/**
 * Validation error
 */
export interface ValidationError {
  issues: ValidationIssue[];
}

/**
 * Request payload for paying respects
 */
export interface PayRespectInput {
  techId: string;
  techName: string;
}

/**
 * Get respect count request
 */
export interface GetRespectCountInput {
  techId: string;
}

/**
 * Validator for get respect count request
 */
export const GetRespectCountValidator = {
  validate(data: GetRespectCountInput): ValidationResult<GetRespectCountInput> {
    if (!data || !data.techId) {
      return {
        success: false,
        error: {
          issues: [{ path: ['techId'], message: 'Tech ID is required' }],
        },
      };
    }
    return { success: true, data: { techId: data.techId } };
  },
};

/**
 * Validator for pay respect request
 */
export const PayRespectValidator = {
  validate(data: PayRespectInput): ValidationResult<PayRespectInput> {
    if (!data) {
      return {
        success: false,
        error: {
          issues: [{ path: ['body'], message: 'Request body is required' }],
        },
      };
    }

    const errors: ValidationIssue[] = [];

    if (!data.techId) {
      errors.push({ path: ['techId'], message: 'Tech ID is required' });
    }

    if (!data.techName) {
      errors.push({ path: ['techName'], message: 'Tech name is required' });
    }

    if (errors.length > 0) {
      return { success: false, error: { issues: errors } };
    }

    return {
      success: true,
      data: {
        techId: data.techId,
        techName: data.techName,
      },
    };
  },
};

/**
 * API response interfaces for standardized format
 */

export interface ApiSuccessResponse<T> {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
