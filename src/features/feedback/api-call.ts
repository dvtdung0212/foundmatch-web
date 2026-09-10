import { ApiRequestError, normalizeApiError, toApiRequestError } from "./normalize-api-error";

interface ApiCallOptions {
  emptyMessage: string;
  fallback: string;
}

export async function callApi<T>(
  operation: () => Promise<{ data?: T }>,
  options: ApiCallOptions,
): Promise<T> {
  try {
    const response = await operation();
    if (response.data === undefined) {
      const error = normalizeApiError({
        code: "EMPTY_API_RESPONSE",
        message: options.emptyMessage,
      });
      throw new ApiRequestError(error, {
        code: error.code,
        message: error.message,
      });
    }
    return response.data;
  } catch (error) {
    throw toApiRequestError(error, options.fallback);
  }
}

