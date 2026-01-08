import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface PropertyBoost {
  id: string;
  property_id: string;
  owner_id: string;
  boost_type: 'featured' | 'premium' | 'spotlight';
  amount_paid: number;
  starts_at: string;
  ends_at: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  created_at: string;
}

export const BOOST_PLANS = [
  {
    id: 'featured',
    name: 'Featured',
    price: 199,
    duration: 7,
    description: 'Highlighted in search results',
    benefits: ['Badge on listing', '2x visibility', 'Priority in searches'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499,
    duration: 14,
    description: 'Top placement with analytics',
    benefits: ['Top of search results', '5x visibility', 'Performance analytics', 'Social media promotion'],
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    price: 999,
    duration: 30,
    description: 'Maximum exposure package',
    benefits: ['Homepage feature', '10x visibility', 'Dedicated agent support', 'Email campaign', 'WhatsApp promotion'],
  },
] as const;

export function usePropertyBoosts(propertyId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: boosts = [], isLoading } = useQuery({
    queryKey: ['property-boosts', user?.id, propertyId],
    queryFn: async () => {
      let query = supabase
        .from('property_boosts')
        .select('*')
        .eq('is_active', true);
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      } else if (user?.id) {
        query = query.eq('owner_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as PropertyBoost[];
    },
    enabled: !!user?.id || !!propertyId,
  });

  const createBoost = useMutation({
    mutationFn: async ({ 
      propertyId, 
      boostType, 
      durationDays 
    }: { 
      propertyId: string; 
      boostType: 'featured' | 'premium' | 'spotlight';
      durationDays: number;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const plan = BOOST_PLANS.find(p => p.id === boostType);
      if (!plan) throw new Error('Invalid boost type');
      
      const startsAt = new Date();
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + durationDays);
      
      const { data, error } = await supabase
        .from('property_boosts')
        .insert({
          property_id: propertyId,
          owner_id: user.id,
          boost_type: boostType,
          amount_paid: plan.price,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-boosts'] });
      toast.success('Property boosted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to boost property: ' + error.message);
    },
  });

  const cancelBoost = useMutation({
    mutationFn: async (boostId: string) => {
      const { error } = await supabase
        .from('property_boosts')
        .update({ is_active: false })
        .eq('id', boostId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-boosts'] });
      toast.success('Boost cancelled');
    },
    onError: (error) => {
      toast.error('Failed to cancel boost: ' + error.message);
    },
  });

  return {
    boosts,
    isLoading,
    createBoost,
    cancelBoost,
  };
}
