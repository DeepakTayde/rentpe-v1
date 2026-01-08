import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface NotificationPreferences {
  id: string;
  user_id: string;
  visit_enabled: boolean;
  booking_enabled: boolean;
  maintenance_enabled: boolean;
  payment_enabled: boolean;
  system_enabled: boolean;
  lead_enabled: boolean;
  commission_enabled: boolean;
  property_enabled: boolean;
  service_enabled: boolean;
  agreement_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

const defaultPreferences: Omit<NotificationPreferences, 'id' | 'user_id'> = {
  visit_enabled: true,
  booking_enabled: true,
  maintenance_enabled: true,
  payment_enabled: true,
  system_enabled: true,
  lead_enabled: true,
  commission_enabled: true,
  property_enabled: true,
  service_enabled: true,
  agreement_enabled: true,
  email_notifications: false,
  push_notifications: false,
};

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setPreferences(data as NotificationPreferences);
      } else {
        // Return default preferences if none exist
        setPreferences({
          id: '',
          user_id: user.id,
          ...defaultPreferences
        });
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async (key: keyof Omit<NotificationPreferences, 'id' | 'user_id'>, value: boolean) => {
    if (!user) return { error: new Error("Not authenticated") };

    setIsSaving(true);
    
    // Optimistic update
    setPreferences(prev => prev ? { ...prev, [key]: value } : null);

    try {
      // Check if preferences exist
      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("notification_preferences")
          .update({ [key]: value })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new with this preference
        const { error } = await supabase
          .from("notification_preferences")
          .insert({
            user_id: user.id,
            ...defaultPreferences,
            [key]: value,
          });

        if (error) throw error;
        
        // Refetch to get the ID
        await fetchPreferences();
      }

      return { error: null };
    } catch (error) {
      console.error("Error updating preference:", error);
      // Revert on error
      fetchPreferences();
      return { error };
    } finally {
      setIsSaving(false);
    }
  };

  const updateAllPreferences = async (newPreferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id'>>) => {
    if (!user) return { error: new Error("Not authenticated") };

    setIsSaving(true);

    try {
      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("notification_preferences")
          .update(newPreferences)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("notification_preferences")
          .insert({
            user_id: user.id,
            ...defaultPreferences,
            ...newPreferences,
          });

        if (error) throw error;
      }

      await fetchPreferences();
      return { error: null };
    } catch (error) {
      console.error("Error updating preferences:", error);
      return { error };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    preferences,
    isLoading,
    isSaving,
    updatePreference,
    updateAllPreferences,
    refetch: fetchPreferences,
  };
}
