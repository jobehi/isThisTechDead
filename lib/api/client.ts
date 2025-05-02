/**
 * API Client
 *
 * A typed fetch wrapper with interceptors and retry logic.
 */

type RequestInterceptor = (request: Request) => Request | Promise<Request>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    retryStatusCodes: number[];
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Creates an API client with interceptors and retry logic
 */
export function createApiClient(config: ApiClientConfig) {
  const {
    baseURL,
    headers = {},
    requestInterceptors = [],
    responseInterceptors = [],
    retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
    },
  } = config;

  /**
   * Makes an API request with retry logic
   */
  async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

    // Apply default headers
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Merge with user provided headers
    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Create the request
    let request = new Request(fullUrl, mergedOptions);

    // Apply request interceptors
    for (const interceptor of requestInterceptors) {
      request = await interceptor(request);
    }

    // Execute fetch with retry logic
    let response: Response | null = null;
    let error: Error | null = null;
    let retries = 0;

    while (retries <= retryConfig.maxRetries) {
      try {
        response = await fetch(request.clone());

        // Check if we should retry based on status code
        if (
          retryConfig.retryStatusCodes.includes(response.status) &&
          retries < retryConfig.maxRetries
        ) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * retries));
          continue;
        }

        break;
      } catch (err) {
        error = err as Error;

        if (retries < retryConfig.maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * retries));
        } else {
          break;
        }
      }
    }

    // Handle network errors
    if (error) {
      throw new ApiError(`Network error: ${error.message}`, 0);
    }

    if (!response) {
      throw new ApiError('No response received', 0);
    }

    // Apply response interceptors
    let result = response;
    for (const interceptor of responseInterceptors) {
      result = await interceptor(result);
    }

    // If we have Response object after interceptors, parse JSON
    if (result instanceof Response) {
      if (!result.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await result.json();
        } catch {
          errorData = { message: result.statusText };
        }

        throw new ApiError(
          errorData.message || `API Error: ${result.status}`,
          result.status,
          errorData
        );
      }

      // For 204 No Content
      if (result.status === 204) {
        return null as unknown as T;
      }

      return (await result.json()) as T;
    }

    return result as T;
  }

  /**
   * HTTP methods
   */
  return {
    get<T>(url: string, options?: RequestInit) {
      return request<T>(url, { ...options, method: 'GET' });
    },

    post<T>(url: string, data?: unknown, options?: RequestInit) {
      const requestOptions = {
        ...options,
        method: 'POST',
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      } else {
        requestOptions.body = null;
      }

      return request<T>(url, requestOptions);
    },

    put<T>(url: string, data?: unknown, options?: RequestInit) {
      const requestOptions = {
        ...options,
        method: 'PUT',
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      } else {
        requestOptions.body = null;
      }

      return request<T>(url, requestOptions);
    },

    patch<T>(url: string, data?: unknown, options?: RequestInit) {
      const requestOptions = {
        ...options,
        method: 'PATCH',
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      } else {
        requestOptions.body = null;
      }

      return request<T>(url, requestOptions);
    },

    delete<T>(url: string, options?: RequestInit) {
      return request<T>(url, { ...options, method: 'DELETE' });
    },
  };
}

// Create and export the default API client instance
export const apiClient = createApiClient({
  baseURL: '/api',
  responseInterceptors: [
    // Default response handling
    async response => {
      // For non-OK responses, let the main flow handle errors
      if (!response.ok) return response;

      // Otherwise proceed with the response
      return response;
    },
  ],
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
  },
});
