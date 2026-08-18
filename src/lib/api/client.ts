import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Tạo một instance của API Client được cấu hình sẵn base URL.
 * Nếu có accessToken, sẽ thêm vào Authorization header.
 */
export function getApiClient(accessToken?: string) {
  return createClient<paths>({
    baseUrl: apiBaseUrl,
    fetch: async (request: RequestInfo | URL, init?: RequestInit) => {
      const apiRequest = new Request(request, init);
      const headers = new Headers(apiRequest.headers);

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      const response = await globalThis.fetch(
        new Request(apiRequest, { credentials: "omit", headers })
      );

      // Xử lý lỗi chuẩn
      if (!response.ok) {
        let errorPayload: unknown;
        try {
          errorPayload = await response.clone().json();
        } catch {
          errorPayload = { message: response.statusText };
        }

        const message =
          typeof errorPayload === "object" &&
          errorPayload !== null &&
          "message" in errorPayload &&
          typeof errorPayload.message === "string"
            ? errorPayload.message
            : `Lỗi API ${response.status}`;
            
        const apiError = new Error(message) as Error & {
          data: unknown;
          status: number;
        };
        apiError.status = response.status;
        apiError.data = errorPayload;
        throw apiError;
      }

      return response;
    },
  });
}

/**
 * Hàm hỗ trợ lấy API Client kèm token của session hiện tại trên Server.
 * Hàm này dùng trong Server Actions hoặc Server Components.
 */
export async function getServerApiClient() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return getApiClient(session?.access_token);
}
