import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type LeadStatus = "new" | "contacted" | "visit_scheduled" | "visit_completed" | "onboarded" | "rejected" | "lost";

export interface OwnerLead {
  id: string;
  owner_id: string;
  agent_id: string | null;
  property_address: string;
  property_locality: string;
  city_id: string | null;
  status: LeadStatus;
  owner_name: string;
  owner_phone: string;
  owner_email: string | null;
  expected_rent: number | null;
  property_type: string | null;
  bedrooms: number | null;
  notes: string | null;
  agent_notes: string | null;
  contact_attempts: number;
  last_contact_at: string | null;
  visit_scheduled_at: string | null;
  visit_completed_at: string | null;
  onboarded_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentNotification {
  id: string;
  agent_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export function useOwnerLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<OwnerLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("owner_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads((data as unknown as OwnerLead[]) || []);
    } catch (error: unknown) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const updateLeadStatus = async (
    leadId: string,
    status: LeadStatus,
    additionalData?: Partial<OwnerLead>
  ) => {
    try {
      const updateData: Record<string, unknown> = { status, ...additionalData };

      // Set timestamps based on status
      if (status === "contacted") {
        updateData.last_contact_at = new Date().toISOString();
        updateData.contact_attempts = (leads.find(l => l.id === leadId)?.contact_attempts || 0) + 1;
      } else if (status === "visit_scheduled" && additionalData?.visit_scheduled_at) {
        updateData.visit_scheduled_at = additionalData.visit_scheduled_at;
      } else if (status === "visit_completed") {
        updateData.visit_completed_at = new Date().toISOString();
      } else if (status === "onboarded") {
        updateData.onboarded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("owner_leads")
        .update(updateData as Record<string, unknown>)
        .eq("id", leadId);

      if (error) throw error;

      await fetchLeads();
      toast.success(`Lead status updated to ${status.replace("_", " ")}`);
      return { error: null };
    } catch (error: unknown) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
      return { error };
    }
  };

  const addAgentNotes = async (leadId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("owner_leads")
        .update({ agent_notes: notes } as Record<string, unknown>)
        .eq("id", leadId);

      if (error) throw error;

      await fetchLeads();
      toast.success("Notes saved");
      return { error: null };
    } catch (error: unknown) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
      return { error };
    }
  };

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => lead.status === status);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    visitScheduled: leads.filter(l => l.status === "visit_scheduled").length,
    visitCompleted: leads.filter(l => l.status === "visit_completed").length,
    onboarded: leads.filter(l => l.status === "onboarded").length,
    rejected: leads.filter(l => l.status === "rejected").length,
    lost: leads.filter(l => l.status === "lost").length,
  };

  return {
    leads,
    isLoading,
    stats,
    updateLeadStatus,
    addAgentNotes,
    getLeadsByStatus,
    refetch: fetchLeads,
  };
}

export function useAgentNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AgentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("agent_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const notifs = (data as unknown as AgentNotification[]) || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.is_read).length);
    } catch (error: unknown) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("agent_notifications")
        .update({ is_read: true } as Record<string, unknown>)
        .eq("id", notificationId);

      if (error) throw error;
      await fetchNotifications();
    } catch (error: unknown) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("agent_notifications")
        .update({ is_read: true } as Record<string, unknown>)
        .eq("is_read", false);

      if (error) throw error;
      await fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error: unknown) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
