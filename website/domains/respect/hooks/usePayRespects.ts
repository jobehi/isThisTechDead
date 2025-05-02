'use client';

import { useApiMutation } from '@/lib/hooks';
import { ApiResponse } from '../respect.types';

/**
 * Hook to pay respects to a tech
 * @returns Object with submit function, loading state, and result
 */
export function usePayRespects() {
  const mutation = useApiMutation<
    { techId: string; techName: string },
    ApiResponse<{ count: number | null }>
  >('/respect');

  // Create a wrapper function that converts the response to the old format
  const wrappedSubmit = async (params: { techId: string; techName: string }) => {
    const result = await mutation.submit(params);
    if (result) {
      return {
        success: result.success,
        count: 'data' in result ? (result.data?.count ?? null) : null,
      };
    }
    return null;
  };

  return {
    ...mutation,
    submit: wrappedSubmit,
    data: mutation.data
      ? {
          success: mutation.data.success,
          count: 'data' in mutation.data ? (mutation.data.data?.count ?? null) : null,
          disabled:
            !mutation.data.success &&
            'error' in mutation.data &&
            mutation.data.error?.code === 'FEATURE_DISABLED',
        }
      : null,
  };
}
