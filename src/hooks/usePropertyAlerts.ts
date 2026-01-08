import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface PropertyAlert {
  id: string;
  user_id: string;
  name: string;
  city_id: string | null;
  property_type: string | null;
  min_budget: number | null;
  max_budget: number | null;
  min_bedrooms: number | null;
  max_bedrooms: number | null;
  furnishing: string | null;
  localities: string[] | null;
  is_active: boolean;
  notify_email: boolean;
  notify_push: boolean;
  last_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateAlertInput = Omit<PropertyAlert, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_notified_at'>;

export function usePropertyAlerts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['property-alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('property_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PropertyAlert[];
    },
    enabled: !!user?.id,
  });

  const createAlert = useMutation({
    mutationFn: async (input: CreateAlertInput) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const insertData = {
        user_id: user.id,
        name: input.name,
        city_id: input.city_id,
        property_type: input.property_type as any,
        min_budget: input.min_budget,
        max_budget: input.max_budget,
        min_bedrooms: input.min_bedrooms,
        max_bedrooms: input.max_bedrooms,
        furnishing: input.furnishing as any,
        localities: input.localities,
        is_active: input.is_active,
        notify_email: input.notify_email,
        notify_push: input.notify_push,
      };
      
      const { data, error } = await supabase
        .from('property_alerts')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast.success('Property alert created!');
    },
    onError: (error) => {
      toast.error('Failed to create alert: ' + error.message);
    },
  });

  const updateAlert = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PropertyAlert> & { id: string }) => {
      const updateData: Record<string, any> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.city_id !== undefined) updateData.city_id = updates.city_id;
      if (updates.property_type !== undefined) updateData.property_type = updates.property_type;
      if (updates.min_budget !== undefined) updateData.min_budget = updates.min_budget;
      if (updates.max_budget !== undefined) updateData.max_budget = updates.max_budget;
      if (updates.furnishing !== undefined) updateData.furnishing = updates.furnishing;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.notify_email !== undefined) updateData.notify_email = updates.notify_email;
      if (updates.notify_push !== undefined) updateData.notify_push = updates.notify_push;
      
      const { data, error } = await supabase
        .from('property_alerts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast.success('Alert updated!');
    },
    onError: (error) => {
      toast.error('Failed to update alert: ' + error.message);
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('property_alerts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-alerts'] });
      toast.success('Alert deleted!');
    },
    onError: (error) => {
      toast.error('Failed to delete alert: ' + error.message);
    },
  });

  return {
    alerts,
    isLoading,
    createAlert,
    updateAlert,
    deleteAlert,
  };
}
