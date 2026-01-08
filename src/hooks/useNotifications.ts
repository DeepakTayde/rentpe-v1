import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type NotificationType = 
  | "visit" 
  | "booking" 
  | "maintenance" 
  | "payment" 
  | "system" 
  | "lead" 
  | "commission" 
  | "property" 
  | "service" 
  | "agreement";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications((data as Notification[]) || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updatedNotification.id ? updatedNotification : n
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert on error
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      fetchNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;

    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting notification:", error);
      fetchNotifications();
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;

    // Optimistic update
    setNotifications([]);

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      fetchNotifications();
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refetch: fetchNotifications,
  };
}

// Helper function to create a notification (for use in components)
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data: Record<string, unknown> = {},
  actionUrl?: string
) {
  try {
    const { data: result, error } = await supabase.rpc("create_notification", {
      p_user_id: userId,
      p_type: type,
      p_title: title,
      p_message: message,
      p_data: data as unknown as Record<string, never>,
      p_action_url: actionUrl || null,
    });

    if (error) throw error;
    return { data: result, error: null };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { data: null, error };
  }
}
