import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import type { AppNotification, CreateNotificationInput } from "../features/notifications/types/notification.types";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  user: (userId: string) => ["notifications", userId] as const,
};

export function useNotifications(userId?: string) {
  return useQuery<AppNotification[], Error>({
    queryKey: NOTIFICATION_KEYS.user(userId || ""),
    queryFn: () => notificationService.getNotifications(userId!),
    enabled: Boolean(userId),
    refetchInterval: 1000 * 30, // 30s polling for new notifications
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation<AppNotification, Error, CreateNotificationInput>({
    mutationFn: (input) => notificationService.createNotification(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.user(variables.user_id) });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { id: string; userId: string }>({
    mutationFn: ({ id }) => notificationService.markAsRead(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.user(variables.userId) });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (userId) => notificationService.markAllAsRead(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.user(userId) });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { id: string; userId: string }>({
    mutationFn: ({ id }) => notificationService.deleteNotification(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.user(variables.userId) });
    },
  });
}
