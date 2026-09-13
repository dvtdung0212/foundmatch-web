import { getApiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";
import { callApi } from "@/features/feedback";

export type UserActivityEvent = components["schemas"]["UserActivityEventResponseDto"];
export type UserActivityPage = components["schemas"]["UserActivityPageResponseDto"];
export type UserActivityCategory = UserActivityEvent["category"];

export interface ListUserActivityParams {
  category?: UserActivityCategory;
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
}

export async function listUserActivity(
  params: ListUserActivityParams = {},
): Promise<UserActivityPage> {
  const client = getApiClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  return callApi(
    () =>
      client.GET("/api/v1/public/activity-events", {
        params: {
          query: {
            category: params.category,
            page,
            pageSize,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
          },
        },
      }),
    {
      emptyMessage: "Máy chủ không trả về lịch sử hoạt động.",
      fallback: "Không thể tải lịch sử hoạt động lúc này.",
    },
  );
}
