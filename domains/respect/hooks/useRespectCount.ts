'use client';

import { useApiData } from '@/lib/hooks';
import { ApiResponse, ApiSuccessResponse } from '../respect.types';

/**
 * Hook to get respect count for a tech
 * @param techId The tech ID to get the count for
 * @returns Object with respect count, loading state, and error
 */
export function useRespectCount(techId: string | null) {
  const response = useApiData<ApiResponse<{ count: number | null }>>(
    techId ? `/respect?techId=${techId}` : null,
    {
      initialData: { success: false, data: { count: null } } as ApiSuccessResponse<{
        count: number | null;
      }>,
      enabled: !!techId,
    }
  );

  // Create a derived state that maps to the old response format for backward compatibility
  const compatResponse = {
    ...response,
    data: response.data
      ? {
          success: response.data.success,
          count: 'data' in response.data ? (response.data.data?.count ?? null) : null,
        }
      : { success: false, count: null },
  };

  return compatResponse;
} 