import { getApiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

type ApiClient = ReturnType<typeof getApiClient>;
type ApiErrorPayload = {
  code?: string;
  message?: string;
  requestId?: string;
};

export type OwnerMatchCandidate =
  components["schemas"]["OwnerMatchCandidateResponseDto"];
export type OwnerMatchCandidatePage =
  components["schemas"]["OwnerMatchCandidatePageResponseDto"];

export class MatchCandidateApiError extends Error {
  readonly code: string;
  readonly requestId?: string;
  readonly status?: number;

  constructor(input: {
    code?: string;
    message: string;
    requestId?: string;
    status?: number;
  }) {
    super(input.message);
    this.name = "MatchCandidateApiError";
    this.code = input.code ?? "MATCH_CANDIDATE_REQUEST_FAILED";
    this.requestId = input.requestId;
    this.status = input.status;
  }
}

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
  try {
    const response = await operation();
    if (response.data === undefined) {
      throw new MatchCandidateApiError({
        message: "Máy chủ không trả về dữ liệu đối sánh.",
      });
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof MatchCandidateApiError) throw error;
    const candidate = error as {
      data?: ApiErrorPayload;
      message?: string;
      status?: number;
    };
    throw new MatchCandidateApiError({
      code: candidate.data?.code,
      message:
        candidate.data?.message ??
        candidate.message ??
        "Không thể xử lý kết quả đối sánh lúc này.",
      requestId: candidate.data?.requestId,
      status: candidate.status,
    });
  }
}
