import { getApiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";
import { ApiRequestError, callApi } from "@/features/feedback";

type ApiClient = ReturnType<typeof getApiClient>;
export type OwnerMatchCandidate =
  components["schemas"]["OwnerMatchCandidateResponseDto"];
export type OwnerMatchCandidatePage =
  components["schemas"]["OwnerMatchCandidatePageResponseDto"];

export { ApiRequestError as MatchCandidateApiError };

export function createOwnerMatchCandidateApi(client: ApiClient) {
  const action = (
    candidateId: string,
    command: "save" | "unsave" | "dismiss" | "restore",
    idempotencyKey: string,
  ) =>
    call(() =>
      client.POST(`/api/v1/public/match-candidates/{id}/${command}`, {
        params: {
          header: { "Idempotency-Key": idempotencyKey },
          path: { id: candidateId },
        },
      }),
    );

  return {
    dismiss: (candidateId: string, idempotencyKey: string) =>
      action(candidateId, "dismiss", idempotencyKey),
    get: (candidateId: string) =>
      call(() =>
        client.GET("/api/v1/public/match-candidates/{id}", {
          params: { path: { id: candidateId } },
        }),
      ),
    list: (declarationId: string, page = 1, pageSize = 20) =>
      call(() =>
        client.GET("/api/v1/public/item-declarations/{id}/matches", {
          params: {
            path: { id: declarationId },
            query: { page, pageSize },
          },
        }),
      ),
    restore: (candidateId: string, idempotencyKey: string) =>
      action(candidateId, "restore", idempotencyKey),
    save: (candidateId: string, idempotencyKey: string) =>
      action(candidateId, "save", idempotencyKey),
    unsave: (candidateId: string, idempotencyKey: string) =>
      action(candidateId, "unsave", idempotencyKey),
  };
}

export async function getAuthenticatedOwnerMatchCandidateApi() {
  return createOwnerMatchCandidateApi(getApiClient());
}

async function call<T>(operation: () => Promise<{ data?: T }>): Promise<T> {
  return callApi(operation, {
    emptyMessage: "Máy chủ không trả về dữ liệu đối sánh.",
    fallback: "Không thể xử lý kết quả đối sánh lúc này.",
  });
}
