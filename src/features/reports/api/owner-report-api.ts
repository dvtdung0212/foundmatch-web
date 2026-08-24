import { getApiClient } from "@/lib/api/client";
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client";

import type {
  OwnerReportApi,
  PrivateFactInput,
  ReportAttributeAnswerInput,
  ReportLocationInput,
  ReportSubmissionInput,
} from "./report-submission";
import { mapOwnerReportView, type OwnerReportView } from "./owner-report-view";

type ApiClient = ReturnType<typeof getApiClient>;

type ApiErrorPayload = {
  code?: string;
  details?: { field?: string } & Record<string, unknown>;
  message?: string;
  requestId?: string;
};

export class ReportApiError extends Error {
  readonly code: string;
  readonly field?: string;
  readonly requestId?: string;
  readonly status?: number;

  constructor(input: {
    code?: string;
    field?: string;
    message: string;
    requestId?: string;
    status?: number;
  }) {
    super(input.message);
    this.name = "ReportApiError";
    this.code = input.code ?? "REPORT_REQUEST_FAILED";
    this.field = input.field;
    this.requestId = input.requestId;
    this.status = input.status;
  }
}

function toReportApiError(error: unknown): ReportApiError {
  if (error instanceof ReportApiError) return error;

  const candidate = error as {
    data?: ApiErrorPayload;
    message?: string;
    status?: number;
  };
  const payload = candidate?.data;
  return new ReportApiError({
    code: payload?.code,
    field: payload?.details?.field,
    message:
      payload?.message ??
      candidate?.message ??
      "Không thể xử lý báo cáo lúc này.",
    requestId: payload?.requestId,
    status: candidate?.status,
  });
}

function requireData<T>(data: T | undefined): T {
  if (data === undefined) {
    throw new ReportApiError({
      message: "Máy chủ không trả về dữ liệu báo cáo.",
    });
  }
  return data;
}

async function call<T>(operation: () => Promise<{ data?: T }>): Promise<T> {
  try {
    const response = await operation();
    return requireData(response.data);
  } catch (error) {
    throw toReportApiError(error);
  }
}

export function createOwnerReportApi(client: ApiClient): OwnerReportApi {
  return {
    async getFormConfiguration(categoryId, type) {
      return call(() =>
        client.GET("/api/v1/public/categories/{id}/report-form", {
          params: { path: { id: categoryId }, query: { reportType: type } },
        }),
      );
    },
    async createDraft(input, idempotencyKey) {
      return call(() =>
        client.POST("/api/v1/public/item-declarations", {
          body: {
            ...input,
            eventTimezone: "Asia/Ho_Chi_Minh",
          },
          params: {
            header: { "Idempotency-Key": idempotencyKey },
          },
        }),
      );
    },

    async replaceLocations(declarationId, expectedVersion, locations) {
      return call(() =>
        client.PUT("/api/v1/public/item-declarations/{id}/locations", {
          body: { expectedVersion, locations } as never,
          params: { path: { id: declarationId } },
        }),
      );
    },

    async replaceAttributes(declarationId, expectedVersion, answers) {
      return call(() =>
        client.PUT("/api/v1/public/item-declarations/{id}/attributes", {
          body: { expectedVersion, answers },
          params: { path: { id: declarationId } },
        }),
      );
    },

    async replacePrivateFacts(declarationId, expectedVersion, facts) {
      return call(() =>
        client.PUT("/api/v1/public/item-declarations/{id}/private-facts", {
          body: { expectedVersion, facts },
          params: { path: { id: declarationId } },
        }),
      );
    },

    async uploadMedia(declarationId, expectedVersion, file) {
      const body = new FormData();
      body.set("expectedVersion", String(expectedVersion));
      body.set("file", file);

      return call(() =>
        client.POST("/api/v1/public/item-declarations/{id}/media", {
          body: body as never,
          bodySerializer: (value) => value as unknown as FormData,
          params: { path: { id: declarationId } },
        }),
      );
    },

    async submit(declarationId, expectedVersion, idempotencyKey) {
      return call(() =>
        client.POST("/api/v1/public/item-declarations/{id}/submit", {
          body: { expectedVersion },
          params: {
            header: { "Idempotency-Key": idempotencyKey },
            path: { id: declarationId },
          },
        }),
      );
    },
  };
}

export async function createAuthenticatedOwnerReportApi(): Promise<OwnerReportApi> {
  const client = await getAuthenticatedApiClient();
  return createOwnerReportApi(client);
}

async function getAuthenticatedApiClient(): Promise<ApiClient> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new ReportApiError({
      code: "UNAUTHORIZED",
      message: "Bạn cần đăng nhập để tạo báo cáo.",
      status: 401,
    });
  }

  return getApiClient(session.access_token);
}

export async function getAuthenticatedOwnerReportView(
  declarationId: string,
): Promise<OwnerReportView> {
  const client = await getAuthenticatedApiClient();
  const [report, privateFacts] = await Promise.all([
    call(() =>
      client.GET("/api/v1/public/item-declarations/{id}", {
        params: { path: { id: declarationId } },
      }),
    ),
    call(() =>
      client.GET("/api/v1/public/item-declarations/{id}/private-facts", {
        params: { path: { id: declarationId } },
      }),
    ),
  ]);

  return mapOwnerReportView(report, privateFacts);
}

export type ReportCategoryOption = {
  id: string;
  name: string;
  scope: "lost" | "found" | "both";
};

export async function listReportCategories(
  type: ReportSubmissionInput["type"],
): Promise<ReportCategoryOption[]> {
  const categories = await call(() =>
    getApiClient().GET("/api/v1/public/categories"),
  );
  const scope = type.toLowerCase();
  return categories
    .filter((category) => category.scope === "both" || category.scope === scope)
    .map(({ id, name, scope: categoryScope }) => ({
      id,
      name,
      scope: categoryScope,
    }));
}

export type {
  PrivateFactInput,
  ReportAttributeAnswerInput,
  ReportLocationInput,
};
