import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type CommissionType = 'owner_onboarding' | 'tenant_placement' | 'monthly_recurring';
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface AgentCommission {
  id: string;
  agent_id: string;
  property_id: string | null;
  lead_id: string | null;
  booking_id: string | null;
  commission_type: CommissionType;
  base_amount: number;
  percentage: number;
  commission_amount: number;
  status: CommissionStatus;
  description: string | null;
  month_year: string | null;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
}

export interface CommissionSummary {
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  onboardingCommissions: number;
  placementCommissions: number;
  monthlyCommissions: number;
}

export const useAgentCommissions = () => {
  const { user } = useAuth();

  const { data: commissions, isLoading, refetch } = useQuery({
    queryKey: ['agent-commissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('agent_commissions')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AgentCommission[];
    },
    enabled: !!user?.id,
  });

  const summary: CommissionSummary = {
    totalEarnings: commissions?.reduce((sum, c) => sum + c.commission_amount, 0) || 0,
    pendingAmount: commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission_amount, 0) || 0,
    paidAmount: commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission_amount, 0) || 0,
    onboardingCommissions: commissions?.filter(c => c.commission_type === 'owner_onboarding').reduce((sum, c) => sum + c.commission_amount, 0) || 0,
    placementCommissions: commissions?.filter(c => c.commission_type === 'tenant_placement').reduce((sum, c) => sum + c.commission_amount, 0) || 0,
    monthlyCommissions: commissions?.filter(c => c.commission_type === 'monthly_recurring').reduce((sum, c) => sum + c.commission_amount, 0) || 0,
  };

  return {
    commissions: commissions || [],
    summary,
    isLoading,
    refetch,
  };
};
