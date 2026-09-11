import { ApiRequestError, toApiRequestError } from "./normalize-api-error";

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
      throw new ApiRequestError(
        {
          code: "EMPTY_API_RESPONSE",
          fieldErrors: {},
          kind: "system",
          message: options.emptyMessage,
        },
        {
          code: "EMPTY_API_RESPONSE",
          message: options.emptyMessage,
        },
      );
    }
    return response.data;
  } catch (error) {
    throw toApiRequestError(error, options.fallback);
  }
}
