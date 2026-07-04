'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

/**
 * Generic hook for fetching data from an API endpoint
 *
 * @param url - The API endpoint URL
 * @param options - Options for the hook
 * @param dependencies - Dependencies array to trigger refetch
 * @returns Object with data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useApiData<TechDetails>(
 *   `/api/techs/${techId}`,
 *   { initialData: null }
 * );
 * ```
 */
export function useApiData<T>(
  url: string | null,
  options: {
    initialData?: T;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {},
  dependencies: unknown[] = []
) {
  const { initialData, enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<T>(url);
      setData(response);
      onSuccess?.(response);
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error('An error occurred while fetching data');
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Generic hook for posting data to an API endpoint
 *
 * @param url - The API endpoint URL
 * @param options - Options for the hook
 * @returns Object with mutation state and submit function
 *
 * @example
 * ```tsx
 * const { submit, isSubmitting, error, data } = useApiMutation<ProjectInput, ProjectResponse>(
 *   '/api/projects'
 * );
 *
 * // Usage
 * const handleSubmit = async (formData) => {
 *   const result = await submit(formData);
 *   if (result) {
 *     // Success
 *   }
 * };
 * ```
 */
export function useApiMutation<TInput, TOutput = unknown>(
  url: string,
  options: {
    onSuccess?: (data: TOutput) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<TOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = useCallback(
    async (inputData: TInput): Promise<TOutput | null> => {
      try {
        setIsSubmitting(true);
        setError(null);
        setFieldErrors({});

        const response = await apiClient.post<TOutput>(url, inputData);
        setData(response);
        onSuccess?.(response);
        return response;
      } catch (err) {
        // Check for validation errors
        interface ValidationError {
          data: {
            fieldErrors?: Record<string, string>;
          };
        }

        if (err && typeof err === 'object' && 'data' in err) {
          const errorData = (err as ValidationError).data;
          if (errorData?.fieldErrors) {
            setFieldErrors(errorData.fieldErrors);
          }
        }

        const errorObj =
          err instanceof Error ? err : new Error('An error occurred while submitting data');
        setError(errorObj);
        onError?.(errorObj);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [url, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setFieldErrors({});
  }, []);

  return { submit, isSubmitting, data, error, fieldErrors, reset };
}
