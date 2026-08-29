export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: {
    declarationId?: string;
    informationRequestId?: string;
    path?: string;
    publicCode?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
}
