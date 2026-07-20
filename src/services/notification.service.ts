import { supabase } from "../lib/supabase";
import type { AppNotification, CreateNotificationInput } from "../features/notifications/types/notification.types";

const NOTIFICATION_STORAGE_KEY = "agromarket_notifications";

export const notificationService = {
  /**
   * Fetch all notifications for a specific user
   */
  async getNotifications(userId: string): Promise<AppNotification[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return this.getLocalNotifications(userId);
      }

      return data;
    } catch {
      return this.getLocalNotifications(userId);
    }
  },

  /**
   * Create and send a new notification
   */
  async createNotification(input: CreateNotificationInput): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...input,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert([newNotif])
        .select()
        .single();

      if (error) {
        this.saveLocalNotification(newNotif);
        return newNotif;
      }

      this.saveLocalNotification(data);
      return data;
    } catch {
      this.saveLocalNotification(newNotif);
      return newNotif;
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      this.markLocalRead(notificationId);
      return true;
    } catch {
      this.markLocalRead(notificationId);
      return true;
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId);

      this.markLocalAllRead(userId);
      return true;
    } catch {
      this.markLocalAllRead(userId);
      return true;
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      this.deleteLocalNotification(notificationId);
      return true;
    } catch {
      this.deleteLocalNotification(notificationId);
      return true;
    }
  },

  // Local storage helpers
  saveLocalNotification(notif: AppNotification) {
    try {
      const current = this.getLocalNotifications(notif.user_id);
      const updated = [notif, ...current.filter((n) => n.id !== notif.id)];
      localStorage.setItem(`${NOTIFICATION_STORAGE_KEY}_${notif.user_id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Notice: Local storage write failed", e);
    }
  },

  getLocalNotifications(userId: string): AppNotification[] {
    try {
      const raw = localStorage.getItem(`${NOTIFICATION_STORAGE_KEY}_${userId}`);
      if (!raw) {
        // Generate initial welcome notifications
        const defaultNotifs: AppNotification[] = [
          {
            id: "notif-1",
            user_id: userId,
            type: "order_placed",
            title: "Welcome to AgroMarket!",
            message: "Your farm account is active. Explore fresh harvests from verified local producers.",
            read: false,
            created_at: new Date().toISOString(),
          },
        ];
        return defaultNotifs;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  markLocalRead(id: string) {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(NOTIFICATION_STORAGE_KEY));
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list: AppNotification[] = JSON.parse(raw);
          const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
          localStorage.setItem(k, JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.warn("Failed to mark local read", e);
    }
  },

  markLocalAllRead(userId: string) {
    try {
      const key = `${NOTIFICATION_STORAGE_KEY}_${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: AppNotification[] = JSON.parse(raw);
        const updated = list.map((n) => ({ ...n, read: true }));
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("Failed to mark all local read", e);
    }
  },

  deleteLocalNotification(id: string) {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(NOTIFICATION_STORAGE_KEY));
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list: AppNotification[] = JSON.parse(raw);
          const updated = list.filter((n) => n.id !== id);
          localStorage.setItem(k, JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.warn("Failed to delete local notification", e);
    }
  },
};
